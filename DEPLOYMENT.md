# Deployment Guide - Vercel

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- Supabase project (https://supabase.com)
- Google Cloud Platform account (for Maps/Places APIs)
- Upstash Redis account (https://upstash.com)
- Resend account (https://resend.com)

---

## 📋 Step-by-Step Deployment

### 1. Push to GitHub (if not already)

```bash
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Environment Variables Setup

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

#### Required Variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Resend Email
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Supabase
SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Google APIs
NEXT_PUBLIC_MAPS_BROWSER_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
PLACES_SERVER_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://xxxxx-xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### Optional Variables:

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TURNSTILE_SECRET_KEY="0x4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"

# Inngest
INNGEST_EVENT_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
INNGEST_SIGNING_KEY="signkey-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# App
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

---

## 🗺️ Google Cloud Console Setup

### Step 1: Enable APIs

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps JavaScript API** (for map displays)
   - **Places API** (for location autocomplete)
   - **Geocoding API** (for address lookups)

### Step 2: Create API Keys

#### Browser Key (NEXT_PUBLIC_MAPS_BROWSER_KEY)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Click **Edit API Key** (restrict it):
   - **Application restrictions**:
     - Select **HTTP referrers (websites)**
     - Add these referrers:
       ```
       http://localhost:3000/*
       http://localhost:*
       https://your-domain.com/*
       https://your-domain.vercel.app/*
       https://*.vercel.app/*
       ```
   - **API restrictions**:
     - Select **Restrict key**
     - Choose:
       - Maps JavaScript API
       - Places API
   - Click **Save**
4. Copy the key → Set as `NEXT_PUBLIC_MAPS_BROWSER_KEY`

#### Server Key (PLACES_SERVER_KEY)

1. Create another API key
2. Click **Edit API Key**:
   - **Application restrictions**:
     - Select **IP addresses (web servers, cron jobs, etc.)**
     - Click **Add an item**
     - Add **0.0.0.0/0** (Vercel uses dynamic IPs)
   - **API restrictions**:
     - Select **Restrict key**
     - Choose:
       - Places API
       - Geocoding API
   - Click **Save**
3. Copy the key → Set as `PLACES_SERVER_KEY`

### Step 3: Update Referrers After Deployment

After deploying to Vercel, add your actual domain:

1. Go back to **Browser Key** settings
2. Add your Vercel domains:
   ```
   https://your-project-name.vercel.app/*
   https://your-project-name-*.vercel.app/*
   https://your-custom-domain.com/*
   ```

---

## 🗄️ Database Setup

### Run Migrations on Production

After deployment, run migrations:

```bash
# Option 1: From local machine (recommended)
DATABASE_URL="your-production-db-url" npx prisma migrate deploy

# Option 2: Vercel CLI
vercel env pull .env.production
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### Seed Initial Data (Optional)

```bash
DATABASE_URL="your-production-db-url" npx prisma db seed
```

---

## ✅ Post-Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] Google API keys created and restricted
- [ ] HTTP referrers added to Google Console
- [ ] Database migrations run successfully
- [ ] Test user registration/login
- [ ] Test property creation
- [ ] Test lease creation
- [ ] Test payment tracking
- [ ] Verify Google Maps loads correctly
- [ ] Verify location autocomplete works
- [ ] Check rate limiting (Upstash Redis)
- [ ] Test email notifications (Resend)

---

## 🔧 Troubleshooting

### Google Maps Not Loading

**Error**: "This page can't load Google Maps correctly"

**Solution**: 
1. Check browser console for specific error
2. Verify `NEXT_PUBLIC_MAPS_BROWSER_KEY` is set in Vercel
3. Ensure your domain is in Google Console referrers
4. Wait 5 minutes for Google Console changes to propagate

### Location Autocomplete Not Working

**Error**: API key errors in console

**Solution**:
1. Verify Places API is enabled
2. Check both browser and server keys are set
3. Ensure Places API is allowed in both keys' restrictions

### Database Connection Failed

**Error**: "Can't reach database server"

**Solution**:
1. Verify `DATABASE_URL` is correct in Vercel
2. Check database allows connections from Vercel IPs
3. For Supabase: Enable "Direct connection" mode
4. Run migrations: `npx prisma migrate deploy`

### Rate Limiting Not Working

**Error**: Redis connection failed

**Solution**:
1. Verify Upstash Redis credentials
2. Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
3. System will fallback to in-memory rate limiting

---

## 📱 Custom Domain Setup

1. Go to Vercel Dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update Google Console referrers with new domain
6. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to main:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Preview deployments are created for pull requests automatically.

---

## 📊 Monitoring

### View Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab to see serverless function logs

### Error Tracking (Optional - Sentry)

If you set up Sentry:
1. Go to https://sentry.io
2. View errors in real-time
3. Get stack traces and user context

---

## 🚨 Important Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use Vercel Environment Variables** - Set them in dashboard
3. **Restrict API Keys** - Always use HTTP referrers and IP restrictions
4. **Run Migrations** - After every database schema change
5. **Test Thoroughly** - Check all features after deployment

---

## 📞 Support

If you encounter issues:
- Vercel: https://vercel.com/support
- Google Cloud: https://cloud.google.com/support
- Supabase: https://supabase.com/support
- Next.js: https://github.com/vercel/next.js/discussions

---

## 🎉 Deployment Complete!

Your real estate platform is now live on Vercel! 🚀

