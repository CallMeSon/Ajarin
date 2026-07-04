import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Jelajahi Request Belajar — Ajarin",
  description: "Cari mentee yang membutuhkan keahlian Anda dan kirimkan proposal Anda.",
};

interface SearchParams {
  q?: string;
  tag?: string;
  level?: string;
  sortBy?: string;
}

export default async function ExploreRequestsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Ambil data user
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    redirect("/");
  }

  // Hanya mentor dan admin yang bisa melihat explore requests (atau mentee juga boleh browse)
  // PRD F-04: Browse & Apply - Mentor. Mentor browse dan apply.
  // Kita izinkan semua authenticated users untuk melihat list, tapi form apply hanya untuk mentor.

  // Build filter query
  const whereClause: Prisma.RequestWhereInput = {
    status: "aktif",
  };

  const andConditions: Prisma.RequestWhereInput[] = [];

  if (searchParams.q) {
    andConditions.push({
      OR: [
        { title: { contains: searchParams.q, mode: "insensitive" } },
        { description: { contains: searchParams.q, mode: "insensitive" } },
      ],
    });
  }

  if (searchParams.tag) {
    andConditions.push({
      tags: { has: searchParams.tag.toLowerCase() },
    });
  }

  if (searchParams.level) {
    andConditions.push({
      level: searchParams.level,
    });
  }

  if (andConditions.length > 0) {
    whereClause.AND = andConditions;
  }

  // Sorting
  let orderByClause: Prisma.RequestOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (searchParams.sortBy === "budget_desc") {
    orderByClause = {
      budgetMax: "desc",
    };
  }

  const requests = await prisma.request.findMany({
    where: whereClause,
    include: {
      mentee: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { proposals: true },
      },
    },
    orderBy: orderByClause,
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Intro */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Jelajahi Request Belajar
          </h1>
          <p className="text-muted-foreground mt-1">
            Temukan mentee yang sedang butuh bimbingan dan ajukan proposal Anda.
          </p>
        </div>

        {/* Filter Bar (Simple Server Forms) */}
        <div className="bg-white border border-border/60 rounded-2xl p-4 mb-8 shadow-tinted flex flex-col md:flex-row gap-4 items-center justify-between">
          <form method="GET" action="/requests" className="flex-1 w-full flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q || ""}
              placeholder="Cari kata kunci (misal: react, sql)..."
              className="flex-1 px-4 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <select
              name="level"
              defaultValue={searchParams.level || ""}
              className="px-4 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm capitalize"
            >
              <option value="">Semua Level</option>
              <option value="pemula">pemula</option>
              <option value="menengah">menengah</option>
              <option value="mahir">mahir</option>
            </select>

            <select
              name="sortBy"
              defaultValue={searchParams.sortBy || ""}
              className="px-4 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Urutkan: Terbaru</option>
              <option value="budget_desc">Budget Tertinggi</option>
            </select>

            <Button type="submit" className="rounded-xl px-5 bg-primary hover:bg-primary-deep text-white font-semibold">
              Cari
            </Button>
          </form>
        </div>

        {/* Request Grid */}
        {requests.length === 0 ? (
          <div className="bg-white border border-border/60 rounded-2xl p-12 text-center shadow-tinted">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold text-foreground mt-4">Tidak ada request aktif</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
              Cobalah mengganti kata kunci pencarian atau filter Anda untuk menemukan request belajar lainnya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <Card key={req.id} className="border border-border/60 hover:border-primary/40 bg-white shadow-tinted hover:shadow-tinted-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="capitalize text-xs font-semibold">
                      {req.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    <Link href={`/requests/${req.id}`}>{req.title}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                      {req.mentee.name[0]}
                    </div>
                    <span className="text-xs font-medium">{req.mentee.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3 text-sm text-muted-foreground line-clamp-3">
                  {req.description}
                </CardContent>
                <CardContent className="pb-3 pt-0 flex flex-wrap gap-1">
                  {req.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-2 rounded-md font-medium">
                      #{tag}
                    </Badge>
                  ))}
                </CardContent>
                <div className="border-t border-border/40 p-4 bg-[#fbfbfe] flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Budget / Sesi</p>
                    <p className="text-sm font-bold text-foreground">
                      Rp {req.budgetMin.toLocaleString("id-ID")} - {req.budgetMax.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link href={`/requests/${req.id}`}>
                    <Button size="sm" className="rounded-lg bg-primary hover:bg-primary-deep text-white text-xs">
                      Lihat Detail ({req._count.proposals})
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
