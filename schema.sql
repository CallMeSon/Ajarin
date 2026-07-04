-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('mentee', 'mentor', 'admin');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('aktif', 'matched', 'selesai', 'ditutup');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('pending', 'diterima', 'ditolak');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('aktif', 'selesai');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('penipuan', 'konten_tidak_pantas', 'tidak_profesional', 'lainnya');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('open', 'resolved', 'dismissed');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "google_id" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50),
    "password_hash" VARCHAR(255),
    "avatar_url" TEXT,
    "role" "Role" NOT NULL,
    "bio" TEXT,
    "skill_tags" TEXT[],
    "experience_years" SMALLINT,
    "availability" VARCHAR(100),
    "min_price_per_session" INTEGER,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "mentee_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "tags" TEXT[],
    "level" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "budget_min" INTEGER NOT NULL,
    "budget_max" INTEGER NOT NULL,
    "session_count" SMALLINT NOT NULL,
    "deadline" DATE NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'aktif',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "strength" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "message" TEXT,
    "offered_price" INTEGER NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "proposal_id" INTEGER NOT NULL,
    "mentee_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'aktif',
    "matched_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "validation_initiated_at" TIMESTAMPTZ,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT,
    "file_url" TEXT,
    "file_name" VARCHAR(255),
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "mentee_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,
    "mentor_reply" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_verifications" (
    "id" SERIAL NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "portfolio_url" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "description" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ,

    CONSTRAINT "mentor_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "reported_id" INTEGER NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "admin_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "requests_mentee_id_idx" ON "requests"("mentee_id");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "proposals_request_id_idx" ON "proposals"("request_id");

-- CreateIndex
CREATE INDEX "proposals_mentor_id_idx" ON "proposals"("mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_request_id_mentor_id_key" ON "proposals"("request_id", "mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_request_id_key" ON "matches"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_proposal_id_key" ON "matches"("proposal_id");

-- CreateIndex
CREATE INDEX "messages_match_id_idx" ON "messages"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_match_id_key" ON "reviews"("match_id");

-- CreateIndex
CREATE INDEX "reviews_mentor_id_idx" ON "reviews"("mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_verifications_mentor_id_key" ON "mentor_verifications"("mentor_id");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_verifications" ADD CONSTRAINT "mentor_verifications_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_id_fkey" FOREIGN KEY ("reported_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
