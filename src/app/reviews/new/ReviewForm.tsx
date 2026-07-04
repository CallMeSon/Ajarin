"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/app/actions/matches";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewForm({ matchId, mentorName }: { matchId: number; mentorName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (comment.length < 20) {
      setError("Ulasan minimal 20 karakter agar memberikan feedback yang jelas bagi mentor");
      return;
    }

    startTransition(async () => {
      const res = await submitReview({
        matchId,
        rating,
        comment,
      });

      if (res.success) {
        router.refresh();
        router.push("/dashboard");
      } else {
        setError(res.error || "Gagal mengirim ulasan");
      }
    });
  };

  return (
    <Card className="border border-border/80 bg-white shadow-tinted-lg rounded-3xl overflow-hidden animate-fade-in-up">
      <CardHeader className="pt-8 px-8 pb-4 text-center">
        <span className="text-4xl">⭐</span>
        <CardTitle className="text-2xl font-extrabold text-foreground mt-3">
          Berikan Ulasan untuk {mentorName}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Bagikan pengalaman belajar Anda untuk membantu mentee lain dan mengembangkan keahlian mengajar Mentor.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="px-8 py-4 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* Star Selection */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Rating Bimbingan</label>
            <div className="flex gap-2 text-3xl mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`hover:scale-110 transition-transform ${
                    rating >= star ? "text-amber-400" : "text-muted"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Ulasan Anda</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              rows={5}
              placeholder="Ceritakan bagaimana mentor membantu Anda, kesesuaian materi, keramahan, ketepatan waktu bimbingan..."
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Minimal 20 karakter. Saat ini: {comment.length} karakter.
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={isPending}
            className="px-6 py-5 rounded-xl border border-border text-foreground text-xs"
          >
            Lewati
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="ml-auto px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-bold text-xs shadow-md"
          >
            {isPending ? "Mengirim..." : "Kirim Ulasan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
