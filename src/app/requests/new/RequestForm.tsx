"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRequest } from "@/app/actions/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [level, setLevel] = useState("pemula");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState(50000);
  const [budgetMax, setBudgetMax] = useState(200000);
  const [sessionCount, setSessionCount] = useState(1);
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (title.length > 100) {
      setError("Judul maksimal 100 karakter");
      return;
    }
    if (description.length < 100) {
      setError("Deskripsi minimal 100 karakter agar mentor dapat memahami kebutuhan Anda");
      return;
    }
    if (budgetMin < 50000) {
      setError("Budget minimal per sesi adalah Rp 50.000");
      return;
    }
    if (budgetMax < budgetMin) {
      setError("Budget maksimal tidak boleh kurang dari budget minimal");
      return;
    }
    if (!deadline) {
      setError("Tanggal deadline wajib ditentukan");
      return;
    }

    startTransition(async () => {
      const res = await createRequest({
        title,
        tags,
        level,
        description,
        budgetMin,
        budgetMax,
        sessionCount,
        deadline,
      });

      if (res.success) {
        router.refresh();
        router.push("/dashboard");
      } else {
        setError(res.error || "Gagal memproses request");
      }
    });
  };

  return (
    <Card className="border border-border/80 bg-white shadow-tinted-lg rounded-3xl overflow-hidden animate-fade-in-up">
      <CardHeader className="pt-8 px-8 pb-4">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-primary via-primary-deep to-secondary bg-clip-text text-transparent">
          Buat Request Belajar
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          Definisikan kebutuhan belajar Anda agar para mentor dapat memberikan penawaran yang relevan.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="px-8 py-4 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {/* Judul Request */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Judul Request Belajar</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Contoh: Belajar Core Web Vitals Optimization & SSR Next.js"
              maxLength={100}
            />
            <p className="text-right text-xs text-muted-foreground mt-1">{title.length}/100</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Topik / Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Ketik topik (misal: nextjs, seo) lalu tekan Enter"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive focus:outline-none font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Level Mentee */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tingkat Keahlian Anda Saat Ini</label>
            <div className="grid grid-cols-3 gap-4">
              {["pemula", "menengah", "mahir"].map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 capitalize text-sm font-medium ${
                    level === lvl
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-white text-muted-foreground hover:bg-accent/20"
                  }`}
                >
                  {lvl}
                </div>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Deskripsi Kebutuhan Bimbingan</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              rows={6}
              placeholder="Jelaskan secara detail: apa masalah yang dihadapi, project apa yang dikerjakan, dan ekspektasi hasil dari bimbingan ini (Minimal 100 karakter)..."
            />
            <p className="text-xs text-muted-foreground mt-1">Minimal 100 karakter. Saat ini: {description.length} karakter.</p>
          </div>

          {/* Budget Range & Pertemuan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Budget Min (per sesi)</label>
              <input
                type="number"
                min="50000"
                step="10000"
                required
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Budget Max (per sesi)</label>
              <input
                type="number"
                min="50000"
                step="10000"
                required
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Jumlah Sesi Pertemuan</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={sessionCount}
                onChange={(e) => setSessionCount(Number(e.target.value))}
                className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tanggal Deadline Selesai Belajar</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-4 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
            className="px-6 py-5 rounded-xl border border-border text-foreground hover:bg-accent/40"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="ml-auto px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-semibold shadow-md shadow-primary/20 hover:opacity-95 transition-all"
          >
            {isPending ? "Mempublikasikan..." : "Publikasikan Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
