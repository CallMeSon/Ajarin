import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role } from "@prisma/client";

export const metadata = {
  title: "Dashboard — Ajarin",
  description: "Kelola request, proposal, dan kelas bimbingan Anda di Ajarin.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Cari detail user di database
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    redirect("/");
  }

  if (!dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  // ─────────────────────────────────────────────
  // MENTEE DASHBOARD DATA FETCH
  // ─────────────────────────────────────────────
  if (dbUser.role === Role.mentee) {
    const requests = await prisma.request.findMany({
      where: { menteeId: dbUser.id },
      include: {
        _count: {
          select: { proposals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activeMatchesCount = await prisma.match.count({
      where: {
        menteeId: dbUser.id,
        status: "aktif",
      },
    });

    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Selamat datang, {dbUser.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Kelola bimbingan dan cari mentor terbaik untuk proyek Anda.
              </p>
            </div>
            <Link href="/requests/new">
              <Button className="rounded-xl px-6 bg-gradient-to-r from-primary to-primary-deep shadow-md shadow-primary/20 hover:opacity-95 transition-all">
                ✨ Buat Request Baru
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-border/60 shadow-tinted rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription>Total Request Belajar</CardDescription>
                <CardTitle className="text-3xl font-bold">{requests.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border border-border/60 shadow-tinted rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription>Match Aktif</CardDescription>
                <CardTitle className="text-3xl font-bold text-primary">{activeMatchesCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border border-border/60 shadow-tinted rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription>Role Anda</CardDescription>
                <CardTitle className="text-3xl font-bold text-secondary capitalize">{dbUser.role}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Requests Section */}
          <Card className="border border-border/60 shadow-tinted-lg rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-border/60 bg-[#fbfbfe]">
              <CardTitle className="text-xl font-bold">Daftar Request Belajar Anda</CardTitle>
              <CardDescription>Semua permintaan mentoring yang telah Anda publikasikan.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {requests.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="text-4xl">📝</span>
                  <h3 className="text-lg font-semibold text-foreground mt-4">Belum ada request</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                    Buat request belajar pertama Anda untuk mulai menerima penawaran dari mentor profesional.
                  </p>
                  <Link href="/requests/new" className="inline-block mt-4">
                    <Button variant="outline" className="rounded-xl">Buat Sekarang</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {requests.map((req) => (
                    <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-accent/10 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-foreground hover:text-primary transition-colors">
                            <Link href={`/requests/${req.id}`}>{req.title}</Link>
                          </h4>
                          <Badge variant={req.status === "aktif" ? "default" : req.status === "matched" ? "secondary" : "outline"}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Sesi: <strong>{req.sessionCount}x</strong></span>
                          <span>•</span>
                          <span>Budget: <strong>Rp {req.budgetMin.toLocaleString("id-ID")} - Rp {req.budgetMax.toLocaleString("id-ID")}</strong></span>
                          <span>•</span>
                          <span>Deadline: <strong>{new Date(req.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:self-center">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-foreground">{req._count.proposals} proposal</p>
                          <p className="text-xs text-muted-foreground">telah masuk</p>
                        </div>
                        <Link href={`/requests/${req.id}`}>
                          <Button variant="outline" className="rounded-xl">
                            Detail Request
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // MENTOR DASHBOARD DATA FETCH
  // ─────────────────────────────────────────────
  const verification = await prisma.mentorVerification.findUnique({
    where: { mentorId: dbUser.id },
  });

  const proposals = await prisma.proposal.findMany({
    where: { mentorId: dbUser.id },
    include: {
      request: {
        select: {
          title: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const matches = await prisma.match.findMany({
    where: { mentorId: dbUser.id },
    include: {
      mentee: {
        select: {
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
    orderBy: { matchedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Selamat datang, {dbUser.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Temukan murid potensial dan bagikan keahlian mengajar Anda.
            </p>
          </div>
          <Link href="/requests">
            <Button className="rounded-xl px-6 bg-gradient-to-r from-secondary to-[#008f60] text-white shadow-md shadow-secondary/20 hover:opacity-95 transition-all">
              🔍 Jelajahi Request Aktif
            </Button>
          </Link>
        </div>

        {/* Verification Status Alert */}
        {verification && verification.status === "pending" && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-tinted animate-pulse-glow">
            <span className="text-2xl mt-0.5">⏳</span>
            <div>
              <h4 className="font-bold">Akun Mentor Sedang Diverifikasi</h4>
              <p className="text-sm text-amber-800 mt-0.5">
                Admin sedang meninjau kelayakan profil Anda. Anda dapat menjelajahi request aktif, tetapi belum dapat mengirimkan proposal ke Mentee sampai verifikasi disetujui.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-border/60 shadow-tinted rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription>Proposal Dikirim</CardDescription>
              <CardTitle className="text-3xl font-bold">{proposals.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border border-border/60 shadow-tinted rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription>Kelas Bimbingan Aktif (Match)</CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">{matches.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border border-border/60 shadow-tinted rounded-2xl">
            <CardHeader className="pb-2">
              <CardDescription>Rating Rata-rata</CardDescription>
              <CardTitle className="text-3xl font-bold text-amber-600">
                ⭐ {Number(dbUser.ratingAvg).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">({dbUser.ratingCount} Ulasan)</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Matches (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-border/60 shadow-tinted-lg rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-border/60 bg-[#fbfbfe]">
                <CardTitle className="text-lg font-bold">Daftar Match & Bimbingan Aktif</CardTitle>
                <CardDescription>Hubungi mentee Anda untuk koordinasi bimbingan.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {matches.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <span className="text-4xl">🤝</span>
                    <h3 className="text-base font-semibold text-foreground mt-3">Belum ada match aktif</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Kirimkan proposal berkualitas ke request mentee untuk mendapatkan kelas bimbingan pertama Anda.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {matches.map((m) => (
                      <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {m.mentee.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{m.request.title}</h4>
                            <p className="text-xs text-muted-foreground">Mentee: {m.mentee.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/chat/${m.id}`}>
                            <Button size="sm" className="rounded-lg bg-primary hover:bg-primary-deep text-white text-xs">
                              💬 Buka Chat
                            </Button>
                          </Link>
                          {m.status === "aktif" && (
                            <Badge variant="secondary" className="text-xs">Aktif</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal History */}
            <Card className="border border-border/60 shadow-tinted-lg rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-border/60 bg-[#fbfbfe]">
                <CardTitle className="text-lg font-bold">Riwayat Proposal Anda</CardTitle>
                <CardDescription>Status penawaran yang sudah Anda ajukan ke Mentee.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {proposals.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <span className="text-4xl">📨</span>
                    <h3 className="text-base font-semibold text-foreground mt-3">Belum ada proposal</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Anda belum mengirim proposal apa pun. Jelajahi request aktif untuk mulai melamar.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {proposals.map((prop) => (
                      <div key={prop.id} className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{prop.request.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Penawaran Anda: <strong>Rp {prop.offeredPrice.toLocaleString("id-ID")}</strong> / Sesi
                          </p>
                        </div>
                        <Badge
                          variant={
                            prop.status === "diterima"
                              ? "secondary"
                              : prop.status === "pending"
                              ? "default"
                              : "destructive"
                          }
                          className="capitalize text-xs"
                        >
                          {prop.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: Recommendation or Tips */}
          <div className="space-y-6">
            <Card className="border border-border/60 shadow-tinted rounded-2xl bg-white p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">💡 Tips Sukses Mentor</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>✨</span>
                  <span>Tulis proposal secara detail dan spesifik, sesuaikan dengan problem codebase yang dihadapi Mentee.</span>
                </li>
                <li className="flex gap-2">
                  <span>📅</span>
                  <span>Jaga ketersediaan waktu mengajar Anda agar tetap ter-update di profil publik.</span>
                </li>
                <li className="flex gap-2">
                  <span>💬</span>
                  <span>Gunakan chat room pasca-match secepatnya untuk menyepakati tanggal pertemuan pertama.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
