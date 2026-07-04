import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReviewForm from "./ReviewForm";
import { MatchStatus, Role } from "@prisma/client";

export const metadata = {
  title: "Tulis Ulasan Mentor — Ajarin",
  description: "Bagikan pengalaman belajar Anda bersama mentor.",
};

export default async function NewReviewPage(props: {
  searchParams: Promise<{ matchId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const matchId = Number(searchParams.matchId);
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  if (!matchId) {
    redirect("/dashboard");
  }

  // Cek user login
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser || dbUser.role !== Role.mentee) {
    redirect("/dashboard");
  }

  // Verifikasi match
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      mentor: {
        select: {
          name: true,
        },
      },
      review: true,
    },
  });

  if (!match || match.menteeId !== dbUser.id) {
    redirect("/dashboard");
  }

  if (match.status !== MatchStatus.selesai) {
    redirect(`/chat/${matchId}`);
  }

  if (match.review) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <ReviewForm matchId={matchId} mentorName={match.mentor.name} />
      </main>
    </div>
  );
}
