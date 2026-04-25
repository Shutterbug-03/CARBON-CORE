-- ============================================================
-- GreenPe MVP — Fix RLS on ALL tables (entities, assets, etc.)
-- Run this AFTER mvp-patch.sql
-- ============================================================

-- ── ENTITIES TABLE ──────────────────────────────────────────
-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can view own entities" ON public.entities;
DROP POLICY IF EXISTS "Users can insert own entities" ON public.entities;
DROP POLICY IF EXISTS "Users can update own entities" ON public.entities;

-- Open policies for MVP (no auth required)
CREATE POLICY "Public can view entities" ON public.entities
  FOR SELECT USING (true);

CREATE POLICY "Public can insert entities" ON public.entities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update entities" ON public.entities
  FOR UPDATE USING (true);

-- Make user_id nullable (MVP: no real auth)
ALTER TABLE public.entities
  ALTER COLUMN user_id DROP NOT NULL;

-- Drop the FK to auth.users so we don't need a real auth session
ALTER TABLE public.entities
  DROP CONSTRAINT IF EXISTS entities_user_id_fkey;

-- ── ASSETS TABLE ────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own assets" ON public.assets;
DROP POLICY IF EXISTS "Users can insert own assets" ON public.assets;

CREATE POLICY "Public can view assets" ON public.assets
  FOR SELECT USING (true);

CREATE POLICY "Public can insert assets" ON public.assets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update assets" ON public.assets
  FOR UPDATE USING (true);

-- ── DATA SOURCES TABLE ──────────────────────────────────────
-- Enable RLS if not already, then open it
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view data_sources" ON public.data_sources;
CREATE POLICY "Public can view data_sources" ON public.data_sources
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert data_sources" ON public.data_sources;
CREATE POLICY "Public can insert data_sources" ON public.data_sources
  FOR INSERT WITH CHECK (true);

-- ── DATA POINTS TABLE ───────────────────────────────────────
ALTER TABLE public.data_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view data_points" ON public.data_points;
CREATE POLICY "Public can view data_points" ON public.data_points
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert data_points" ON public.data_points;
CREATE POLICY "Public can insert data_points" ON public.data_points
  FOR INSERT WITH CHECK (true);

-- ── VERIFY ──────────────────────────────────────────────────
SELECT 'RLS opened on all tables' as status;
