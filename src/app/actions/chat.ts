"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function sendMessage(
  matchId: number,
  content: string | null,
  fileUrl?: string | null,
  fileName?: string | null
) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: user.id,
        content,
        fileUrl: fileUrl ?? null,
        fileName: fileName ?? null,
      },
    });

    return { success: true, message };
  } catch (error) {
    console.error("Send message action error:", error);
    return { success: false, error: "Gagal mengirim pesan" };
  }
}
