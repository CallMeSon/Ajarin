"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreateRequestInput {
  title: string;
  tags: string[];
  level: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  sessionCount: number;
  deadline: string; // ISO date string
}

export async function createRequest(data: CreateRequestInput) {
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
      return { success: false, error: "Hanya mentee yang dapat membuat request" };
    }

    const budgetMin = Number(data.budgetMin);
    const budgetMax = Number(data.budgetMax);
    const sessionCount = Number(data.sessionCount);

    // Validasi input dasar
    if (budgetMin < 50000) {
      return { success: false, error: "Budget minimal adalah Rp 50.000" };
    }
    if (budgetMax < budgetMin) {
      return { success: false, error: "Budget maksimal tidak boleh kurang dari budget minimal" };
    }
    if (sessionCount < 1) {
      return { success: false, error: "Jumlah sesi minimal adalah 1" };
    }
    if (!data.title.trim() || data.title.length > 100) {
      return { success: false, error: "Judul wajib diisi dan maksimal 100 karakter" };
    }
    if (data.description.trim().length < 100) {
      return { success: false, error: "Deskripsi wajib diisi minimal 100 karakter" };
    }

    const newRequest = await prisma.request.create({
      data: {
        menteeId: user.id,
        title: data.title,
        tags: data.tags,
        level: data.level,
        description: data.description,
        budgetMin,
        budgetMax,
        sessionCount,
        deadline: new Date(data.deadline),
        status: RequestStatus.aktif,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/requests");

    return { success: true, id: newRequest.id };
  } catch (error) {
    console.error("Create request error:", error);
    return { success: false, error: "Gagal membuat request belajar" };
  }
}
