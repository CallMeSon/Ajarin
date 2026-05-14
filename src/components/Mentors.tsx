import Image from "next/image";
import { Star } from "lucide-react";

export default function Mentors() {
  const mentors = [
    {
      name: "Budi Santoso",
      role: "Senior Frontend Developer",
      company: "Tech Unicorn",
      rating: 4.9,
      reviews: 120,
      image: "https://i.pravatar.cc/150?u=budi"
    },
    {
      name: "Sari Putri",
      role: "Lead UI/UX Designer",
      company: "Creative Studio",
      rating: 5.0,
      reviews: 89,
      image: "https://i.pravatar.cc/150?u=sari"
    },
    {
      name: "Andi Wijaya",
      role: "Backend Engineer",
      company: "Global Tech",
      rating: 4.8,
      reviews: 210,
      image: "https://i.pravatar.cc/150?u=andi"
    },
    {
      name: "Ratna Sari",
      role: "Product Manager",
      company: "Startup Hub",
      rating: 4.9,
      reviews: 95,
      image: "https://i.pravatar.cc/150?u=ratna"
    },
    {
      name: "Hendra Gunawan",
      role: "Data Scientist",
      company: "Data Corp",
      rating: 4.7,
      reviews: 64,
      image: "https://i.pravatar.cc/150?u=hendra"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Mentor Populer</h2>
          <p className="text-muted-foreground text-lg">Belajar dari mereka yang sudah berpengalaman di industri.</p>
        </div>
        <button className="hidden sm:block text-primary font-semibold hover:underline">
          Lihat Semua Mentor &rarr;
        </button>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full relative">
        <div className="flex overflow-x-auto pb-8 pt-4 px-4 sm:px-8 gap-6 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Padding for left side to match container padding approximately */}
          <div className="w-4 shrink-0 lg:w-[calc((100vw-80rem)/2)] hidden lg:block"></div>

          {mentors.map((mentor, index) => (
            <div key={index} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-blue-500/20 w-full relative"></div>
              <div className="px-6 pb-6 relative flex-grow flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden -mt-10 mb-4 bg-slate-100 shadow-sm">
                  <Image src={mentor.image} alt={mentor.name} width={80} height={80} className="object-cover" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{mentor.name}</h3>
                <p className="text-sm font-medium text-slate-700 mt-1">{mentor.role}</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">{mentor.company}</p>

                <div className="mt-auto flex items-center justify-center pt-4 w-full border-t border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{mentor.rating}</span>
                    <span className="text-xs text-muted-foreground">({mentor.reviews} ulasan)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="w-4 shrink-0 lg:w-[calc((100vw-80rem)/2)] hidden lg:block"></div>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 mt-4 sm:hidden flex justify-center">
        <button className="text-primary font-semibold hover:underline">
          Lihat Semua Mentor &rarr;
        </button>
      </div>
    </section>
  );
}
