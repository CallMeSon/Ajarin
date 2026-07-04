import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Supabase client untuk digunakan di Server Components, API Routes, dan Server Actions.
 * Menggunakan cookies untuk auth session.
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
      auth: {
        persistSession: false,
      },
    }
  );
}

/**
 * Supabase admin client dengan service role key.
 * HANYA gunakan di server-side. Jangan pernah expose ke client.
 * Digunakan untuk operasi admin (approve Mentor, resolve Report, dll.)
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
