import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ajarin — Platform Mentoring #1 di Indonesia",
  description:
    "Ajarin menghubungkan Anda dengan mentor terbaik di bidangnya. Dari coding, desain, musik, hingga memasak — temukan pengajar yang tepat untuk kebutuhan Anda.",
  keywords: ["mentoring", "belajar", "tutor", "mentor", "Indonesia", "edtech"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
