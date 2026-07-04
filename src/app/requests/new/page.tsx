import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import RequestForm from "./RequestForm";

export const metadata = {
  title: "Buat Request Belajar Baru — Ajarin",
  description: "Cari mentor terbaik untuk membimbing Anda belajar skill baru.",
};

export default async function NewRequestPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  if (session.user.role !== "mentee") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <RequestForm />
      </main>
    </div>
  );
}
