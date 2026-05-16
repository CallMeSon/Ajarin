import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Deep Indigo Gradient Background — per DESIGN.MD primary palette */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3525cd] via-[#4f46e5] to-[#4d44e3]" />

      {/* Decorative Elements — using surface-tint at low opacity */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#c3c0ff]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#dad7ff]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#e2dfff]/10 rounded-full blur-2xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-20 md:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="flex flex-col items-start text-left animate-fade-in-up">
            <Badge
              variant="secondary"
              className="mb-6 bg-white/15 text-white/90 border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase h-auto"
            >
              Platform Mentoring Untuk Semua Skill
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.02em] mb-6 leading-[1.2] text-white">
              Belajar Apa Pun,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6cf8bb] via-[#4edea3] to-[#6cf8bb]">
                Langsung dari Ahlinya
              </span>
            </h1>

            <p className="text-lg text-white/75 mb-10 max-w-lg leading-relaxed">
              Ajarin menghubungkan Anda dengan mentor terbaik di bidangnya. Dari
              coding, desain, musik, hingga memasak — temukan pengajar yang
              tepat untuk kebutuhan Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-[#3525cd] hover:bg-white/90 rounded-lg px-8 py-6 text-base font-semibold shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all h-auto gap-2.5"
              >
                <BookOpen className="size-5" />
                Saya Ingin Belajar
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-lg px-8 py-6 text-base font-semibold backdrop-blur-sm h-auto gap-2.5"
              >
                <GraduationCap className="size-5" />
                Saya Ingin Mengajar
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-white/60">Mentor Aktif</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-xs text-white/60">Sesi Selesai</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-xs text-white/60">Rating Rata-rata</p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative flex justify-center items-center animate-slide-in-right">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
              <Image
                src="/hero-illustration.png"
                alt="Mentor dan siswa belajar bersama di Ajarin"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3525cd]/30 to-transparent" />
            </div>

            {/* Floating Badge — Mentor Terverifikasi */}
            <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-float">
              <div className="w-11 h-11 bg-[#6cf8bb]/30 text-[#006c49] rounded-xl flex items-center justify-center text-lg font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-[#121c2a]">
                  Mentor Terverifikasi
                </p>
                <p className="text-xs text-[#464555]">
                  Ahli di bidangnya
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            <div
              className="absolute -top-2 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50 animate-float animation-delay-200"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[#885500] text-lg">★</span>
                <span className="text-sm font-bold text-[#121c2a]">4.9/5</span>
              </div>
              <p className="text-[10px] text-[#464555] mt-0.5">2,500+ ulasan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
