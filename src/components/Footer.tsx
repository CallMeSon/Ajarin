import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Karier", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
  ],
  bantuan: [
    { label: "Pusat Bantuan", href: "#" },
    { label: "Hubungi Kami", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer id="faq" className="bg-[#27313f] text-[#d0dbed] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#4f46e5]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tighter inline-block mb-4"
            >
              <span className="text-[#c3c0ff]">Ajar</span>
              <span className="text-white">in</span>
            </Link>
            <p className="text-sm text-[#d0dbed]/70 leading-relaxed max-w-xs">
              Platform mentoring untuk semua skill. Temukan ahli untuk
              membimbing perjalanan belajar Anda.
            </p>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#d0dbed]/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#d0dbed]/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.bantuan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#d0dbed]/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Copyright */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#d0dbed]/50">
            © 2026 Ajarin. Empowering growth through connection.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-[#d0dbed]/50 hover:text-white transition-colors">
              Instagram
            </Link>
            <Link href="#" className="text-xs text-[#d0dbed]/50 hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-xs text-[#d0dbed]/50 hover:text-white transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
