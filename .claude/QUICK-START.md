# CARBON UPI - Quick Start Guide

## 📋 Current Project Summary

**CARBON UPI** is a Carbon Credit Certificate & Compliance Platform that:
- Tracks carbon emissions/offsets for companies and farmers
- Uses AI agents (LangChain) to process data and calculate impact
- Generates verifiable carbon credit certificates (PDF + QR)
- Provides compliance dashboards and audit trails
- Built with Next.js 16, React 19, TypeScript, Tailwind v4

---

## 🎯 The Reality Check

### What Works Right Now ✅
- Pretty landing page
- Dashboard UI (with fake animated data)
- Component library setup
- API route structure
- LangChain integration started

### What's Broken/Missing ❌
- **NO DATABASE** → All data is hardcoded/fake
- **NO AUTH** → Anyone can access everything
- **AI AGENTS** → Only partially implemented
- **CERTIFICATES** → Can't actually generate them yet
- **FILE UPLOAD** → Doesn't work
- **COMPLIANCE** → Just mockups

---

## 🚀 How to Use the Integrated Skills

We've installed **10 powerful skills** to your [.claude/skills/](.claude/skills/) directory:

### Quick Commands

Use these slash commands from [.claude/commands/](.claude/commands/):

#### `/build-app [description]`
Builds complete applications using multi-skill orchestration
- Activates: @app-builder, @ai-engineer, @ui-ux-pro-max
- Best for: New features, complete modules

#### `/ai-feature [description]`
Adds AI/LLM features to your app
- Activates: @ai-engineer
- Best for: LangChain agents, RAG systems, embeddings

#### `/design-ui [description]`
Professional UI/UX design with 50+ styles
- Activates: @ui-ux-pro-max
- Best for: Landing pages, dashboards, component design

#### `/orchestrate [description]`
Multi-agent full-stack development
- Activates: @full-stack-orchestration, @subagent-driven-development
- Best for: Complex features requiring frontend + backend + database

### Skill Usage Examples

```bash
# Get design system for fintech dashboard
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech compliance dashboard professional" --design-system

# Search for React patterns
grep -r "useMemo" .claude/skills/react-best-practices/

# Read Next.js best practices
cat .claude/skills/nextjs-best-practices/SKILL.md

# Check AI engineering patterns
cat .claude/skills/ai-engineer/SKILL.md
```

---

## ⚡ MVP Development Plan

See full roadmap: [.claude/MVP-ROADMAP.md](.claude/MVP-ROADMAP.md)

### Phase 1: Database & Auth (Days 1-2)
1. Set up Supabase or PostgreSQL
2. Create schema (users, entities, assets, certificates, audit_logs)
3. Implement authentication (Clerk or NextAuth)
4. Protect routes

### Phase 2: Core Features (Days 3-7)
1. Certificate generation (PDF + QR)
2. AI data processing (CSV upload → LangChain → carbon calculation)
3. Real dashboard data

### Phase 3: Production (Days 8-14)
1. Compliance verification
2. Audit trails
3. Deployment to Vercel
4. Monitoring & analytics
5. Launch

---

## 🛠️ Technical Architecture

```
CARBON UPI/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Protected dashboard
│   │   └── api/             # API routes
│   │       ├── agents/      # AI agent endpoints
│   │       ├── certificates/
│   │       └── pipeline/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── landing/         # Landing page sections
│   │   └── dashboard/       # Dashboard widgets
│   ├── lib/
│   │   ├── agents/          # LangChain agent definitions
│   │   └── db/              # Database client (TO BE ADDED)
│   └── providers/           # React Context providers
├── .claude/                  # AI Skills & Commands
│   ├── skills/              # 10 integrated skills
│   ├── commands/            # Slash commands
│   ├── MVP-ROADMAP.md       # Complete development plan
│   └── QUICK-START.md       # This file
└── public/                   # Static assets
```

---

## 📦 Dependencies Already Installed

```json
{
  "AI/LLM": [
    "@langchain/core",
    "@langchain/langgraph",
    "@langchain/openai",
    "openai",
    "@tavily/core"
  ],
  "Data Processing": [
    "papaparse",      // CSV parsing
    "xlsx",           // Excel files
    "mammoth",        // DOCX files
    "pdf-parse"       // PDF extraction
  ],
  "PDF/QR Generation": [
    "jspdf",
    "jspdf-autotable",
    "qrcode"
  ],
  "UI": [
    "tailwindcss v4",
    "@radix-ui/*",
    "lucide-react",
    "shadcn"
  ],
  "Validation": [
    "zod v4"
  ]
}
```

---

## 🔑 Environment Setup

Create `.env.local`:

```bash
# OpenAI (for AI agents)
OPENAI_API_KEY=sk-...

# Supabase (database + auth)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional: Tavily (web search for AI)
TAVILY_API_KEY=tvly-...

# Optional: LangSmith (debugging)
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
```

---

## 🚦 Getting Started Today

### Option A: Fix Database First (Recommended)
```bash
# 1. Set up Supabase
# 2. Ask Claude: "Set up database schema for CARBON UPI with Supabase"
# 3. Connect dashboard to real data
# 4. Add authentication
```

### Option B: Fix AI Agents First
```bash
# 1. Ask Claude: "Complete the LangChain agent implementation"
# 2. Test CSV upload → carbon calculation
# 3. Connect to dashboard
```

### Option C: Ship Landing Page First
```bash
# 1. Polish landing page
# 2. Add email collection
# 3. Deploy to Vercel
# 4. Start getting beta signups while building backend
```

---

## 💡 Pro Tips

1. **Use Subagent-Driven Development**
   - Break features into small tasks
   - Let specialized agents handle each task
   - Review and integrate

2. **Use @ui-ux-pro-max for Design**
   - Run design system generator before building UI
   - Apply accessibility checklist
   - Use pre-defined color palettes

3. **Use @ai-engineer for LangChain**
   - Production patterns for RAG/agents
   - Cost optimization strategies
   - Safety guardrails

4. **Use @test-driven-development**
   - Write tests FIRST
   - Higher quality, fewer bugs
   - Faster debugging

---

## 🎯 Decision Time

**What do you want to tackle FIRST?**

1. **Database + Auth** (foundation for everything)
2. **AI Agents** (the "intelligence" of your platform)
3. **Certificate Generation** (core value proposition)
4. **Landing Page Polish + Deploy** (start getting users)

**Tell me and I'll guide you step-by-step using the integrated skills!**
