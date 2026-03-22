# ⚡ Quick Deploy Guide - 5 Minutes

## 🌐 Deploy Frontend to Vercel (2 minutes)

### Method 1: One-Click Deploy (Easiest)

1. Click this button:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shutterbug-03/CARBON-CORE)

2. Sign in with GitHub
3. Click "Deploy"
4. Done! Get your URL: `https://carbon-core-xxxx.vercel.app`

### Method 2: Import from Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `Shutterbug-03/CARBON-CORE`
4. Click "Deploy"
5. Wait 2 minutes
6. Visit your site!

---

## 🐳 Deploy Backend to Coolify (3 minutes)

### Prerequisites
- Coolify instance URL (e.g., `coolify.yourdomain.com`)
- Admin access to Coolify

### Steps

1. **Login to Coolify Dashboard**
   - Go to your Coolify URL
   - Sign in

2. **Add New Resource**
   - Click "+ New Resource"
   - Select "Application"
   - Choose "Public Repository"

3. **Configure Repository**
   ```
   Repository: https://github.com/Shutterbug-03/CARBON-CORE
   Branch: main
   Build Pack: Node.js
   Port: 3000
   ```

4. **Add Environment Variables**
   Click "Environment" tab and add:
   ```env
   NODE_ENV=production
   NEXTAUTH_SECRET=your-random-secret-here
   NEXTAUTH_URL=https://your-domain.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Monitor logs
   - Get your backend URL

---

## ⚙️ Environment Variables

### For Vercel (Frontend)
```env
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### For Coolify (Backend)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=generate-random-string-here
NEXTAUTH_URL=https://api.greenpe.com
```

---

## ✅ Verify Deployment

### Frontend (Vercel)
1. Visit: `https://carbon-core-xxxx.vercel.app`
2. Check landing page loads
3. Check navigation works
4. Check dashboard UI displays

### Backend (Coolify)
1. Visit: `https://api.greenpe.com/api/certificates`
2. Should see JSON response
3. Check Coolify logs for errors

---

## 🚨 If Something Breaks

### Frontend Issues
- Check Vercel deployment logs
- Verify build succeeded
- Check function logs in Vercel dashboard

### Backend Issues
- Check Coolify application logs
- Verify environment variables set
- Check Docker container status

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Coolify:** Your Coolify URL
- **GitHub Repo:** https://github.com/Shutterbug-03/CARBON-CORE
- **Docs:** See `DEPLOYMENT-GUIDE.md` for details

---

## 🎯 What Works After Deployment

### ✅ Frontend (Working)
- Landing page with video
- Premium UI/UX
- Dashboard interface
- Navigation and routing

### ⚠️ Backend (Needs Work)
- Static data only
- No database yet
- No user authentication
- Certificate generation broken

**Next:** Follow `BACKEND-MVP-ROADMAP.md` to complete backend in 10 days

---

**Deploy Time:** 5 minutes
**Status:** Frontend ✅ | Backend 🚧
**Ready for:** User testing (UI/UX only)
