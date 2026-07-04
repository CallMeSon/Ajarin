"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setError("Username atau password salah");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error("Google login error:", err);
      setError("Gagal masuk dengan Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <Card className="border border-border/60 shadow-tinted-lg rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="pt-8 pb-6 px-8 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Selamat Datang <span className="text-primary font-black">Ajar</span>in
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Silakan masuk untuk melanjutkan ke dashboard Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-foreground"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/80 bg-background/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/80 bg-background/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-6 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white transition-all shadow-md shadow-primary/10 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-medium">
                Atau masuk dengan
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full py-6 rounded-xl border border-border/80 hover:bg-accent/40 text-foreground font-semibold flex items-center justify-center gap-3 transition-colors"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.73 1.64 15.06 1 12 1 7.24 1 3.2 3.74 1.25 7.75l3.86 3C6.02 7.78 8.75 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.11 14.75c-.24-.72-.38-1.49-.38-2.3c0-.81.14-1.58.38-2.3L1.25 7.15C.45 8.77 0 10.59 0 12.5s.45 3.73 1.25 5.35l3.86-3.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.52 1.18-4.23 1.18-3.25 0-5.98-2.74-6.89-5.71l-3.86 3C3.2 20.26 7.24 23 12 23z"
                />
              </svg>
            )}
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
