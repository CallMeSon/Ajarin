import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export const metadata = {
  title: "Onboarding — Ajarin",
  description: "Lengkapi profil Anda untuk mulai menggunakan platform Ajarin.",
};

export default async function OnboardingPage() {
  const session = await auth();

  // Proteksi server-side
  if (!session || !session.user) {
    redirect("/");
  }

  // Jika onboarding sudah selesai, redirect ke dashboard
  if (session.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <OnboardingForm user={session.user} />
      </div>
    </main>
  );
}
