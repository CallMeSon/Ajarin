import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProposalForm from "./ProposalForm";
import ProposalList from "./ProposalList";
import { Role, RequestStatus } from "@prisma/client";

export const metadata = {
  title: "Detail Request Belajar — Ajarin",
};

export default async function RequestDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const requestId = Number(params.id);
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Cari user login
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      mentorVerification: true,
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  // Fetch request detail beserta mentee pencipta dan proposal yang masuk
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      mentee: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          bio: true,
        },
      },
      proposals: {
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              bio: true,
              ratingAvg: true,
              ratingCount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      match: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!request) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 pt-32 text-center">
          <span className="text-5xl">🚫</span>
          <h2 className="text-2xl font-bold mt-4">Request tidak ditemukan</h2>
          <p className="text-muted-foreground mt-2">Halaman yang Anda tuju telah dihapus atau tidak tersedia.</p>
          <Link href="/requests" className="inline-block mt-6">
            <Button variant="outline" className="rounded-xl">Kembali Jelajahi</Button>
          </Link>
        </main>
      </div>
    );
  }

  const isOwner = request.menteeId === dbUser.id;
  const isMentor = dbUser.role === Role.mentor;
  const hasApplied = isMentor && request.proposals.some((p) => p.mentorId === dbUser.id);
  const mentorProposal = hasApplied ? request.proposals.find((p) => p.mentorId === dbUser.id) : null;
  const isApprovedMentor = isMentor && dbUser.mentorVerification?.status === "approved";

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Request Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/60 shadow-tinted-lg rounded-2xl bg-white overflow-hidden p-6 sm:p-8 animate-fade-in-up">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Badge variant={request.status === "aktif" ? "default" : "secondary"} className="text-xs font-semibold capitalize">
                  {request.status}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Dibuat: {new Date(request.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>•</span>
                  <span>Deadline: {new Date(request.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-4">
                {request.title}
              </h1>

              {/* Creator Info */}
              <div className="flex items-center gap-3 border-t border-b border-border/40 py-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {request.mentee.name[0]}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diajukan oleh Mentee</p>
                  <h4 className="font-bold text-sm text-foreground">{request.mentee.name}</h4>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-2">Deskripsi Bimbingan</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line bg-[#fbfbfe] border border-border/40 rounded-2xl p-4 sm:p-6">
                    {request.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border/40 pt-6">
                  <div>
                    <h5 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Target Pertemuan</h5>
                    <p className="text-base font-extrabold text-foreground">{request.sessionCount} Sesi</p>
                  </div>
                  <div>
                    <h5 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Saran Budget / Sesi</h5>
                    <p className="text-base font-extrabold text-foreground">
                      Rp {request.budgetMin.toLocaleString("id-ID")} - {request.budgetMax.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Tingkat Kesulitan</h5>
                    <p className="text-base font-extrabold text-foreground capitalize">{request.level}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-6">
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2">Topik Terkait</h3>
                  <div className="flex flex-wrap gap-2">
                    {request.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs rounded-full font-semibold">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* If Mentee Creator: Show Proposals List */}
            {isOwner && (
              <ProposalList requestId={request.id} proposals={request.proposals} />
            )}
          </div>

          {/* RIGHT: Apply / Proposal Status */}
          <div className="space-y-6">
            {!isOwner && (
              <>
                {/* 1. Request is matched or completed */}
                {request.status !== RequestStatus.aktif ? (
                  <Card className="border border-border/60 bg-muted/30 rounded-2xl p-6 text-center shadow-tinted">
                    <span className="text-3xl">🤝</span>
                    <h3 className="text-base font-bold text-foreground mt-3">Request sudah matched</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mentee sudah memilih mentor untuk bimbingan ini.
                    </p>
                    {request.match && request.proposals.some((p) => p.mentorId === dbUser.id && p.status === "diterima") && (
                      <Link href={`/chat/${request.match.id}`} className="block mt-4">
                        <Button className="w-full rounded-xl bg-primary hover:bg-primary-deep text-xs font-bold text-white shadow-md">
                          💬 Hubungi Mentee (Buka Chat)
                        </Button>
                      </Link>
                    )}
                  </Card>
                ) : hasApplied ? (
                  /* 2. Mentor has already applied */
                  <Card className="border border-border/60 shadow-tinted rounded-2xl bg-white p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground">Proposal Anda</h3>
                      <Badge variant="default" className="text-xs">Pending</Badge>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>Tarif yang Anda tawarkan:</p>
                      <p className="text-lg font-extrabold text-foreground">
                        Rp {mentorProposal?.offeredPrice.toLocaleString("id-ID")} <span className="text-xs font-normal">/ sesi</span>
                      </p>
                      <div className="border-t border-border/40 pt-3 mt-3">
                        <p className="font-bold text-foreground">Kelebihan Diri:</p>
                        <p className="italic mt-1">"{mentorProposal?.strength}"</p>
                      </div>
                    </div>
                  </Card>
                ) : isMentor ? (
                  /* 3. Mentor wants to apply */
                  isApprovedMentor ? (
                    <ProposalForm
                      requestId={request.id}
                      budgetMin={request.budgetMin}
                      budgetMax={request.budgetMax}
                    />
                  ) : (
                    /* Mentor is not verified */
                    <Card className="border border-amber-200 bg-amber-50/50 shadow-tinted rounded-2xl p-6 text-center">
                      <span className="text-3xl">⏳</span>
                      <h3 className="text-base font-bold text-amber-950 mt-3 font-sans">Belum Terverifikasi</h3>
                      <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                        Akun Mentor Anda masih menunggu tinjauan dari Admin. Anda dapat mengirimkan proposal setelah akun Anda disetujui.
                      </p>
                    </Card>
                  )
                ) : (
                  /* Mentee viewer but not owner */
                  <Card className="border border-border/60 bg-white rounded-2xl p-6 text-center shadow-tinted">
                    <span className="text-3xl">🎓</span>
                    <h3 className="text-base font-bold text-foreground mt-3">Bukan Request Anda</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sebagai Mentee, Anda hanya dapat melihat proposal masuk untuk request yang Anda buat sendiri.
                    </p>
                  </Card>
                )}
              </>
            )}

            {/* Tips Card */}
            <Card className="border border-border/60 bg-white rounded-2xl p-6 shadow-tinted">
              <h4 className="font-bold text-sm text-foreground mb-3">💡 Panduan Sesi Ajarin</h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>Sesi bimbingan dilakukan di luar platform (Zoom, Google Meet, dll).</li>
                <li>Tidak ada payment gateway. Hubungi partner bimbingan Anda via chat untuk mendiskusikan metode pembayaran yang aman.</li>
                <li>Setelah semua sesi pertemuan selesai, harap lakukan penyelesaian sesi untuk mengisi ulasan.</li>
              </ul>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
