import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatRoom from "./ChatRoom";

export const metadata = {
  title: "Chat Room Bimbingan — Ajarin",
};

export default async function ChatPage(props: {
  params: Promise<{ matchId: string }>;
}) {
  const params = await props.params;
  const matchId = Number(params.matchId);
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    redirect("/");
  }

  // Fetch match details
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      mentee: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      mentor: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      request: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!match) {
    redirect("/dashboard");
  }

  // Validasi apakah user terhubung dengan match ini
  if (match.menteeId !== dbUser.id && match.mentorId !== dbUser.id) {
    redirect("/dashboard");
  }

  // Ambil history chat sebelumnya
  const initialMessages = await prisma.message.findMany({
    where: { matchId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { sentAt: "asc" },
  });

  // Partner bimbingan
  const partner = dbUser.role === "mentee" ? match.mentor : match.mentee;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 h-[calc(100vh-80px)]">
        <ChatRoom
          matchId={matchId}
          currentUser={dbUser}
          partner={partner}
          requestTitle={match.request.title}
          initialMessages={initialMessages}
          matchStatus={match.status}
          validationInitiatedAt={match.validationInitiatedAt ? match.validationInitiatedAt.toISOString() : null}
        />
      </main>
    </div>
  );
}
