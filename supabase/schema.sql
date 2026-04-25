-- GreenPe MVP Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Entities (Companies, MSMEs, Exporters)
create table public.entities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text not null, -- 'FARMER', 'COMPANY', 'MSME_EXPORTER'
  name text not null,
  registration_id text,
  gstin text,
  location jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Entities
alter table public.entities enable row level security;
create policy "Users can view own entities" on public.entities for select using (auth.uid() = user_id);
create policy "Users can insert own entities" on public.entities for insert with check (auth.uid() = user_id);
create policy "Users can update own entities" on public.entities for update using (auth.uid() = user_id);

-- 2. Assets (Solar Panels, EV Fleets, Factories)
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references public.entities on delete cascade not null,
  type text not null, -- 'SOLAR_PANEL', 'EV_FLEET', 'FACTORY'
  description text not null,
  metadata jsonb, -- Coordinates, capacity, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Assets
alter table public.assets enable row level security;
create policy "Users can view own assets" on public.assets for select using (
  exists (select 1 from public.entities where entities.id = assets.entity_id and entities.user_id = auth.uid())
);
create policy "Users can insert own assets" on public.assets for insert with check (
  exists (select 1 from public.entities where entities.id = assets.entity_id and entities.user_id = auth.uid())
);

-- 3. Data Sources (IOT sensors, uploaded CSVs)
create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets on delete cascade not null,
  type text not null, -- 'CSV_UPLOAD', 'IOT_SENSOR'
  source_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Data Points (Actual readings)
create table public.data_points (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid references public.data_sources on delete cascade not null,
  timestamp timestamp with time zone not null,
  value numeric not null,
  unit text not null,
  trust_score text not null default 'MEDIUM',
  raw jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Certificates (Green Impact Certificates)
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text unique not null, -- 'GP-XXXX-XX'
  entity_id uuid references public.entities on delete cascade not null,
  project_name text not null,
  project_type text not null,
  location text not null,
  carbon_reduced numeric not null,
  vintage text not null,
  issued_date date not null,
  verifier text not null,
  status text not null default 'ISSUED',
  pdf_url text, -- Supabase Storage URL
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Certificates
alter table public.certificates enable row level security;
create policy "Users can view own certificates" on public.certificates for select using (
  exists (select 1 from public.entities where entities.id = certificates.entity_id and entities.user_id = auth.uid())
);
create policy "Users can insert own certificates" on public.certificates for insert with check (
  exists (select 1 from public.entities where entities.id = certificates.entity_id and entities.user_id = auth.uid())
);

-- Set up Storage for Certificates
insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true);
create policy "Certificates are publicly accessible" on storage.objects for select using (bucket_id = 'certificates');
create policy "Users can upload certificates" on storage.objects for insert with check (bucket_id = 'certificates' and auth.role() = 'authenticated');
