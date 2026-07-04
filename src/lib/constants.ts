// ─────────────────────────────────────────────
// Budget & Pricing
// ─────────────────────────────────────────────
export const BUDGET = {
  MIN: 50_000,         // Rp 50.000
  MAX: 1_000_000,      // Rp 1.000.000 (request)
  MENTOR_MAX: 5_000_000, // Rp 5.000.000 (offered price)
} as const;

// ─────────────────────────────────────────────
// Session & Request Limits
// ─────────────────────────────────────────────
export const SESSION = {
  MIN: 1,
  MAX: 50,
} as const;

// ─────────────────────────────────────────────
// Validation: Character Limits
// ─────────────────────────────────────────────
export const CHAR_LIMITS = {
  REQUEST_TITLE_MIN: 10,
  REQUEST_TITLE_MAX: 100,
  REQUEST_DESCRIPTION_MIN: 100,
  REQUEST_DESCRIPTION_MAX: 2000,
  REQUEST_TAGS_MIN: 1,
  REQUEST_TAGS_MAX: 5,
  PROPOSAL_STRENGTH_MIN: 50,
  PROPOSAL_STRENGTH_MAX: 500,
  PROPOSAL_METHOD_MIN: 50,
  PROPOSAL_METHOD_MAX: 500,
  PROPOSAL_MESSAGE_MAX: 300,
  REVIEW_COMMENT_MIN: 20,
  REVIEW_COMMENT_MAX: 1000,
  REVIEW_REPLY_MAX: 500,
  BIO_MIN: 50,
  BIO_MAX: 500,
  BIO_MENTEE_MAX: 300,
  MESSAGE_MAX: 2000,
  USERNAME_MAX: 50,
  NAME_MAX: 100,
  AVAILABILITY_MAX: 100,
} as const;

// ─────────────────────────────────────────────
// File Upload
// ─────────────────────────────────────────────
export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_SIZE_LABEL: "5 MB",
  ALLOWED_TYPES: ["image/jpeg", "image/png", "application/pdf"] as const,
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".pdf"] as const,
  STORAGE_BUCKET: "chat-attachments",
  // Retensi file: dihapus otomatis setelah 30 hari (SRS + PRD)
  RETENTION_DAYS: 30,
} as const;

// ─────────────────────────────────────────────
// Rate Limiting (SRS SEC-13)
// ─────────────────────────────────────────────
export const RATE_LIMIT = {
  WRITE_MAX_REQUESTS: 60,
  WRITE_WINDOW_MS: 60 * 1000, // 1 menit
} as const;

// ─────────────────────────────────────────────
// Business Rules
// ─────────────────────────────────────────────
export const BUSINESS_RULES = {
  // Request auto-close setelah X hari tanpa proposal (PRD F-10, PRD updated)
  REQUEST_AUTO_CLOSE_DAYS: 7,
  // Auto-confirm sesi selesai jika Mentee tidak konfirmasi (PRD F-09 updated)
  SESSION_AUTO_CONFIRM_HOURS: 48,
  // Rating range
  RATING_MIN: 1,
  RATING_MAX: 5,
  // Pengalaman Mentor
  EXPERIENCE_MIN: 0,
  EXPERIENCE_MAX: 50,
  // Mentor skill tags
  SKILL_TAGS_MIN: 1,
  SKILL_TAGS_MAX: 10,
} as const;

// ─────────────────────────────────────────────
// Email Notification Throttle (SRS FR-17, NE-04)
// ─────────────────────────────────────────────
export const EMAIL = {
  // Notif pesan baru max 1x per interval ini (per pasangan match)
  CHAT_NOTIFICATION_THROTTLE_MS: 30 * 60 * 1000, // 30 menit
  // Retry logic (SRS §6.4)
  MAX_RETRIES: 2,
  RETRY_INTERVAL_MS: 5 * 60 * 1000, // 5 menit
  FROM_ADDRESS: "Ajarin <noreply@ajarin.id>",
} as const;

// ─────────────────────────────────────────────
// API Response Codes (SRS §7.7)
// ─────────────────────────────────────────────
export const API_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// ─────────────────────────────────────────────
// Request Level Options
// ─────────────────────────────────────────────
export const REQUEST_LEVELS = ["pemula", "menengah", "mahir"] as const;
export type RequestLevel = (typeof REQUEST_LEVELS)[number];

// ─────────────────────────────────────────────
// Request Status
// ─────────────────────────────────────────────
export const REQUEST_STATUSES = ["aktif", "matched", "selesai", "ditutup"] as const;
export type RequestStatusType = (typeof REQUEST_STATUSES)[number];
