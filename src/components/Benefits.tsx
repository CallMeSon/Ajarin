import { Target, Users, Clock } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Matching Cerdas",
      description: "Temukan mentor yang paling sesuai dengan kebutuhan dan gaya belajar Anda secara otomatis."
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Sesi 1-on-1",
      description: "Belajar langsung secara privat untuk hasil maksimal dan umpan balik yang konstruktif."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Jadwal Fleksibel",
      description: "Atur waktu belajar sesuai kesibukan Anda tanpa perlu terikat jadwal kelas reguler."
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Kenapa Ajarin?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Kami menghadirkan pengalaman belajar terbaik yang dirancang khusus untuk mempercepat pertumbuhan karier Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
