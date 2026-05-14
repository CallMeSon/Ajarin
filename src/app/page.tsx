import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Mentors from "@/components/Mentors";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Navbar />
      <Hero />
      <Benefits />
      <Mentors />
      
      {/* Footer sederhana sementara */}
      <footer className="bg-slate-900 text-slate-300 py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-4">© 2026 Ajarin. Semua hak cipta dilindungi.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Tentang</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
