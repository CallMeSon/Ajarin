export default function Hero() {
  return (
    <section id="beranda" className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      
      {/* Efek Latar Belakang Gradasi (Glassmorphism effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
        Belajar Jadi Lebih <br/> 
        <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Cepat & Menyenangkan
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
        Tingkatkan potensi Anda dengan materi interaktif dan panduan langsung dari para ahli di platform Ajarin.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-1">
          Mulai Belajar Sekarang
        </button>
        <button className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:bg-secondary/80 transition-all">
          Lihat Kurikulum
        </button>
      </div>

    </section>
  );
}
