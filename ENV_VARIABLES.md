# Environment Variables Reference

## 🔐 Required Environment Variables for Vercel

Copy and paste these into Vercel Dashboard → Settings → Environment Variables

### Database (Supabase/PostgreSQL)
```
DATABASE_URL
```
Example: `postgresql://postgres:password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres`

Get from: Supabase Dashboard → Settings → Database → Connection String (Direct)

---

### Email Service (Resend)
```
RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_TO_EMAIL
```

Get from: https://resend.com/api-keys

---

### Supabase Authentication & Storage
```
SUPABASE_URL
SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Get from: Supabase Dashboard → Settings → API

**Note:** 
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Set both versions (with and without NEXT_PUBLIC) to the same values

---

### Google Maps & Places API
```
NEXT_PUBLIC_MAPS_BROWSER_KEY
PLACES_SERVER_KEY
```

Get from: Google Cloud Console → APIs & Services → Credentials

**Important:** Must configure HTTP referrers (see below)

---

### Redis (Upstash) - Rate Limiting & Caching
```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Get from: https://console.upstash.com/redis → Your Database → REST API

**Note:** Optional - will fallback to in-memory if not set

---

### Optional Services

#### Cloudflare Turnstile (CAPTCHA)
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

#### Sentry (Error Tracking)
```
NEXT_PUBLIC_SENTRY_DSN
SENTRY_DSN
SENTRY_AUTH_TOKEN
```

#### Plausible Analytics
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

#### Inngest (Background Jobs)
```
INNGEST_EVENT_KEY
INNGEST_SIGNING_KEY
```

#### App URL
```
NEXT_PUBLIC_APP_URL
NODE_ENV=production
```

---

## 🗺️ Google Cloud Console Configuration

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create new project: "Real Estate Platform"
3. Enable billing (required for Maps APIs)

### Step 2: Enable Required APIs
Enable these 3 APIs:
1. **Maps JavaScript API**
2. **Places API**
3. **Geocoding API**

Navigate to: APIs & Services → Library → Search and enable each

### Step 3: Create Browser API Key

1. Go to **APIs & Services → Credentials**
2. Click **+ CREATE CREDENTIALS → API key**
3. Copy the key immediately
4. Click **Edit API key** (pencil icon)

#### Configure Browser Key:
**Name:** `Real Estate - Browser Key`

**Application restrictions:**
- Select: **HTTP referrers (websites)**
- Click **ADD AN ITEM**
- Add these referrers:

```
http://localhost:3000/*
http://localhost:*
https://your-project-name.vercel.app/*
https://your-project-name-*.vercel.app/*
https://*.vercel.app/*
```

**API restrictions:**
- Select: **Restrict key**
- Check these APIs:
  - ☑️ Maps JavaScript API
  - ☑️ Places API

Click **SAVE**

**Set in Vercel as:** `NEXT_PUBLIC_MAPS_BROWSER_KEY`

---

### Step 4: Create Server API Key

1. Click **+ CREATE CREDENTIALS → API key**
2. Copy the key
3. Click **Edit API key**

#### Configure Server Key:
**Name:** `Real Estate - Server Key`

**Application restrictions:**
- Select: **None**
(Vercel uses dynamic IPs, so we can't restrict by IP)

**API restrictions:**
- Select: **Restrict key**
- Check these APIs:
  - ☑️ Places API
  - ☑️ Geocoding API

Click **SAVE**

**Set in Vercel as:** `PLACES_SERVER_KEY`

---

## ⚙️ How to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Your actual value
   - **Environments**: Check all (Production, Preview, Development)
   - Click **Save**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add variables one by one
vercel env add DATABASE_URL production
vercel env add RESEND_API_KEY production
vercel env add SUPABASE_URL production
# ... etc
```

### Method 3: Import from .env file

```bash
# Pull existing variables to file
vercel env pull .env.production

# Edit .env.production with your values
# Then push back
vercel env push .env.production
```

---

## 🚀 Quick Setup Checklist

### Before Deployment:

- [ ] **Supabase Project Created**
  - Database URL copied
  - API keys copied (URL, anon, service role)

- [ ] **Google Cloud Console**
  - Project created
  - 3 APIs enabled (Maps, Places, Geocoding)
  - Browser key created & restricted with HTTP referrers
  - Server key created & restricted to APIs
  
- [ ] **Resend Account**
  - API key generated
  - From email address verified

- [ ] **Upstash Redis** (Optional)
  - Database created
  - REST URL & Token copied

### During Deployment:

- [ ] **GitHub Repository**
  - Code pushed to main branch
  
- [ ] **Vercel Project**
  - Project imported from GitHub
  - All environment variables added
  - First deployment completed

### After Deployment:

- [ ] **Database Migrations**
  ```bash
  DATABASE_URL="your-production-url" npx prisma migrate deploy
  ```

- [ ] **Update Google Console**
  - Add actual Vercel domain to HTTP referrers
  - Format: `https://your-project.vercel.app/*`

- [ ] **Test Functionality**
  - User registration/login works
  - Google Maps loads correctly
  - Location autocomplete works
  - Property creation works
  - Lease creation works
  - Payment tracking works
  - Email notifications work

---

## 🐛 Common Issues

### Issue: "This page can't load Google Maps correctly"

**Cause:** API key not configured or referrers incorrect

**Fix:**
1. Check `NEXT_PUBLIC_MAPS_BROWSER_KEY` is set in Vercel
2. Verify your domain is in Google Console HTTP referrers
3. Wait 5 minutes for changes to propagate
4. Clear browser cache

### Issue: "Database connection failed"

**Cause:** Wrong DATABASE_URL or migrations not run

**Fix:**
1. Verify DATABASE_URL in Vercel matches Supabase
2. Ensure you copied the "Direct connection" URL (not pooled)
3. Run migrations:
   ```bash
   DATABASE_URL="your-url" npx prisma migrate deploy
   ```

### Issue: "Authentication not working"

**Cause:** Supabase URL/keys mismatch

**Fix:**
1. Verify all 5 Supabase variables are set correctly
2. Ensure `NEXT_PUBLIC_*` variables match non-public ones
3. Check Supabase Dashboard → Authentication → URL Configuration
4. Add your Vercel domain to Supabase allowed domains

### Issue: "Rate limiting not working"

**Cause:** Upstash Redis not connected

**Fix:**
- System will fallback to in-memory rate limiting (still works!)
- For production: Set up Upstash Redis for better rate limiting

---

## 📞 Need Help?

1. **Check Vercel Logs**: Dashboard → Functions → View logs
2. **Check Browser Console**: F12 → Console tab
3. **Check Network Tab**: F12 → Network tab (for API call errors)

---

## 🎉 You're Ready to Deploy!

Follow the steps in **DEPLOYMENT.md** for detailed instructions.

