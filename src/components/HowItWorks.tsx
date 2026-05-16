import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Crosshair, MessageCircle, Zap } from "lucide-react";

const steps = [
  {
    icon: Crosshair,
    iconBg: "bg-[#e2dfff] text-[#4f46e5]",
    step: "01",
    title: "Matching Cerdas",
    description:
      "Algoritma kami menemukan mentor yang paling sesuai dengan gaya belajar dan kebutuhan Anda — tanpa perlu cari-cari manual.",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-[#6cf8bb]/30 text-[#006c49]",
    step: "02",
    title: "Belajar Langsung",
    description:
      "Sesi belajar 1-on-1 interaktif dengan mentor pilihan Anda. Diskusi langsung dan dapatkan feedback personal secara real-time.",
  },
  {
    icon: Zap,
    iconBg: "bg-[#ffddb8] text-[#885500]",
    step: "03",
    title: "Mulai dalam Hitungan Jam",
    description:
      "Tidak perlu menunggu berminggu-minggu. Temukan mentor dan mulai belajar hari ini — jadwal fleksibel sesuai waktu Anda.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-[100px] relative overflow-hidden">
      {/* Gradient Background — using DESIGN.MD surface tokens */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e6eeff] via-[#e2dfff]/30 to-[#eff4ff]" />

      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#e2dfff]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#c3c0ff]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[32px] font-bold mb-5 text-[#121c2a] tracking-tight leading-[1.3]">
            Mentoring yang Personal,{" "}
            <span className="text-primary">Efisien</span>, dan Terjangkau
          </h2>
          <p className="text-[#464555] text-lg leading-relaxed">
            Kami merancang platform untuk mempercepat proses belajar Anda dengan
            tiga langkah mudah.
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group border-0 shadow-tinted hover:shadow-tinted-lg transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur-sm relative overflow-visible animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-[#4f46e5]/30">
                {step.step}
              </div>

              <CardHeader className="pb-2">
                <div
                  className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-lg font-bold text-[#121c2a]">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#464555] leading-relaxed text-base">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
