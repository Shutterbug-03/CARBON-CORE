# CARBON UPI - MVP Production Roadmap

## 🎯 What You Have (Reality Check)

**Product**: Carbon Credit Certificate & Compliance Platform with AI Agents
**Tech Stack**: Next.js 16 + React 19 + TypeScript + LangChain + OpenAI + Tailwind v4
**Current State**: 83 source files, landing page, dashboard, AI agent system partially built

### ✅ Working Components
- Landing page with sections (Hero, Problem, Solution, Trust, FAQ, CTA)
- Dashboard shell with:
  - Live KPI stats (fake data animating)
  - Certificate management UI
  - Audit logs display
  - Net impact visualization
  - Settings, Pipeline, Agents, Compliance pages
- API routes structure:
  - `/api/agents/` (chat, ingest, stream, task, train)
  - `/api/certificates/`
  - `/api/pipeline/`
- AI Agent system with LangChain integration
- Component library: shadcn/ui + Radix + Lucide icons

### ❌ What's Missing (Critical Gaps)
1. **NO REAL DATABASE** - Everything is fake/mocked data
2. **NO AUTHENTICATION** - Anyone can access everything
3. **NO REAL AI AGENT LOGIC** - Partial implementation only
4. **NO FILE UPLOAD/PROCESSING** - CSV mentioned but not working
5. **NO CERTIFICATE GENERATION** - UI exists, no backend
6. **NO COMPLIANCE VERIFICATION** - Just UI mockups
7. **NO DEPLOYMENT CONFIG** - Can't go to production
8. **NO REAL UPI INTEGRATION** - Name is "CARBON UPI" but no payment flow

---

## 🚀 MVP Sprint Plan (2 Weeks to Launch)

### Week 1: Core Functionality

#### Day 1-2: Database & Auth Foundation
**Goal**: Real data persistence + user authentication

```bash
# Tasks:
1. Set up Supabase/PostgreSQL database
2. Create schema:
   - users (auth)
   - entities (companies/farmers)
   - assets (land, equipment)
   - certificates (carbon credits)
   - audit_logs
   - compliance_records
3. Implement Clerk Auth or NextAuth
4. Add protected routes
5. User roles: ADMIN, ENTITY_MANAGER, AUDITOR
```

**Deliverable**: Users can sign up, login, see their own data

#### Day 3-4: Certificate Creation Pipeline
**Goal**: Generate actual carbon credit certificates

```bash
# Tasks:
1. Build /api/certificates/create endpoint
2. Implement PDF generation with jsPDF (already in package.json)
3. Add QR code to certificates (qrcode lib already installed)
4. Store certificate metadata in database
5. Upload certificate PDFs to cloud storage (Supabase Storage/S3)
6. Update UI to show real certificates
```

**Deliverable**: Users can create and download verifiable certificates

#### Day 5-7: AI Data Processing Agent
**Goal**: Use LangChain to process uploaded data and calculate carbon impact

```bash
# Tasks:
1. Fix /api/agents/ingest endpoint
2. Implement file upload (CSV/Excel via papaparse/xlsx)
3. LangChain agent to:
   - Parse raw data (energy usage, emissions, etc.)
   - Calculate carbon impact using formulas
   - Validate data quality
   - Generate audit trail
4. Store processed results in database
5. Update dashboard with real calculations
```

**Deliverable**: Upload CSV → AI calculates carbon impact → Shows in dashboard

---

### Week 2: Production Ready

#### Day 8-9: Compliance & Verification
**Goal**: Make certificates trustworthy

```bash
# Tasks:
1. Implement verification API endpoint
2. Blockchain verification (optional: store hash on testnet)
3. Compliance checklist system (ISO 14064-3)
4. Audit log with timestamps and user actions
5. Export compliance reports (PDF)
```

**Deliverable**: Every certificate is verifiable and auditable

#### Day 10-11: Real-time Dashboard & Analytics
**Goal**: Replace fake stats with real data

