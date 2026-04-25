-- ============================================================
-- GreenPe MVP Supabase Patch (v2 — no FK issues)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Make entity_id nullable on certificates (MVP: no auth required)
ALTER TABLE public.certificates
  ALTER COLUMN entity_id DROP NOT NULL;

-- 2. Drop the FK constraint so certificates don't require a valid entity
ALTER TABLE public.certificates
  DROP CONSTRAINT IF EXISTS certificates_entity_id_fkey;

-- 3. Open RLS: allow public read on certificates (for verification URLs)
DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
CREATE POLICY "Public can view certificates"
  ON public.certificates FOR SELECT
  USING (true);

-- 4. Allow inserts from service role (bypasses RLS)
DROP POLICY IF EXISTS "Service role can insert certificates" ON public.certificates;
CREATE POLICY "Service role can insert certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (true);

-- 5. Allow updates/upserts
DROP POLICY IF EXISTS "Service role can upsert certificates" ON public.certificates;
CREATE POLICY "Service role can upsert certificates"
  ON public.certificates FOR UPDATE
  USING (true);

-- 6. Ensure the certificates storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Storage read policy
DROP POLICY IF EXISTS "Public can read certificates storage" ON storage.objects;
CREATE POLICY "Public can read certificates storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

-- 8. Storage upload policy
DROP POLICY IF EXISTS "Service role can upload certificates" ON storage.objects;
CREATE POLICY "Service role can upload certificates"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "Service role can update certificates" ON storage.objects;
CREATE POLICY "Service role can update certificates"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificates');

-- 9. Verify
SELECT COUNT(*) as cert_count FROM public.certificates;
