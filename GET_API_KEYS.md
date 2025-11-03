# How to Get Your API Keys

This guide walks you through getting all the required API keys for the real estate platform.

## Required Services

### 1. Supabase (Database + Storage) ⭐ **START HERE**

**Why:** Database and file storage for your app

**Steps:**
1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name:** demoestateagency (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - Click **"Create new project"** (takes 2-3 minutes)
4. Once created, go to **Settings** → **API**
5. Copy these values to your `.env` file:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)
6. Go to **Settings** → **Database** → **Connection string**
   - Select **"URI"** tab
   - Copy the connection string → `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your database password

**Also create storage bucket:**
1. Go to **Storage** in the left menu
2. Click **"New bucket"**
3. Name it: `media`
4. Make it **Public**
5. Click **"Create bucket"**

---

### 2. Clerk (Authentication) 🔐

**Why:** User authentication and login system

**Steps:**
1. Go to [https://clerk.com](https://clerk.com) and sign up/login
2. Click **"Create Application"**
3. Choose:
   - **Name:** demoestateagency
   - **Authentication options:** Email (or Email + Google)
   - Click **"Create Application"**
4. Once created, you'll see **API Keys** section
5. Copy these to your `.env` file:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - **Secret Key** → `CLERK_SECRET_KEY` (starts with `sk_test_`)

**Free tier:** 10,000 monthly active users

---

### 3. Resend (Email) 📧

**Why:** Send email notifications when leads are submitted

**Steps:**
1. Go to [https://resend.com](https://resend.com) and sign up/login
2. Click **"Create API Key"**
3. Name it: "demoestateagency"
4. Copy the API key → `RESEND_API_KEY` (starts with `re_`)
5. Optional: Add your email addresses:
   - `RESEND_FROM_EMAIL` = "noreply@yourdomain.com" (or use default)
   - `RESEND_TO_EMAIL` = "your-email@example.com" (where leads go)

**Free tier:** 3,000 emails/month, 100 emails/day

---

### 4. Google Cloud (Maps & Places API) 🗺️

**Why:** Address autocomplete and geocoding for property listings

**Steps:**

#### A. Create Google Cloud Project
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name: "demoestateagency"
4. Click **"Create"**

#### B. Enable APIs
1. Go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

#### C. Create Browser API Key (for Maps)
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Click the key to edit it
4. **Name:** "Maps Browser Key"
5. **Application restrictions:** 
   - Select **"HTTP referrers"**
   - Add: `http://localhost:3000/*` (for development)
   - Add: `https://yourdomain.com/*` (for production later)
6. **API restrictions:** 
   - Select **"Restrict key"**
   - Choose: **Maps JavaScript API** only
7. Copy the key → `NEXT_PUBLIC_MAPS_BROWSER_KEY` (starts with `AIza`)

#### D. Create Server API Key (for Places/Geocoding)
1. Click **"Create Credentials"** → **"API Key"** again
2. Click the key to edit it
3. **Name:** "Places Server Key"
4. **Application restrictions:**
   - Select **"IP addresses"**
   - Add: `0.0.0.0/0` (for development - **⚠️ restrict in production**)
5. **API restrictions:**
   - Select **"Restrict key"**
   - Choose: **Places API** and **Geocoding API**
6. Copy the key → `PLACES_SERVER_KEY` (starts with `AIza`)

**Important:** Set up billing (free tier: $200/month credit, usually enough for development)

---

## Optional Services (Skip for now if you want)

### 5. Upstash Redis (Caching) - OPTIONAL
- Go to [https://upstash.com](https://upstash.com)
- Create free Redis database
- Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- **Note:** App works without this (uses in-memory cache)

### 6. Cloudflare Turnstile (Spam Protection) - OPTIONAL
- Go to [https://www.cloudflare.com/products/turnstile/](https://www.cloudflare.com/products/turnstile/)
- Create free site
- Copy `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- **Note:** Forms work without this, just no spam protection

### 7. Sentry (Error Monitoring) - OPTIONAL
- Go to [https://sentry.io](https://sentry.io)
- Create free project
- Copy `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN`
- **Note:** App works without this

### 8. Plausible Analytics - OPTIONAL
- Go to [https://plausible.io](https://plausible.io)
- Add your domain
- Copy domain to `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- **Note:** App works without this

### 9. Inngest (Background Jobs) - OPTIONAL
- Go to [https://www.inngest.com](https://www.inngest.com)
- Create free app
- Copy `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`
- **Note:** App works without this

---

## Quick Checklist

Once you have your keys, update your `.env` file:

- [ ] `DATABASE_URL` - from Supabase Database settings
- [ ] `SUPABASE_URL` - from Supabase API settings
- [ ] `SUPABASE_ANON_KEY` - from Supabase API settings
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - from Supabase API settings
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - from Clerk dashboard
- [ ] `CLERK_SECRET_KEY` - from Clerk dashboard
- [ ] `RESEND_API_KEY` - from Resend dashboard
- [ ] `NEXT_PUBLIC_MAPS_BROWSER_KEY` - from Google Cloud Console
- [ ] `PLACES_SERVER_KEY` - from Google Cloud Console

---

## After Getting Keys

1. **Update your `.env` file** with real values
2. **Run database migrations:**
   ```bash
   pnpm db:migrate
   ```
3. **Seed the database:**
   ```bash
   pnpm db:seed
   ```
4. **Start the dev server:**
   ```bash
   pnpm dev
   ```

---

## Cost Estimates (Free Tiers)

- **Supabase:** Free tier (500MB database, 1GB storage)
- **Clerk:** Free tier (10,000 MAU)
- **Resend:** Free tier (3,000 emails/month)
- **Google Cloud:** $200/month free credit (usually enough for development)
- **All optional services:** Have free tiers

**Total cost for development: $0** (if you stay within free tiers)

---

## Need Help?

If you get stuck on any step, let me know which service you're on and I'll help you through it!