```bash
# Tasks:
1. Connect KPI stats to database queries
2. Implement real-time subscriptions (Supabase Realtime)
3. Add charts with real data (consider recharts/chart.js)
4. Entity/Asset map visualization (if needed)
5. Performance optimization (caching, lazy loading)
```

**Deliverable**: Dashboard shows live, accurate platform stats

#### Day 12-13: Deployment & Polish
**Goal**: Ship to production

```bash
# Tasks:
1. Environment setup:
   - Production database
   - API keys management
   - CORS/security headers
2. Deploy to Vercel
3. Set up domain
4. Error tracking (Sentry)
5. Analytics (PostHog/Plausible)
6. Load testing
7. Security audit
8. Documentation/onboarding
```

**Deliverable**: Live production app with monitoring

#### Day 14: Launch & Feedback
```bash
# Tasks:
1. Soft launch to 10 beta users
2. Collect feedback
3. Fix critical bugs
4. Prepare marketing materials
5. Public launch
```

---

## 🔥 MVP Feature Set (What Makes It Real)

### Must-Have (Non-Negotiable)
1. ✅ **User Authentication** - Secure login/signup
2. ✅ **Entity Management** - Add companies/farmers to system
3. ✅ **Asset Registration** - Register land/equipment for carbon tracking
4. ✅ **Data Upload & Processing** - CSV upload → AI analysis → Carbon calculation
5. ✅ **Certificate Generation** - PDF with QR code, downloadable
6. ✅ **Certificate Verification** - Public endpoint to verify authenticity
7. ✅ **Audit Trail** - Every action logged with timestamp
8. ✅ **Dashboard Analytics** - Real data, real charts
9. ✅ **Compliance Reports** - Export ISO-compliant documentation

### Nice-to-Have (Post-MVP)
- UPI/Stripe payment integration for certificate purchases
- Blockchain anchoring for immutable verification
- Mobile app (React Native)
- API for third-party integrations
- Advanced AI agents (forecasting, recommendations)
- Multi-language support
- Bulk operations

---

## 💰 Monetization Strategy

1. **Freemium Model**:
   - Free: 5 certificates/month
   - Pro: $49/month - Unlimited certificates
   - Enterprise: Custom pricing - API access, white-label

2. **Transaction Fees**:
   - 2.5% on certificate trades (if marketplace added)

3. **Compliance Audit Services**:
   - Manual verification by experts: $500-$2000/audit

---

## 📊 Success Metrics (MVP)

- **Week 1**: 50 signups, 100 certificates generated
- **Month 1**: 200 signups, 1000 certificates, 5 paying customers
- **Month 3**: 1000 signups, 10K certificates, $5K MRR

---

## 🛠️ Integrated Skills to Use

Use the skills we copied to `.claude/skills/`:

### Planning & Architecture
```bash
# Use subagent-driven-development for task execution
# Use app-builder for system architecture decisions
```

### Implementation
```bash
# Use @ai-engineer for LangChain agent implementation
# Use @nextjs-best-practices for Next.js patterns
# Use @react-best-practices for component architecture
```

### Quality
```bash
# Use @test-driven-development for testing
# Use @systematic-debugging when stuck
# Use @code-review-excellence before committing
```

### UI/UX
```bash
# Use @ui-ux-pro-max for design system refinement
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech compliance dashboard" --design-system
```

---

## 🚨 What NOT to Build (Scope Creep Killers)

❌ Advanced AI forecasting models
❌ Complete ERP integration
❌ Mobile apps (MVP is web-only)
❌ Social features (comments, likes, etc.)
❌ Video tutorials/onboarding
❌ Multi-currency support
❌ Advanced permissions (keep it simple: 3 roles max)

---

## ✅ Next Immediate Action

**RIGHT NOW**: Let's start with Database Schema + Auth

1. Choose: **Supabase** (recommended) or PostgreSQL + Clerk
2. I'll generate the complete schema
3. We implement auth in 1 hour
4. Then we connect the dashboard to real data

**Ready to build the actual product?** Let me know and I'll start with the database schema.
