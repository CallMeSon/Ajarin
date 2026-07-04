"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyMentor } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Mentor {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface Verification {
  id: number;
  mentorId: number;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  description: string | null;
  status: string;
  adminNotes: string | null;
  submittedAt: Date;
  mentor: Mentor;
}

export default function VerificationList({ verifications }: { verifications: Verification[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState("");

  const handleVerify = (mentorId: number, status: "approved" | "rejected") => {
    setError("");
    const adminNotes = notes[mentorId] || "";

    startTransition(async () => {
      const res = await verifyMentor(mentorId, status, adminNotes);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Gagal memproses verifikasi");
      }
    });
  };

  const handleNotesChange = (mentorId: number, value: string) => {
    setNotes({
      ...notes,
      [mentorId]: value,
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {verifications.length === 0 ? (
        <div className="bg-white border border-border/60 rounded-2xl p-12 text-center shadow-tinted">
          <span className="text-4xl">🎉</span>
          <h3 className="text-lg font-bold text-foreground mt-4">Semua verifikasi selesai</h3>
          <p className="text-muted-foreground text-sm mt-1">Belum ada pengajuan verifikasi mentor baru.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {verifications.map((v) => (
            <Card key={v.id} className="border border-border/60 bg-white rounded-2xl shadow-tinted overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-border/40 bg-[#fbfbfe]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-extrabold text-lg text-foreground">{v.mentor.name}</h3>
                    <Badge variant={v.status === "pending" ? "default" : v.status === "approved" ? "secondary" : "destructive"}>
                      {v.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.mentor.email}</p>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  Diajukan: {new Date(v.submittedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                  <div className="space-y-3">
                    {v.mentor.bio && (
                      <div>
                        <p className="font-bold text-foreground text-xs uppercase tracking-wider">Bio Singkat:</p>
                        <p className="mt-1 bg-accent/20 border border-border/40 rounded-xl p-3 text-xs italic">
                          "{v.mentor.bio}"
                        </p>
                      </div>
                    )}
                    {v.description && (
                      <div>
                        <p className="font-bold text-foreground text-xs uppercase tracking-wider">Keterangan Tambahan:</p>
                        <p className="mt-1 bg-accent/20 border border-border/40 rounded-xl p-3 text-xs">
                          {v.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 bg-[#fbfbfe] border border-border/40 rounded-xl p-4">
                    <p className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Tautan Portofolio & Sosmed:</p>
                    <div className="space-y-2 text-xs">
                      {v.portfolioUrl && (
                        <p>
                          🌐 <strong>Website:</strong>{" "}
                          <a href={v.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {v.portfolioUrl}
                          </a>
                        </p>
                      )}
                      {v.linkedinUrl && (
                        <p>
                          💼 <strong>LinkedIn:</strong>{" "}
                          <a href={v.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {v.linkedinUrl}
                          </a>
                        </p>
                      )}
                      {v.githubUrl && (
                        <p>
                          💻 <strong>GitHub:</strong>{" "}
                          <a href={v.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {v.githubUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {v.status === "pending" && (
                  <div className="border-t border-border/40 pt-4 mt-4 flex flex-col gap-3">
                    <label className="block text-xs font-semibold text-foreground">Catatan Admin (Opsional/Alasan Tolak):</label>
                    <input
                      type="text"
                      value={notes[v.mentorId] || ""}
                      onChange={(e) => handleNotesChange(v.mentorId, e.target.value)}
                      placeholder="Masukkan catatan tinjauan..."
                      className="block w-full px-3 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleVerify(v.mentorId, "rejected")}
                        disabled={isPending}
                        className="rounded-xl border border-destructive/30 hover:bg-destructive/5 text-destructive text-xs font-bold px-4 py-2"
                      >
                        Tolak
                      </Button>
                      <Button
                        onClick={() => handleVerify(v.mentorId, "approved")}
                        disabled={isPending}
                        className="rounded-xl bg-secondary hover:bg-[#00573b] text-white text-xs font-bold px-4 py-2"
                      >
                        Setujui Mentor
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
