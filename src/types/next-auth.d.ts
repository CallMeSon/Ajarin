import "next-auth";
import "next-auth/jwt";

// Extend tipe default NextAuth untuk menambahkan field custom
// Sesuai dengan data yang disimpan di tabel users

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      /** Role pengguna: mentee, mentor, atau admin */
      role: string;
      /** Apakah onboarding sudah selesai */
      onboardingCompleted: boolean;
    };
  }

  interface User {
    /** Role pengguna: mentee, mentor, atau admin */
    role?: string;
    /** Apakah onboarding sudah selesai */
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** ID numerik dari tabel users */
    userId?: number;
    /** Role pengguna: mentee, mentor, atau admin */
    role?: string;
    /** Apakah onboarding sudah selesai */
    onboardingCompleted?: boolean;
  }
}
