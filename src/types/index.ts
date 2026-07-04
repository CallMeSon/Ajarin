// ─────────────────────────────────────────────
// Shared TypeScript Types for Ajarin Platform
// Based on Prisma schema + SRS §9 specifications
// ─────────────────────────────────────────────

// Re-export Prisma enums for convenience
export type {
  Role,
  RequestStatus,
  ProposalStatus,
  MatchStatus,
  VerificationStatus,
  ReportReason,
  ReportStatus,
} from "@prisma/client";

// ─────────────────────────────────────────────
// API Response Shapes (SRS §7.7)
// ─────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  status: "success";
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status: "error";
  code: string;
  message: string;
  field?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────
// User Types
// ─────────────────────────────────────────────

export interface PublicUser {
  id: number;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  role: string;
  bio: string | null;
}

export interface PublicMentorProfile extends PublicUser {
  skillTags: string[];
  experienceYears: number | null;
  availability: string | null;
  minPricePerSession: number | null;
  ratingAvg: number;
  ratingCount: number;
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  onboardingCompleted: boolean;
}

// ─────────────────────────────────────────────
// Request Types
// ─────────────────────────────────────────────

export interface CreateRequestInput {
  title: string;
  tags: string[];
  level: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  sessionCount: number;
  deadline: string; // ISO date string
}

export interface RequestWithProposalCount {
  id: number;
  title: string;
  tags: string[];
  level: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  sessionCount: number;
  deadline: Date;
  status: string;
  createdAt: Date;
  mentee: PublicUser;
  _count: { proposals: number };
}

// ─────────────────────────────────────────────
// Proposal Types
// ─────────────────────────────────────────────

export interface CreateProposalInput {
  strength: string;
  method: string;
  message?: string;
  offeredPrice: number;
}

export interface ProposalWithMentor {
  id: number;
  strength: string;
  method: string;
  message: string | null;
  offeredPrice: number;
  status: string;
  createdAt: Date;
  mentor: PublicMentorProfile;
}

// ─────────────────────────────────────────────
// Chat / Message Types
// ─────────────────────────────────────────────

export interface MessageWithSender {
  id: number;
  matchId: number;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  sentAt: Date;
  sender: Pick<PublicUser, "id" | "name" | "avatarUrl">;
}

// ─────────────────────────────────────────────
// Review Types
// ─────────────────────────────────────────────

export interface CreateReviewInput {
  rating: number;
  comment: string;
}

export interface ReviewWithMentee {
  id: number;
  rating: number;
  comment: string;
  mentorReply: string | null;
  createdAt: Date;
  mentee: Pick<PublicUser, "id" | "name" | "avatarUrl">;
}

// ─────────────────────────────────────────────
// Report Types
// ─────────────────────────────────────────────

export interface CreateReportInput {
  reportedId: number;
  reason: string;
  description?: string;
}

// ─────────────────────────────────────────────
// Mentor Verification Types
// ─────────────────────────────────────────────

export interface CreateVerificationInput {
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  description?: string;
}

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// Filter Types
// ─────────────────────────────────────────────

export interface RequestFilters extends PaginationParams {
  tags?: string[];
  level?: string;
  budgetMin?: number;
  budgetMax?: number;
  sortBy?: "newest" | "budget_desc";
}

export interface MentorFilters extends PaginationParams {
  skillTags?: string[];
  minRating?: number;
  sortBy?: "rating_desc" | "experience_desc";
}
