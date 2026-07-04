import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang bisa diakses tanpa login
const PUBLIC_ROUTES = ["/", "/login"];

// Prefix path yang selalu publik
const PUBLIC_PREFIXES = [
  "/mentor/",    // Profil publik Mentor (FR-14)
  "/api/auth",   // NextAuth endpoints
];

// Tipe session dari NextAuth
type SessionUser = {
  id?: string;
  role?: string;
  onboardingCompleted?: boolean;
};

type AuthedRequest = NextRequest & {
  auth: { user?: SessionUser } | null;
};

export default auth((req: AuthedRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const user = session?.user;

  // Izinkan akses ke static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Izinkan public prefix routes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Izinkan landing page
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Jika sudah login dan onboarding selesai, redirect ke dashboard
    if (user && user.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Belum login → redirect ke landing page
  if (!user) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi onboarding belum selesai → redirect ke onboarding
  if (!user.onboardingCompleted && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Sudah onboarding selesai tapi masih di halaman onboarding → redirect ke dashboard
  if (user.onboardingCompleted && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
