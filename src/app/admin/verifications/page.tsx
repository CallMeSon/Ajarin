import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import VerificationList from "./VerificationList";
import { Role } from "@prisma/client";

export const metadata = {
  title: "Verifikasi Mentor (Admin) — Ajarin",
  description: "Dashboard verifikasi kelayakan mentor di Ajarin.",
};

export default async function AdminVerificationsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Tinjau apakah user di DB adalah Admin
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser || dbUser.role !== Role.admin) {
    redirect("/dashboard");
  }

  // Ambil data verifikasi mentor
  const verifications = await prisma.mentorVerification.findMany({
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Verifikasi Calon Mentor
          </h1>
          <p className="text-muted-foreground mt-1">
            Tinjau pengajuan dari para profesional sebelum mereka dapat mengirim proposal ke Mentee.
          </p>
        </div>

        <VerificationList verifications={verifications} />
      </main>
    </div>
  );
}
