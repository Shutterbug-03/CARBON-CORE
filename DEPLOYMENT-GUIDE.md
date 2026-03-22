# 🚀 Deployment Guide - GreenPe (Carbon UPI)

## ✅ Step 1: Code Pushed to GitHub ✓

**Repository:** https://github.com/Shutterbug-03/CARBON-CORE.git
**Branch:** main
**Latest Commit:** Premium UI/UX upgrades with video background and Framer Motion

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Repository:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose: `Shutterbug-03/CARBON-CORE`

3. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables:**
   Add these in Vercel dashboard:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get deployment URL: `https://carbon-core.vercel.app`

### Option B: Vercel CLI

```bash
cd "/Users/dharanshsingh/CARBON UPI/CARBON UPI"

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

---

## 🐳 Step 3: Deploy Backend to Coolify

### Prerequisites
- Coolify instance running
- Docker installed on Coolify server
- Domain/subdomain for API (e.g., `api.greenpe.com`)

### Deployment Steps

1. **Create New Resource in Coolify:**
   - Go to Coolify dashboard
   - Click "Add Resource" → "Application"
   - Choose "Docker Compose" or "Dockerfile"

2. **Connect GitHub Repository:**
   - Repository: `https://github.com/Shutterbug-03/CARBON-CORE.git`
   - Branch: `main`
   - Build Pack: Node.js

3. **Configure Build:**
   ```dockerfile
   # Dockerfile for backend
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

4. **Environment Variables (Add in Coolify):**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:5432/greenpe
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://api.greenpe.com
   ```

5. **Deploy and Monitor:**
   - Click "Deploy"
   - Monitor logs in Coolify dashboard
   - Set up health checks

---

## ⚠️ Current Status: Frontend Only

### ✅ What Works Now:
- Landing page with video background
- Premium UI/UX design
- Navigation and routing
- Dashboard UI (read-only)
- Static certificate display

### ❌ What Doesn't Work (Backend Required):
- Certificate generation
- Data ingestion
- AI agent orchestration
- User authentication
- Database persistence
- Real-time updates

---

## 📋 Backend MVP Roadmap

See `BACKEND-MVP-ROADMAP.md` for complete implementation plan.

### Critical Path (Next 2 Weeks):

**Week 1: Core Infrastructure**
1. Database setup (PostgreSQL)
2. Authentication (NextAuth.js)
3. API route completion
4. Basic CRUD operations

**Week 2: MVP Features**
1. Certificate generation
2. Data pipeline
3. User management
4. Deployment to Coolify

---

## 🔗 Quick Links

- **Frontend Deployment:** https://vercel.com/new
- **GitHub Repository:** https://github.com/Shutterbug-03/CARBON-CORE
- **Coolify Docs:** https://coolify.io/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Coolify application logs
3. Verify environment variables
4. Check database connectivity

---

**Last Updated:** March 22, 2026
**Status:** Frontend Ready ✅ | Backend In Progress 🚧
