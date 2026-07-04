import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = String(credentials.username);
        const password = String(credentials.password);

        // Cari user berdasarkan username
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // JWT masa berlaku 7 hari (SRS SEC-02)
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        return true;
      }
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },

    async jwt({ token, user, trigger, session }) {
      // Saat pertama login: ambil data user dari DB dan simpan ke token
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            role: true,
            onboardingCompleted: true,
            googleId: true,
          },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.onboardingCompleted = dbUser.onboardingCompleted;
        }
      }

      // Saat session diupdate (misalnya setelah onboarding selesai)
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.onboardingCompleted =
          session.onboardingCompleted ?? token.onboardingCompleted;
      }

      return token;
    },

    async session({ session, token }) {
      // Ekspor data user dari token JWT ke session yang bisa dibaca di client
      if (token && session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.role = token.role as string;
        session.user.onboardingCompleted =
          token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
});
