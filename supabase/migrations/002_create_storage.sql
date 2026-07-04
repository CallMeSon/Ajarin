-- ─────────────────────────────────────────────
-- Migration 002: Create Storage Bucket
-- Sesuai SRS §6.3 + SEC-09 + PRD F-07
-- ─────────────────────────────────────────────

-- Buat bucket untuk file lampiran chat
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false, -- Tidak public, akses hanya via signed URL (SRS SEC-09)
  5242880, -- 5 MB dalam bytes
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Storage Policies
-- ─────────────────────────────────────────────

-- User terautentikasi bisa upload file ke folder match mereka
CREATE POLICY "storage_upload_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  -- Path format: {match_id}/{user_id}/{filename}
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM matches
    WHERE mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
    OR mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  )
);

-- User peserta match bisa baca file di match mereka (via signed URL)
CREATE POLICY "storage_select_participants"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM matches
    WHERE mentee_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
    OR mentor_id = (SELECT id FROM users WHERE google_id = auth.jwt() ->> 'sub')
  )
);

-- User bisa hapus file yang mereka upload sendiri
CREATE POLICY "storage_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM users WHERE google_id = auth.jwt() ->> 'sub'
  )
);
