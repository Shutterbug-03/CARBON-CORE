# GreenPe Beckn-Ready Carbon UPI Pilot

This repo now exposes a focused pilot slice for **India rooftop solar climate verification**:

- `CIH` identity binding
- `CDIF` ingestion and normalization
- deterministic rooftop-solar MRV
- `GIC` issuance with public verification
- Beckn provider routes for `search`, `select`, `init`, `confirm`, and `status`

The goal is a **pilot-ready verification rail**, not a full marketplace.

## Main routes

- `/` - pilot landing page
- `/dashboard` - primary pilot console
- `/demo` - standalone upload and simulation console
- `/verify/[id]` - public GIC verification page

## API surface

### Pilot verification

- `POST /api/pilot/verify`
- `GET /api/pilot/verify/[id]`
- `GET /api/pilot/beckn-events`

### Beckn provider adapter

- `POST /api/beckn/search`
- `POST /api/beckn/select`
- `POST /api/beckn/init`
- `POST /api/beckn/confirm`
- `POST /api/beckn/status`

### Workbook ingestion

- `POST /api/mrv/upload`

Use this to upload `.xlsx`, `.xls`, `.csv`, or `.json`, then pass the normalized payload into `/api/pilot/verify`.

## Scripts

```bash
npm run dev
npm run build
npm run test:pilot
npm run lint:pilot
```

## Environment

Required for the full app:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=...
```

Optional for durable pilot persistence:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BECKN_SHARED_SECRET=pilot-secret
```

Without Supabase, the pilot still works using in-memory storage for the current server process.

## Supabase notes

The existing schema files contain the legacy MVP tables. For the Beckn-ready pilot, also apply the `pilot_*` tables added in `supabase/schema.sql` so verification jobs and Beckn transaction logs can persist cleanly.

## Current scope

- First vertical only: **India rooftop solar**
- Deterministic MRV only for final verified impact
- Registry, KYC, and Beckn network interactions remain sandbox-friendly
- Broader dashboard modules still exist in the repo, but `/dashboard` is now the canonical pilot path
