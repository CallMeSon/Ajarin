"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export default function OnboardingForm({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"mentee" | "mentor" | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Mentor specific fields
  const [tagInput, setTagInput] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [availability, setAvailability] = useState("");
  const [minPrice, setMinPrice] = useState(50000);

  const [error, setError] = useState("");

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!skillTags.includes(tagInput.trim().toLowerCase())) {
        setSkillTags([...skillTags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter((t) => t !== tagToRemove));
  };

  const handleNext = () => {
    if (step === 1 && !role) {
      setError("Silakan pilih peran Anda terlebih dahulu");
      return;
    }
    if (step === 2 && !username.trim()) {
      setError("Username wajib diisi");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setError("");

    startTransition(async () => {
      const res = await submitOnboarding({
        role,
        username,
        bio,
        skillTags: role === "mentor" ? skillTags : [],
        experienceYears: role === "mentor" ? Number(experienceYears) : undefined,
        availability: role === "mentor" ? availability : undefined,
        minPricePerSession: role === "mentor" ? Number(minPrice) : undefined,
      });

      if (res.success) {
        // Force refresh session state and route to dashboard
        router.refresh();
        router.push("/dashboard");
      } else {
        setError(res.error || "Terjadi kesalahan saat memproses data");
      }
    });
  };

  return (
    <Card className="border border-border/80 bg-white/80 backdrop-blur-md shadow-tinted-lg rounded-3xl overflow-hidden animate-fade-in-up">
      <CardHeader className="pt-8 px-8 pb-4 text-center">
        <div className="flex justify-center gap-2 mb-6">
          <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          {role === "mentor" && (
            <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-primary via-primary-deep to-secondary bg-clip-text text-transparent">
          {step === 1 && "Pilih Peran Anda"}
          {step === 2 && "Informasi Dasar"}
          {step === 3 && role === "mentor" && "Profil Mentor Anda"}
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          {step === 1 && "Tentukan peran awal Anda di Ajarin. Anda dapat mengubahnya nanti."}
          {step === 2 && "Masukkan nama panggilan unik yang akan ditampilkan di profil Anda."}
          {step === 3 && role === "mentor" && "Bagikan keahlian dan tarif untuk menarik minat Mentee."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="px-8 py-4">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {/* STEP 1: ROLE SELECT */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div
                onClick={() => {
                  setRole("mentee");
                  setError("");
                }}
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  role === "mentee"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-102"
                    : "border-border bg-white hover:border-primary/50 hover:bg-accent/20"
                }`}
              >
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <span className="text-3xl">👨‍🎓</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Mentee</h3>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Saya ingin mencari mentor untuk bimbingan langsung, review project, atau tanya jawab materi.
                </p>
              </div>

              <div
                onClick={() => {
                  setRole("mentor");
                  setError("");
                }}
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  role === "mentor"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-102"
                    : "border-border bg-white hover:border-primary/50 hover:bg-accent/20"
                }`}
              >
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Mentor</h3>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Saya ingin berbagi keahlian, membimbing langsung murid baru, dan mendapatkan penghasilan tambahan.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: BASIC INFO */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Username unik</label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm font-medium">
                    ajarin.id/
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    className="block w-full pl-20 pr-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="nama-pengguna"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Bio Singkat</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  rows={4}
                  placeholder={
                    role === "mentor"
                      ? "Jelaskan latar belakang karir Anda secara singkat dan apa yang bisa Anda ajarkan..."
                      : "Jelaskan apa yang ingin Anda pelajari atau project apa yang sedang Anda kerjakan..."
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3: MENTOR DETAILS */}
          {step === 3 && role === "mentor" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Keahlian (Skill Tags)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Ketik tag (misal: react, nodejs) lalu tekan Enter"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive focus:outline-none font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Pengalaman Mengajar / Kerja (Tahun)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Harga Minimum per Sesi (Rp)</label>
                  <input
                    type="number"
                    min="50000"
                    step="10000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Ketersediaan Waktu</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Contoh: Senin - Jumat (19:00 - 22:00), Sabtu Full"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-4 flex justify-between gap-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isPending}
              className="px-6 py-5 rounded-xl border border-border hover:bg-accent/50 text-foreground transition-all duration-300"
            >
              Kembali
            </Button>
          )}

          {((role === "mentee" && step === 2) || (role === "mentor" && step === 3)) ? (
            <Button
              type="submit"
              disabled={isPending}
              className="ml-auto px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-semibold shadow-md shadow-primary/20 hover:opacity-95 active:scale-98 transition-all duration-300"
            >
              {isPending ? "Menyimpan..." : "Selesaikan Profil"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-semibold shadow-md shadow-primary/20 hover:opacity-95 active:scale-98 transition-all duration-300"
            >
              Lanjutkan
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
