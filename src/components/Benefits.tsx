import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MonitorPlay, Clock, Target } from "lucide-react";

const painPoints = [
  {
    icon: MonitorPlay,
    iconBg: "bg-[#e2dfff] text-[#4f46e5]",
    title: "Tutorial Online Terlalu Umum",
    description:
      "Video dan artikel online tidak pernah menjawab pertanyaan spesifik atau masalah unik yang Anda hadapi.",
  },
  {
    icon: Clock,
    iconBg: "bg-[#ffddb8] text-[#885500]",
    title: "Waktu Terbuang",
    description:
      "Berjam-jam mencari jawaban yang tepat di forum, padahal bisa diselesaikan dalam 5 menit dengan ahlinya.",
  },
  {
    icon: Target,
    iconBg: "bg-[#6cf8bb]/30 text-[#006c49]",
    title: "Butuh Best Practice",
    description:
      "Mengetahui teori itu mudah, tapi memahami cara implementasi dan best practice hanya bisa dari mentor berpengalaman.",
  },
];

export default function PainPoints() {
  return (
    <section id="kurikulum" className="py-20 lg:py-[100px] relative bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[32px] md:text-[32px] font-bold mb-5 text-[#121c2a] tracking-tight leading-[1.3]">
            Ingin Belajar Sesuatu, Tapi Bingung{" "}
            <span className="text-primary">Mulai dari Mana?</span>
          </h2>
          <p className="text-[#464555] text-lg leading-relaxed">
            Tantangan yang sering dihadapi saat mencoba belajar skill baru
            sendiri.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point, index) => (
            <Card
              key={index}
              className={`group border-0 shadow-tinted hover:shadow-tinted-lg transition-all duration-500 hover:-translate-y-1 bg-card animate-fade-in-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-2">
                <div
                  className={`w-14 h-14 ${point.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <point.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-lg font-bold text-[#121c2a]">
                  {point.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#464555] leading-relaxed text-base">
                  {point.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
