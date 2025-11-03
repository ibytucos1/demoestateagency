# Setup Guide

This guide walks you through getting the real estate platform running on your local machine.

## Prerequisites

Before you begin, make sure you have:
- **Node.js 20+** installed ([download](https://nodejs.org/))
- **pnpm** installed (`npm install -g pnpm`)
- Accounts for required services (see below)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
pnpm install
```

This downloads all the npm packages the project needs (Next.js, Prisma, UI components, etc.).

---

### Step 2: Set Up Environment Variables

Create a file named `.env.local` in the project root directory. This file stores your API keys and configuration (it's gitignored, so it won't be committed).

**Copy this template and fill in your actual values:**

```env
# Database - REQUIRED
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Clerk Auth - REQUIRED
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Resend Email - REQUIRED
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_TO_EMAIL="admin@yourdomain.com"

# Supabase - REQUIRED
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Google APIs - REQUIRED
NEXT_PUBLIC_MAPS_BROWSER_KEY="AIza..."
PLACES_SERVER_KEY="AIza..."

# Upstash Redis (OPTIONAL - will use in-memory cache if not set)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Cloudflare Turnstile (OPTIONAL - forms work without it)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAA..."
TURNSTILE_SECRET_KEY="0x4AAAA..."

# Sentry (OPTIONAL - error monitoring)
NEXT_PUBLIC_SENTRY_DSN="https://...@..."
SENTRY_DSN="https://...@..."

# Plausible Analytics (OPTIONAL)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"

# Inngest (OPTIONAL - background jobs)
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Where to get these values:**
- **DATABASE_URL**: From your Supabase project settings
- **Clerk keys**: From [Clerk Dashboard](https://dashboard.clerk.com)
- **Resend**: From [Resend Dashboard](https://resend.com/api-keys)
- **Supabase**: From your Supabase project settings
- **Google APIs**: From [Google Cloud Console](https://console.cloud.google.com)

---

### Step 3: Set Up the Database

First, generate the Prisma client:
```bash
pnpm db:generate
```

Then, create the database tables:
```bash
pnpm db:migrate
```

This creates all the tables (Tenant, User, Listing, Lead) in your database.

---

### Step 4: Seed the Database

```bash
pnpm db:seed
```

This creates:
- Two demo tenants: "ACME Real Estate" and "Bluebird Properties"
- Sample property listings for each tenant (12-15 listings each)
- Uses Unsplash images for demo data

**Note:** Users are not created by seed script - you'll need to create them via Clerk first, then sync to the database (see README.md).

---

### Step 5: Start the Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000** in your browser.

You should see:
- The home page with featured listings
- Ability to search properties
- View listing details
- Switch tenants via `?tenant=acme` or `?tenant=bluebird` in the URL

---

## What Each Command Does

- `pnpm install` - Downloads all dependencies from package.json
- `pnpm db:generate` - Generates Prisma client from schema
- `pnpm db:migrate` - Creates/updates database tables
- `pnpm db:seed` - Adds demo data to database
- `pnpm dev` - Starts Next.js development server on port 3000

## Troubleshooting

**"Missing environment variables" error:**
- Make sure `.env.local` exists in the project root
- Check that all REQUIRED variables are filled in

**Database connection errors:**
- Verify your `DATABASE_URL` is correct
- Make sure your Supabase project is active
- Check network/firewall settings

**"Module not found" errors:**
- Run `pnpm install` again
- Delete `node_modules` and `.next` folders, then `pnpm install`

## Ready to Deploy?

Once everything works locally, see the **Deployment Checklist** section in `README.md` for production setup instructions.

