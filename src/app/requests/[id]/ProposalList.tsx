"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { selectProposal } from "@/app/actions/proposals";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Mentor {
  id: number;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  ratingAvg: any; // Decimal type from Prisma
  ratingCount: number;
}

interface Proposal {
  id: number;
  strength: string;
  method: string;
  message: string | null;
  offeredPrice: number;
  status: string;
  createdAt: Date;
  mentor: Mentor;
}

export default function ProposalList({ requestId, proposals }: { requestId: number; proposals: Proposal[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSelect = (proposalId: number) => {
    if (confirm("Apakah Anda yakin ingin memilih Mentor ini? Status request akan di-match dan chat akan dibuka.")) {
      setError("");
      startTransition(async () => {
        const res = await selectProposal(requestId, proposalId);
        if (res.success) {
          router.refresh();
          router.push(`/chat/${res.matchId}`);
        } else {
          setError(res.error || "Gagal mencocokkan mentor");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xl font-bold text-foreground">Daftar Proposal Masuk ({proposals.length})</h3>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="bg-white border border-border/60 rounded-2xl p-8 text-center shadow-tinted">
          <span className="text-3xl">📭</span>
          <h4 className="font-semibold mt-3">Belum ada proposal</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Belum ada mentor yang mengirim penawaran. Anda akan mendapatkan notifikasi email saat ada proposal baru.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <Card key={prop.id} className="border border-border/60 shadow-tinted rounded-2xl bg-white overflow-hidden hover:shadow-tinted-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 border-b border-border/40 bg-[#fbfbfe]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage src={prop.mentor.avatarUrl ?? undefined} />
                    <AvatarFallback>{prop.mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{prop.mentor.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="text-amber-500 font-bold">⭐ {Number(prop.mentor.ratingAvg).toFixed(1)}</span>
                      <span>({prop.mentor.ratingCount} review)</span>
                      {prop.mentor.username && (
                        <>
                          <span>•</span>
                          <a
                            href={`/mentor/${prop.mentor.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            Lihat profil publik
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tawaran Tarif</p>
                  <p className="text-base font-extrabold text-foreground mt-0.5">
                    Rp {prop.offeredPrice.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">/ sesi</span>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
                <div>
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">Kelebihan Diri:</h5>
                  <p className="bg-[#f8f9ff] border border-border/40 rounded-xl p-3 text-xs italic text-foreground whitespace-pre-line">
                    "{prop.strength}"
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">Metode Mengajar:</h5>
                  <p className="bg-[#f8f9ff] border border-border/40 rounded-xl p-3 text-xs text-foreground whitespace-pre-line">
                    {prop.method}
                  </p>
                </div>
                {prop.message && (
                  <div>
                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider mb-1">Pesan Ke Mentee:</h5>
                    <p className="bg-[#f8f9ff] border border-border/40 rounded-xl p-3 text-xs text-foreground whitespace-pre-line">
                      {prop.message}
                    </p>
                  </div>
                )}
              </CardContent>
              <div className="border-t border-border/40 p-4 bg-[#fbfbfe] flex justify-end">
                <Button
                  onClick={() => handleSelect(prop.id)}
                  disabled={isPending}
                  className="rounded-xl px-6 bg-primary hover:bg-primary-deep text-white font-bold text-xs shadow-md shadow-primary/10"
                >
                  {isPending ? "Memproses..." : "🤝 Terima & Hubungi Mentor"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
