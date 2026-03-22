# CARBON UPI - Claude Skills Integration

## 🎯 What Just Happened

I analyzed your **CARBON UPI** codebase and integrated **10 world-class AI development skills** into [.claude/](.claude/) to help you ship a production-ready MVP.

---

## 📁 What's in This Directory

```
.claude/
├── README.md              # You are here
├── QUICK-START.md         # How to use integrated skills
├── MVP-ROADMAP.md         # 14-day sprint to launch
│
├── skills/                # 10 Integrated Superpowers
│   ├── ai-engineer/           # Production LLM/RAG systems
│   ├── ui-ux-pro-max/         # 50+ styles, 97 palettes, design intelligence
│   ├── app-builder/           # Full-stack app orchestration
│   ├── subagent-driven-development/  # Multi-agent task execution
│   ├── full-stack-orchestration/     # API-first full-stack dev
│   ├── nextjs-best-practices/        # Next.js 14+ patterns
│   ├── react-best-practices/         # React 19 patterns
│   ├── test-driven-development/      # TDD workflows
│   ├── systematic-debugging/         # Debug methodically
│   └── code-review-excellence/       # Quality gates
│
├── commands/              # Slash Commands (Triggers)
│   ├── build-app.md          # /build-app - Full app builder
│   ├── ai-feature.md         # /ai-feature - Add AI intelligence
│   ├── design-ui.md          # /design-ui - Professional UI/UX
│   └── orchestrate.md        # /orchestrate - Multi-agent dev
│
└── agents/                # (Empty - for custom agents)
```

---

## 🚀 Quick Start

### 1. Read the Analysis
- [**MVP-ROADMAP.md**](MVP-ROADMAP.md) - Reality check + 14-day plan to production
- [**QUICK-START.md**](QUICK-START.md) - How to use skills + next steps

### 2. Use Slash Commands
From your chat with Claude:

```
/build-app [feature description]
→ Activates full app builder with multi-skill orchestration

/ai-feature [AI feature to add]
→ Production-ready LLM integration using @ai-engineer

/design-ui [UI to create]
→ Beautiful, accessible design using @ui-ux-pro-max

/orchestrate [complex feature]
→ Multi-agent full-stack development
```

### 3. Direct Skill Access
Ask Claude to use specific skills:

```
"Using @ai-engineer skill, help me implement the LangChain agent for carbon calculation"

"Using @ui-ux-pro-max, design a fintech dashboard for compliance tracking"

"Using @subagent-driven-development, execute the certificate generation feature"
```

---

## 🎯 Your Product (Analysis)

**CARBON UPI** = Carbon Credit Certificate & Compliance Platform

### Current State ✅
- Landing page (looks great!)
- Dashboard UI with bento grid layout
- AI agent structure (LangChain + OpenAI)
- API routes for agents, certificates, pipeline
- Component library (shadcn/ui + Radix + Lucide)
- Modern stack (Next.js 16, React 19, Tailwind v4, TypeScript)

### Critical Gaps ❌
1. **NO DATABASE** - All data is fake/hardcoded
2. **NO AUTH** - Anyone can access everything
3. **AI AGENTS INCOMPLETE** - Only 30% implemented
4. **NO FILE UPLOAD** - CSV parsing not hooked up
5. **NO CERTIFICATE GENERATION** - UI exists, no backend
6. **NO DEPLOYMENT CONFIG** - Can't go live

### MVP Goal 🎯
**2 weeks to production** with these features:
1. User authentication
2. Real database (Supabase recommended)
3. CSV upload → AI processes → Carbon calculation
4. Generate PDF certificates with QR codes
5. Verification endpoint
6. Live dashboard with real data
7. Deploy to Vercel

---

## 💰 Why This Matters (Business Value)

Your platform solves **carbon credit verification** - a **$2 billion market** growing 40% annually.

### Revenue Model
- **Freemium**: 5 free certificates/month, $49/month Pro
- **Transaction fees**: 2.5% on trades
- **Audit services**: $500-2K per manual verification

### Success Metrics (MVP)
- Week 1: 50 signups, 100 certificates
- Month 1: 200 signups, 1000 certificates, 5 paying customers
- Month 3: 1000 signups, 10K certificates, $5K MRR

---

