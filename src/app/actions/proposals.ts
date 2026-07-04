"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, ProposalStatus, RequestStatus, MatchStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  sendNewProposalEmail,
  sendProposalAcceptedEmail,
  sendProposalRejectedEmail,
} from "@/lib/email";

interface CreateProposalInput {
  requestId: number;
  strength: string;
  method: string;
  message?: string;
  offeredPrice: number;
}

export async function createProposal(data: CreateProposalInput) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  const email = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        mentorVerification: true,
      },
    });

    if (!user || user.role !== Role.mentor) {
      return { success: false, error: "Hanya mentor yang dapat mengirim proposal" };
    }

    // Periksa status verifikasi
    if (!user.mentorVerification || user.mentorVerification.status !== "approved") {
      return {
        success: false,
        error: "Profil Mentor Anda belum disetujui oleh admin untuk mengirim proposal",
      };
    }

    const offeredPrice = Number(data.offeredPrice);

    if (offeredPrice < 50000) {
      return { success: false, error: "Penawaran harga minimal adalah Rp 50.000" };
    }
    if (!data.strength.trim() || data.strength.length < 50) {
      return { success: false, error: "Kelebihan diri minimal 50 karakter" };
    }
    if (!data.method.trim() || data.method.length < 50) {
      return { success: false, error: "Metode mengajar minimal 50 karakter" };
    }

    // Periksa apakah sudah pernah apply sebelumnya
    const existing = await prisma.proposal.findUnique({
      where: {
        requestId_mentorId: {
          requestId: data.requestId,
          mentorId: user.id,
        },
      },
    });

    if (existing) {
      return { success: false, error: "Anda sudah mengirimkan proposal untuk request ini" };
    }

    const request = await prisma.request.findUnique({
      where: { id: data.requestId },
      include: {
        mentee: { select: { email: true, name: true } },
      },
    });

    if (!request || request.status !== RequestStatus.aktif) {
      return { success: false, error: "Request tidak aktif atau tidak ditemukan" };
    }

    const newProposal = await prisma.proposal.create({
      data: {
        requestId: data.requestId,
        mentorId: user.id,
        strength: data.strength,
        method: data.method,
        message: data.message ?? null,
        offeredPrice,
        status: ProposalStatus.pending,
      },
    });

    // Kirim notifikasi email ke Mentee via Resend
    try {
      await sendNewProposalEmail({
        menteeEmail: request.mentee.email,
        menteeName: request.mentee.name,
        mentorName: user.name,
        requestTitle: request.title,
        requestId: request.id,
      });
    } catch (emailErr) {
      console.error("Gagal mengirim email notifikasi proposal:", emailErr);
    }

    revalidatePath(`/requests/${data.requestId}`);
    revalidatePath("/dashboard");

    return { success: true, id: newProposal.id };
  } catch (error) {
    console.error("Create proposal error:", error);
    return { success: false, error: "Gagal mengirim proposal" };
  }
}

export async function selectProposal(requestId: number, proposalId: number) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  const email = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== Role.mentee) {
      return { success: false, error: "Aksi tidak diizinkan" };
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        proposals: {
          include: {
            mentor: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!request || request.menteeId !== user.id) {
      return { success: false, error: "Request tidak ditemukan" };
    }

    if (request.status !== RequestStatus.aktif) {
      return { success: false, error: "Request sudah di-match atau tidak aktif" };
    }

    const selectedProposal = request.proposals.find((p) => p.id === proposalId);
    if (!selectedProposal) {
      return { success: false, error: "Proposal tidak ditemukan" };
    }

    let matchId = 0;

    await prisma.$transaction(async (tx) => {
      // 1. Update status request
      await tx.request.update({
        where: { id: requestId },
        data: { status: RequestStatus.matched },
      });

      // 2. Update status proposal yang terpilih
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: ProposalStatus.diterima },
      });

      // 3. Update status proposal lainnya menjadi ditolak
      await tx.proposal.updateMany({
        where: {
          requestId,
          id: { not: proposalId },
        },
        data: { status: ProposalStatus.ditolak },
      });

      // 4. Buat match record
      const match = await tx.match.create({
        data: {
          requestId,
          proposalId,
          menteeId: user.id,
          mentorId: selectedProposal.mentorId,
          status: MatchStatus.aktif,
        },
      });

      matchId = match.id;
    });

    // Kirim notifikasi email via Resend (di luar transaksi agar tidak membebani DB)
    // Email ke mentor terpilih (diterima)
    try {
      await sendProposalAcceptedEmail({
        mentorEmail: selectedProposal.mentor.email,
        mentorName: selectedProposal.mentor.name,
        menteeName: user.name,
        requestTitle: request.title,
        matchId,
      });

      // Email ke mentor lainnya yang ditolak
      const otherProposals = request.proposals.filter((p) => p.id !== proposalId);
      for (const prop of otherProposals) {
        await sendProposalRejectedEmail({
          mentorEmail: prop.mentor.email,
          mentorName: prop.mentor.name,
          requestTitle: request.title,
        });
      }
    } catch (emailErr) {
      console.error("Email notification matching error:", emailErr);
    }

    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/dashboard");

    return { success: true, matchId };
  } catch (error) {
    console.error("Select proposal error:", error);
    return { success: false, error: "Gagal memilih mentor" };
  }
}
