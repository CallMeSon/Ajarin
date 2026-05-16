import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?u=andi",
    initials: "AP",
    rating: 5,
    text: "Dari nol bisa nguasai React dalam 2 bulan berkat mentoring di Ajarin. Lebih cepat dan terarah dibanding belajar sendiri, setiap sesi fokus pada praktik nyata.",
  },
  {
    name: "Sari Dewi",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?u=sari",
    initials: "SD",
    rating: 5,
    text: "Belajar mentoring, dari mentor yang benar-benar saya kagumi. Mentor membantu saya dengan portofolio dan memberikan feedback langsung yang sangat berharga.",
  },
  {
    name: "Bapak Rudi",
    role: "Orang Tua",
    avatar: "https://i.pravatar.cc/150?u=rudi",
    initials: "BR",
    rating: 5,
    text: "Saya cari tutor belajar matematika yang sabar dan terstruktur untuk anak saya. Ajarin membantu menemukan mentor yang tepat. Nilai anak saya meningkat pesat!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-[100px] bg-[#eff4ff] relative overflow-hidden">
      {/* Subtle bg accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e2dfff]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[32px] font-bold mb-5 text-[#121c2a] tracking-tight leading-[1.3]">
            Apa Kata Mereka Tentang{" "}
            <span className="text-primary">Ajarin?</span>
          </h2>
          <p className="text-[#464555] text-lg max-w-2xl mx-auto leading-relaxed">
            Ribuan pelajar dan mentor telah merasakan manfaat platform kami.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className="group border-0 shadow-tinted hover:shadow-tinted-lg transition-all duration-500 hover:-translate-y-1 bg-card relative animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-6">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#885500] text-[#885500]"
                    />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="w-8 h-8 text-[#e2dfff] mb-3 scale-x-[-1]" />

                {/* Text */}
                <p className="text-[#464555] leading-relaxed mb-6 text-base">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#c7c4d8]">
                  <Avatar size="lg" className="ring-2 ring-[#4edea3]">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[#121c2a]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#464555]">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
