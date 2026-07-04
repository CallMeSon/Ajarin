import { RATE_LIMIT } from "@/lib/constants";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — cukup untuk MVP single-instance Vercel
// Ganti dengan Redis (Upstash) jika sudah multi-instance
const store = new Map<string, RateLimitEntry>();

/**
 * Cek apakah request masih dalam batas rate limit.
 * @param key - Identifier unik (biasanya user ID atau IP)
 * @returns `{ allowed: boolean; remaining: number; resetAt: number }`
 */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // Window baru
    store.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT.WRITE_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT.WRITE_MAX_REQUESTS - 1,
      resetAt: now + RATE_LIMIT.WRITE_WINDOW_MS,
    };
  }

  if (entry.count >= RATE_LIMIT.WRITE_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT.WRITE_MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Bersihkan entries yang sudah expired dari store.
 * Panggil secara berkala untuk mencegah memory leak.
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}
