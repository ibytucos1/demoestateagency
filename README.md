# Real Estate Demo Platform

Production-lite real estate platform built with Next.js, featuring multi-tenant support, comprehensive search, admin dashboard, and integrated services.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Tailwind CSS, shadcn/ui, Lucide React
- **Database**: Supabase Postgres with Prisma
- **Storage**: Supabase Storage (swappable to S3)
- **Auth**: Clerk
- **Email**: Resend
- **Search**: Postgres queries (Typesense/Algolia adapters ready)
- **Caching/Rate Limiting**: Upstash Redis
- **Error Monitoring**: Sentry
- **Analytics**: Plausible
- **Forms**: Cloudflare Turnstile
- **Background Jobs**: Inngest
- **Maps**: Google Maps/Places APIs

## Quick Start

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Supabase account
- Clerk account
- Resend account
- Google Cloud account (for Maps/Places)

### Quick Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local file (see Environment Variables section below)

# 3. Generate Prisma client
pnpm db:generate

# 4. Run database migrations
pnpm db:migrate

# 5. Seed database with demo data
pnpm db:seed

# 6. Start development server
pnpm dev
```

Visit http://localhost:3000

### Environment Variables

**Note:** Create `.env.local` manually in the project root (this file is gitignored). Copy the template below:

Create `.env.local` with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Resend Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_TO_EMAIL="admin@yourdomain.com"

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Google APIs
NEXT_PUBLIC_MAPS_BROWSER_KEY="AIza..." # Browser key (referrer-locked)
PLACES_SERVER_KEY="AIza..." # Server key (IP-locked)

# Upstash Redis (optional)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Cloudflare Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TURNSTILE_SECRET_KEY="..."

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN="https://...@..." # Client-side DSN
SENTRY_DSN="https://...@..." # Server-side DSN (same value)
SENTRY_AUTH_TOKEN="..."

# Plausible (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"

# Inngest (optional)
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database with demo data
pnpm db:seed
```

### Development

```bash
# Start dev server
pnpm dev
```

Visit http://localhost:3000

## Features

### Multi-Tenant Architecture

- Tenant isolation via `tenant_id` column
- Demo supports switching via `?tenant=acme|bluebird`
- Production-ready for one DB per client

### Public Pages

- **Home**: Hero section, featured listings
- **Search**: Advanced filters (price, beds, type, city, radius), keyset pagination
- **Listing Detail**: Gallery, key facts, enquiry form, JSON-LD SEO

### Admin Dashboard

- **Listings**: CRUD operations, bulk actions, status management
- **Leads**: Inbox, CSV export
- **Settings**: Tenant configuration

### APIs

- `/api/listings` - CRUD for listings (auth required)
- `/api/leads` - Create leads, send email notifications
- `/api/places` - Google Places proxy with rate limiting
- `/api/inngest` - Background job webhook

### SEO

- Dynamic sitemap per tenant
- robots.txt
- JSON-LD structured data
- OG image generation

### Background Jobs (Inngest)

- Nightly sitemap rebuild
- Weekly leads digest email
- Listing reindex stub (for Typesense/Algolia)

## Deployment Checklist

### 1. Supabase Setup

- [ ] Create new Supabase project
- [ ] Copy `DATABASE_URL` and keys to Vercel envs
- [ ] Run migrations: `pnpm db:migrate` (or use Supabase SQL editor)
- [ ] Create storage bucket named `media`
  ```sql
  -- In Supabase SQL editor
  INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
  ```
- [ ] Set bucket policies for public read access
- [ ] Enable backups in Supabase dashboard

### 2. Google Cloud Setup

- [ ] Create Google Cloud project
- [ ] Enable Maps JavaScript API and Places API
- [ ] Create **Browser API Key**:
  - Restrict to HTTP referrers: `yourdomain.com/*`
  - Enable Maps JavaScript API
  - Use in `NEXT_PUBLIC_MAPS_BROWSER_KEY`
- [ ] Create **Server API Key**:
  - Restrict to IP addresses (Vercel IP ranges)
  - Enable Places API, Geocoding API
  - Use in `PLACES_SERVER_KEY`
- [ ] Set up billing alerts and budgets

### 3. Vercel Deployment

- [ ] Create new Vercel project
- [ ] Connect GitHub repository
- [ ] Set all environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Connect custom domain
- [ ] Update Google API key referrer restrictions with new domain

### 4. Additional Services

- [ ] **Clerk**: Create application, add redirect URLs
- [ ] **Resend**: Create API key, verify domain
- [ ] **Upstash**: Create Redis database (optional, falls back to memory)
- [ ] **Cloudflare Turnstile**: Create site (optional)
- [ ] **Sentry**: Create project, add DSN
- [ ] **Plausible**: Add site domain
- [ ] **Inngest**: Create app, get keys (optional)

### 5. Post-Deployment

- [ ] Run seed script on production DB (or create tenants manually)
- [ ] Create admin users via Clerk, then sync to database:
  ```sql
  INSERT INTO "User" (id, "tenantId", email, role, "clerkId")
  VALUES ('user-id', 'tenant-id', 'admin@example.com', 'owner', 'clerk-user-id');
  ```
- [ ] Test search functionality
- [ ] Test lead form submission
- [ ] Verify email notifications
- [ ] Test admin dashboard access

## Project Structure

```
├── app/
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Home
│   │   ├── search/        # Search page
│   │   └── listing/[slug] # Listing detail
│   ├── (admin)/           # Admin pages (protected)
│   │   └── admin/
│   ├── api/               # API routes
│   │   ├── listings/      # CRUD handlers
│   │   ├── leads/         # Lead creation
│   │   ├── places/        # Google Places proxy
│   │   └── inngest/       # Background jobs
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── listing-card.tsx
│   ├── search-filters.tsx
│   └── lead-form.tsx
├── lib/
│   ├── db.ts              # Prisma client
│   ├── env.ts             # Zod-validated env
│   ├── storage.ts          # StorageService
│   ├── email.ts            # EmailService
│   ├── places.ts           # PlacesService
│   ├── search.ts           # SearchService interface + DB adapter
│   ├── redis.ts            # Upstash/memory cache
│   ├── ratelimit.ts        # Rate limiters
│   ├── rbac.ts             # Role-based access
│   └── tenant.ts           # Tenant utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── inngest/
│   ├── client.ts
│   └── functions.ts        # Background jobs
└── middleware.ts           # Tenant detection + auth
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Database Indexes

The Prisma schema includes indexes for optimal query performance:

- `(tenantId, status, type)` - Filtering
- `(tenantId, city, status)` - City search
- `(tenantId, createdAt)` - Pagination
- `(tenantId, lat, lng)` - Location search
- `GIN(tenantId, features)` - Feature tags

For production with high volume, consider PostGIS for advanced geospatial queries.

## Search Service Architecture

- `ISearchService` interface for swappable adapters
- `DBSearchService` - Postgres implementation (current)
- `TypesenseAdapter` - Stub for future Typesense integration

## License

MIT

