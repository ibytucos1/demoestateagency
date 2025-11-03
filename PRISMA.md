# Prisma Setup Notes

## Running Migrations

```bash
# Generate Prisma Client
pnpm db:generate

# Create and apply migration
pnpm db:migrate

# Or push schema directly (for development)
pnpm db:push
```

## Seed Data

The seed script creates:
- Two tenants: `acme` and `bluebird`
- 12-15 sample listings per tenant
- Sample property data with images from Unsplash

Run with:
```bash
pnpm db:seed
```

## Manual User Creation

After setting up Clerk authentication, create users in the database:

```sql
INSERT INTO "User" (id, "tenantId", email, "clerkId", role, name)
VALUES (
  'user-id',
  'acme-tenant-id',
  'admin@example.com',
  'clerk_user_xxx',
  'owner',
  'Admin User'
);
```

## Database Indexes

The schema includes optimized indexes:
- Composite indexes for common queries
- GIN index for array searches (features)
- Spatial indexes ready for PostGIS upgrade

