"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter">
          <span className="text-primary">Ajar</span>
          <span className={scrolled ? "text-foreground" : "text-white"}>in</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  scrolled
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className={`text-sm font-medium ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Masuk
          </Button>
          <Button
            variant="default"
            className="rounded-full px-6 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
          >
            Mulai Belajar
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <button
                  className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors ${
                    scrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white hover:bg-white/10"
                  }`}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-black tracking-tighter">
                  <span className="text-primary">Ajar</span>in
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border my-4" />
                <Button variant="outline" className="w-full justify-center">
                  Masuk
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-center rounded-full shadow-lg shadow-primary/25"
                >
                  Mulai Belajar
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
