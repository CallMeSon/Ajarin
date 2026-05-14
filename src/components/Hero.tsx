import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="beranda" className="pt-32 pb-16 md:pt-40 md:pb-24 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efek Latar Belakang Gradasi (Glassmorphism effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Kolom Teks */}
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
            Platform Mentoring #1 di Indonesia
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] text-slate-900">
            Belajar dari <br />
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Mentor Terbaik
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Hubungkan diri Anda dengan para ahli di bidangnya. Belajar lebih cepat, lebih personal, dan lebih efektif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-1 text-center flex items-center justify-center gap-2">
              Mulai Belajar
            </button>
            <button className="bg-slate-100 text-slate-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-200 transition-all text-center">
              Lihat Kurikulum
            </button>
          </div>
        </div>

        {/* Kolom Ilustrasi */}
        <div className="relative flex justify-center items-center mt-12 lg:mt-0">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/40 shadow-2xl bg-white">
            <Image
              src="/hero-illustration.png"
              alt="Ilustrasi Mentoring"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Badge Dekorasi */}
          <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
              +500
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Mentor Aktif</p>
              <p className="text-xs text-slate-500">Siap membantu Anda</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
