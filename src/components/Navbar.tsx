import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tighter">
          <span className="text-primary">Ajar</span>in.
        </div>
        
        {/* Navigasi Tengah */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <li>
            <Link href="#beranda" className="text-muted-foreground hover:text-primary transition-colors">
              Beranda
            </Link>
          </li>
          <li>
            <Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors">
              Fitur
            </Link>
          </li>
          <li>
            <Link href="#kontak" className="text-muted-foreground hover:text-primary transition-colors">
              Kontak
            </Link>
          </li>
        </ul>

        {/* Tombol Kanan */}
        <button className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md">
          Masuk
        </button>

      </div>
    </nav>
  );
}
