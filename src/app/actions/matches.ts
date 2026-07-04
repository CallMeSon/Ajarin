"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, MatchStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function initiateCompletion(matchId: number) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== Role.mentor) {
      return { success: false, error: "Hanya mentor yang dapat menginisiasi penyelesaian sesi" };
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.mentorId !== user.id) {
      return { success: false, error: "Match tidak ditemukan" };
    }

    if (match.status !== MatchStatus.aktif) {
      return { success: false, error: "Match sudah selesai atau tidak aktif" };
    }

    await prisma.match.update({
      where: { id: matchId },
      data: {
        validationInitiatedAt: new Date(),
      },
    });

    revalidatePath(`/chat/${matchId}`);
    return { success: true };
  } catch (error) {
    console.error("Initiate completion error:", error);
    return { success: false, error: "Gagal memproses penyelesaian" };
  }
}

export async function confirmCompletion(matchId: number) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== Role.mentee) {
      return { success: false, error: "Hanya mentee yang dapat mengonfirmasi penyelesaian" };
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.menteeId !== user.id) {
      return { success: false, error: "Match tidak ditemukan" };
    }

    if (match.status !== MatchStatus.aktif) {
      return { success: false, error: "Match sudah selesai" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Set match status to selesai
      await tx.match.update({
        where: { id: matchId },
        data: {
          status: MatchStatus.selesai,
          completedAt: new Date(),
        },
      });

      // 2. Set request status to selesai
      await tx.request.update({
        where: { id: match.requestId },
        data: { status: "selesai" },
      });
    });

    revalidatePath(`/chat/${matchId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Confirm completion error:", error);
    return { success: false, error: "Gagal mengonfirmasi penyelesaian" };
  }
}

interface CreateReviewInput {
  matchId: number;
  rating: number;
  comment: string;
}

export async function submitReview(data: CreateReviewInput) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== Role.mentee) {
      return { success: false, error: "Hanya mentee yang dapat mengirim ulasan" };
    }

    const match = await prisma.match.findUnique({
      where: { id: data.matchId },
      include: {
        review: true,
      },
    });

    if (!match || match.menteeId !== user.id) {
      return { success: false, error: "Bimbingan tidak ditemukan" };
    }

    if (match.status !== MatchStatus.selesai) {
      return { success: false, error: "Bimbingan belum selesai atau ditutup" };
    }

    if (match.review) {
      return { success: false, error: "Anda sudah memberikan review untuk bimbingan ini" };
    }

    const rating = Number(data.rating);
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating harus berada di antara 1 dan 5" };
    }
    if (data.comment.trim().length < 20) {
      return { success: false, error: "Ulasan wajib diisi minimal 20 karakter" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Buat review baru
      await tx.review.create({
        data: {
          matchId: data.matchId,
          menteeId: user.id,
          mentorId: match.mentorId,
          rating,
          comment: data.comment,
        },
      });

      // 2. Ambil seluruh review Mentor untuk update aggregasi
      const reviews = await tx.review.findMany({
        where: { mentorId: match.mentorId },
        select: { rating: true },
      });

      const ratingCount = reviews.length;
      const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
      const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : 0;

      // 3. Update data rating di profil user mentor
      await tx.user.update({
        where: { id: match.mentorId },
        data: {
          ratingAvg: new Prisma.Decimal(ratingAvg),
          ratingCount,
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Submit review error:", error);
    return { success: false, error: "Gagal mengirim ulasan" };
  }
}
