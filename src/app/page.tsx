import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Memanggil komponen Navbar */}
      <Navbar />

      {/* 2. Memanggil komponen Hero */}
      <Hero />
      
      {/* Nantinya komponen lain seperti Testimoni atau Footer tinggal ditambahkan di bawah ini */}
    </main>
  );
}