## 🛠️ How Skills Work Together

### Example: Build Certificate Generation Feature

1. **Planning**: `@app-builder` analyzes requirements
2. **Architecture**: `@full-stack-orchestration` designs database + API + frontend
3. **Implementation**:
   - Backend: `@nextjs-best-practices` + `@ai-engineer`
   - Frontend: `@react-best-practices` + `@ui-ux-pro-max`
4. **Execution**: `@subagent-driven-development` coordinates tasks
5. **Quality**: `@test-driven-development` + `@code-review-excellence`
6. **Debug**: `@systematic-debugging` if issues arise

### Example: Add AI Carbon Calculator

```bash
# 1. Design system
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "data upload processing" --design-system

# 2. Implement with @ai-engineer
Ask: "Using @ai-engineer, implement a LangChain agent that:
- Accepts CSV uploads (energy usage data)
- Calculates carbon footprint using emission factors
- Validates data quality
- Returns structured results with confidence scores"

# 3. Test with @test-driven-development
# 4. Deploy
```

---

## 📚 Skill Descriptions

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **ai-engineer** | Production LLM apps, RAG, agents | AI features, LangChain, embeddings |
| **ui-ux-pro-max** | 50+ styles, design intelligence | Landing pages, dashboards, components |
| **app-builder** | Full-stack app orchestration | New projects, major features |
| **subagent-driven-development** | Task-based multi-agent execution | Complex features with many steps |
| **full-stack-orchestration** | API-first architecture | Features spanning DB + API + UI |
| **nextjs-best-practices** | Next.js 14+ patterns | App Router, Server Components, caching |
| **react-best-practices** | React 19 patterns | Hooks, performance, state management |
| **test-driven-development** | TDD workflows | Ensure quality, reduce bugs |
| **systematic-debugging** | Methodical problem-solving | Stuck on a bug |
| **code-review-excellence** | Quality gates | Before merging code |

---

## 🎓 Learning Resources

Each skill has comprehensive documentation:

```bash
# Read a skill
cat .claude/skills/ai-engineer/SKILL.md

# Search UI/UX patterns
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# Explore React patterns
ls .claude/skills/react-best-practices/
```

---

## ⚡ Next Steps

### Choose Your Path:

#### A. **Foundation First** (Recommended)
```
1. Set up Supabase database
2. Implement authentication
3. Connect dashboard to real data
→ Estimated time: 2 days
```

#### B. **Quick Win**
```
1. Polish landing page
2. Add email capture
3. Deploy to Vercel
4. Start collecting beta signups
→ Estimated time: 4 hours
```

#### C. **Core Value**
```
1. Fix AI agent (carbon calculation)
2. Implement CSV upload
3. Show results in dashboard
→ Estimated time: 3 days
```

---

## 🤝 How to Work with Claude

### Effective Prompts

**Good ✅**
```
"Using @ai-engineer skill, implement the carbon calculation LangChain agent.
It should accept CSV with columns: date, energy_kwh, source.
Use emission factors from EPA.
Return: total_carbon_kg, confidence_score, breakdown."
```

**Bad ❌**
```
"Add AI stuff"
```

### Workflow

1. **Specify the skill**: `@ai-engineer`, `@ui-ux-pro-max`, etc.
2. **Be specific**: Exact feature, inputs, outputs
3. **Provide context**: What's already built, what's needed
4. **Review**: Check generated code, ask questions
5. **Iterate**: Refine based on feedback

---

## 🎯 Success Criteria

Your MVP is **production-ready** when:

- [ ] Users can sign up and login
- [ ] Upload CSV → See carbon calculation
- [ ] Generate downloadable certificate (PDF + QR)
- [ ] Verify certificate via public URL
- [ ] Dashboard shows real user data
- [ ] Deployed to custom domain
- [ ] Error tracking configured
- [ ] 10 beta users tested successfully

---

## 🔥 Let's Ship This

**You're 2 weeks away from a production MVP worth $$$.**

Tell Claude:
1. What you want to build first
2. Any constraints or preferences
3. Let's execute using the integrated skills

**No more garbage. No more wasted time. Let's build something real.**

---

*Skills sourced from: superpowers@claude-plugins-official + antigravity + agent skills library*
*Integrated on: 2026-03-22*
