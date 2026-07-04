"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProposal } from "@/app/actions/proposals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProposalForm({ requestId, budgetMin, budgetMax }: { requestId: number; budgetMin: number; budgetMax: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [strength, setStrength] = useState("");
  const [method, setMethod] = useState("");
  const [message, setMessage] = useState("");
  const [offeredPrice, setOfferedPrice] = useState(budgetMin);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (strength.length < 50) {
      setError("Kelebihan diri minimal 50 karakter");
      return;
    }
    if (method.length < 50) {
      setError("Metode mengajar minimal 50 karakter");
      return;
    }
    if (offeredPrice < 50000) {
      setError("Penawaran harga minimal adalah Rp 50.000");
      return;
    }

    startTransition(async () => {
      const res = await createProposal({
        requestId,
        strength,
        method,
        message,
        offeredPrice,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengirim proposal");
      }
    });
  };

  if (success) {
    return (
      <Card className="border border-secondary/20 bg-secondary/5 rounded-2xl p-6 text-center animate-fade-in-up">
        <span className="text-4xl">🎉</span>
        <h3 className="text-lg font-bold text-secondary mt-3">Proposal Terkirim!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Proposal Anda telah sukses dikirimkan ke Mentee. Anda akan mendapatkan notifikasi email jika terpilih.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 shadow-tinted rounded-2xl bg-white overflow-hidden animate-fade-in-up">
      <CardHeader className="border-b border-border/40 bg-[#fbfbfe] p-6">
        <CardTitle className="text-lg font-bold">Kirim Proposal Lamaran</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Berikan penawaran terbaik Anda sesuai dengan detail request bimbingan Mentee.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Mengapa Mentee Harus Memilih Anda?</label>
            <textarea
              required
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="block w-full px-3 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              rows={4}
              placeholder="Jelaskan keahlian Anda yang relevan dengan problem bimbingan, portofolio, atau pengalaman kerja Anda..."
            />
            <p className="text-[10px] text-right text-muted-foreground mt-1">Min. 50 karakter ({strength.length})</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Pendekatan & Metode Mengajar</label>
            <textarea
              required
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="block w-full px-3 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              rows={4}
              placeholder="Bagaimana Anda akan menyampaikan sesi? Apakah live coding, tugas mandiri, review PR, dll..."
            />
            <p className="text-[10px] text-right text-muted-foreground mt-1">Min. 50 karakter ({method.length})</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Pesan Tambahan ke Mentee</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full px-3 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              rows={2}
              placeholder="Klarifikasi budget, jadwal potensial, atau salam pembuka..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Penawaran Tarif per Sesi (Rp)</label>
            <input
              type="number"
              min="50000"
              required
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(Number(e.target.value))}
              className="block w-full px-3 py-2 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Saran budget Mentee: <strong>Rp {budgetMin.toLocaleString("id-ID")} - {budgetMax.toLocaleString("id-ID")}</strong>
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-[#fbfbfe] border-t border-border/40">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-semibold text-sm shadow-md"
          >
            {isPending ? "Mengirim..." : "Kirimkan Proposal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
