-- ─────────────────────────────────────────────
-- Migration 001: Enable Row Level Security
-- Sesuai SRS §8.1 (SEC-04, SEC-05)
-- ─────────────────────────────────────────────

-- Enable RLS pada semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- USERS TABLE POLICIES
-- ─────────────────────────────────────────────

-- Semua user terautentikasi bisa baca profil publik
CREATE POLICY "users_select_all"
ON users FOR SELECT
TO authenticated
USING (true);

-- User hanya bisa update data dirinya sendiri
CREATE POLICY "users_update_own"
ON users FOR UPDATE
TO authenticated
USING (google_id = auth.jwt() ->> 'sub')
WITH CHECK (google_id = auth.jwt() ->> 'sub');

-- ─────────────────────────────────────────────
-- REQUESTS TABLE POLICIES
-- ─────────────────────────────────────────────

-- Mentor bisa baca semua request aktif
-- Mentee bisa baca semua request aktif + request milik sendiri
CREATE POLICY "requests_select"
ON requests FOR SELECT
TO authenticated
USING (
  status = 'aktif'
  OR mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
);

-- Hanya Mentee yang bisa insert request
CREATE POLICY "requests_insert"
ON requests FOR INSERT
TO authenticated
WITH CHECK (
  mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
);

-- Hanya pemilik request yang bisa update
CREATE POLICY "requests_update_own"
ON requests FOR UPDATE
TO authenticated
USING (mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'))
WITH CHECK (mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- PROPOSALS TABLE POLICIES
-- ─────────────────────────────────────────────

-- Mentee bisa baca proposal ke request miliknya
-- Mentor bisa baca proposal miliknya sendiri
CREATE POLICY "proposals_select"
ON proposals FOR SELECT
TO authenticated
USING (
  mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  OR request_id IN (
    SELECT id FROM requests
    WHERE mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  )
);

-- Hanya Mentor yang bisa insert proposal
CREATE POLICY "proposals_insert"
ON proposals FOR INSERT
TO authenticated
WITH CHECK (
  mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
);

-- ─────────────────────────────────────────────
-- MATCHES TABLE POLICIES
-- ─────────────────────────────────────────────

-- Hanya peserta match yang bisa baca
CREATE POLICY "matches_select"
ON matches FOR SELECT
TO authenticated
USING (
  mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  OR mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
);

-- ─────────────────────────────────────────────
-- MESSAGES TABLE POLICIES
-- ─────────────────────────────────────────────

-- Hanya peserta match yang bisa baca pesan
CREATE POLICY "messages_select"
ON messages FOR SELECT
TO authenticated
USING (
  match_id IN (
    SELECT id FROM matches
    WHERE mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
    OR mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  )
);

-- Hanya peserta match yang bisa kirim pesan
CREATE POLICY "messages_insert"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  AND match_id IN (
    SELECT id FROM matches
    WHERE mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
    OR mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  )
);

-- ─────────────────────────────────────────────
-- REVIEWS TABLE POLICIES
-- ─────────────────────────────────────────────

-- Semua user terautentikasi bisa baca review (tampil di profil publik)
CREATE POLICY "reviews_select_all"
ON reviews FOR SELECT
TO authenticated
USING (true);

-- Anon bisa baca review juga (profil publik Mentor bisa diakses tanpa login)
CREATE POLICY "reviews_select_anon"
ON reviews FOR SELECT
TO anon
USING (true);

-- Hanya Mentee peserta match yang bisa insert review
CREATE POLICY "reviews_insert"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (
  mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
);

-- Mentor bisa update untuk menambah reply
CREATE POLICY "reviews_update_reply"
ON reviews FOR UPDATE
TO authenticated
USING (mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'))
WITH CHECK (mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- MENTOR_VERIFICATIONS TABLE POLICIES
-- ─────────────────────────────────────────────

-- Mentor hanya bisa baca verifikasi miliknya sendiri
CREATE POLICY "verifications_select_own"
ON mentor_verifications FOR SELECT
TO authenticated
USING (mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));

-- Mentor bisa insert/update data verifikasi miliknya
CREATE POLICY "verifications_insert"
ON mentor_verifications FOR INSERT
TO authenticated
WITH CHECK (mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));

-- ─────────────────────────────────────────────
-- REPORTS TABLE POLICIES
-- ─────────────────────────────────────────────

-- User hanya bisa baca report yang mereka buat
CREATE POLICY "reports_select_own"
ON reports FOR SELECT
TO authenticated
USING (reporter_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));

-- User bisa insert report
CREATE POLICY "reports_insert"
ON reports FOR INSERT
TO authenticated
WITH CHECK (reporter_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub'));
