import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Masuk — Ajarin",
  description: "Masuk ke akun Anda di Ajarin untuk memulai mentoring.",
};

export default async function LoginPage() {
  const session = await auth();

  // Jika session sudah aktif, redirect langsung ke dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse-glow" />
      <div className="absolute bottom-0 right-4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-70 animate-pulse-glow" />
      
      <div className="z-10 w-full flex justify-center">
        <Suspense fallback={<div className="text-muted-foreground text-sm">Memuat halaman...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
