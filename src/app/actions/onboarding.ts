"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface OnboardingInput {
  role: "mentee" | "mentor";
  username: string;
  bio?: string;
  skillTags?: string[];
  experienceYears?: number;
  availability?: string;
  minPricePerSession?: number;
}

export async function submitOnboarding(data: OnboardingInput) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  const email = session.user.email;

  try {
    // Cek jika username sudah terpakai
    if (data.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existingUser && existingUser.email !== email) {
        return { success: false, error: "Username sudah digunakan" };
      }
    }

    const roleMapped = data.role === "mentor" ? Role.mentor : Role.mentee;

    // Jalankan transaksi DB: update user dan create verification jika mentor
    await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { email },
        data: {
          role: roleMapped,
          username: data.username,
          bio: data.bio ?? null,
          skillTags: data.skillTags ?? [],
          experienceYears: data.experienceYears ?? null,
          availability: data.availability ?? null,
          minPricePerSession: data.minPricePerSession ?? null,
          onboardingCompleted: true,
        },
      });

      // Jika role adalah mentor, buat pengajuan verifikasi baru (status: pending)
      if (roleMapped === Role.mentor) {
        await tx.mentorVerification.upsert({
          where: { mentorId: updatedUser.id },
          create: {
            mentorId: updatedUser.id,
            status: "pending",
          },
          update: {
            status: "pending", // Reset ke pending jika onboarding diulang
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Gagal menyimpan data onboarding" };
  }
}
