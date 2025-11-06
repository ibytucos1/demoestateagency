# 🚀 Vercel Deployment - Quick Start

## ⚡ TL;DR - 5-Minute Deploy

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy" (it will fail without env vars - that's okay!)

### 3. Add Environment Variables
Copy these from your `.env.local` file to Vercel Dashboard → Settings → Environment Variables:

**Minimum Required:**
```bash
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_MAPS_BROWSER_KEY
PLACES_SERVER_KEY
```

**Optional (Recommended):**
```bash
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_APP_URL
```

### 4. Setup Google Console HTTP Referrers

After deployment, Vercel gives you a URL like: `https://your-project.vercel.app`

Go to Google Cloud Console → APIs & Services → Credentials → Edit your Browser Key → Add:
```
https://your-project.vercel.app/*
https://your-project-*.vercel.app/*
https://*.vercel.app/*
```

### 5. Redeploy
Go back to Vercel → Deployments → Redeploy latest

### 6. Run Database Migrations
```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

**Done!** 🎉

---

## 📚 Detailed Guides

For step-by-step instructions, see:
- **DEPLOYMENT.md** - Complete deployment guide
- **ENV_VARIABLES.md** - All environment variables explained
- **GOOGLE_CONSOLE_SETUP.md** - Google Maps/Places API setup

---

## 🔑 Getting Your Environment Variables

### Supabase (Database & Auth)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `SUPABASE_ANON_KEY` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings** → **Database**
6. Copy **Connection String** (Direct) → `DATABASE_URL`

### Resend (Email)
1. Go to https://resend.com/api-keys
2. Create API key → `RESEND_API_KEY`
3. Set your email → `RESEND_FROM_EMAIL`

### Google Cloud (Maps & Places)
1. Go to https://console.cloud.google.com/apis/credentials
2. Create Browser Key (with HTTP referrers) → `NEXT_PUBLIC_MAPS_BROWSER_KEY`
3. Create Server Key (restricted to Places API) → `PLACES_SERVER_KEY`

See **GOOGLE_CONSOLE_SETUP.md** for detailed instructions.

### Upstash Redis (Optional)
1. Go to https://console.upstash.com/redis
2. Create database
3. Click on your database
4. Copy **REST API** section:
   - Endpoint → `UPSTASH_REDIS_REST_URL`
   - Token → `UPSTASH_REDIS_REST_TOKEN`

---

## 🐛 Common Issues & Quick Fixes

### "Build failed"
**Fix:** Check Vercel build logs. Usually missing environment variables.

### "Database connection failed"
**Fix:** 
1. Use "Direct" connection string from Supabase (not Pooler)
2. Format: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

### "Google Maps not loading"
**Fix:** 
1. Add your Vercel domain to Google Console HTTP referrers
2. Wait 5 minutes
3. Clear browser cache

### "Authentication not working"
**Fix:** Make sure you set BOTH:
- `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` (same value)
- `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same value)

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All required environment variables ready
- [ ] Supabase project active
- [ ] Google Cloud APIs enabled
- [ ] Google API keys created
- [ ] Resend API key created

---

## 🎯 After Deployment Checklist

- [ ] Vercel deployment successful
- [ ] Environment variables added
- [ ] Google Console HTTP referrers updated with Vercel domain
- [ ] Database migrations run
- [ ] Test user registration
- [ ] Test property creation
- [ ] Test Google Maps loading
- [ ] Test location autocomplete

---

## 🆘 Need Help?

1. **Detailed Instructions:** Read DEPLOYMENT.md
2. **Environment Variables:** Read ENV_VARIABLES.md
3. **Google Setup:** Read GOOGLE_CONSOLE_SETUP.md
4. **Vercel Logs:** Dashboard → Functions → View logs
5. **Browser Console:** F12 → Console tab

---

## 💡 Pro Tips

1. **Use Vercel CLI** for faster deploys:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Test locally first:**
   ```bash
   npm run build
   npm start
   ```

3. **Check build before pushing:**
   ```bash
   npm run typecheck
   npm run lint
   ```

4. **Preview deployments** are automatic for pull requests - test before merging!

5. **Set up custom domain** in Vercel Dashboard → Domains (don't forget to update Google Console referrers!)

---

## 📞 Support Links

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Google Maps Docs:** https://developers.google.com/maps/documentation

---

## 🎉 You're Ready!

Follow the steps above and you'll be live in minutes!

