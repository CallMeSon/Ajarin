"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function verifyMentor(mentorId: number, status: "approved" | "rejected", adminNotes?: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Validasi apakah user adalah Admin
    if (!adminUser || adminUser.role !== Role.admin) {
      return { success: false, error: "Hanya Admin yang dapat memproses verifikasi" };
    }

    const verificationStatus = status === "approved" ? VerificationStatus.approved : VerificationStatus.rejected;

    await prisma.mentorVerification.update({
      where: { mentorId },
      data: {
        status: verificationStatus,
        adminNotes: adminNotes ?? null,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin/verifications");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Verify mentor error:", error);
    return { success: false, error: "Gagal memproses verifikasi" };
  }
}
