# Database Migration Required

## New Listing Fields Added

The following fields have been added to the `Listing` model:

- `addressLine2` (String?) - Optional second line of address
- `state` (String?) - Optional state, county, or region
- `country` (String?) - Optional country (defaults to "United Kingdom")

## Migration Status

✅ **Schema Updated**: `prisma/schema.prisma` has been updated
✅ **Migration Created**: `prisma/migrations/20251114000000_add_listing_location_fields/migration.sql`
⚠️ **Pending**: Migration needs to be applied to database

## How to Apply Migration

### Option 1: Apply via Prisma Migrate Deploy (Production)
```bash
npx prisma migrate deploy
```

### Option 2: Apply via Direct SQL (if migrate deploy fails)
Run this SQL directly on your Supabase database:

```sql
-- Add new location fields to Listing table
ALTER TABLE "Listing" 
  ADD COLUMN "addressLine2" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "country" TEXT DEFAULT 'United Kingdom';
```

### Option 3: Reset and Apply All Migrations (Development Only)
⚠️ **WARNING: This will delete all data**
```bash
npx prisma migrate reset
npx prisma db seed
```

## After Migration

1. Generate Prisma Client (already done):
   ```bash
   npx prisma generate
   ```

2. Restart your development server

## What Was Updated

### 1. Database Schema (`prisma/schema.prisma`)
- Added `addressLine2`, `state`, `country` fields to Listing model

### 2. Listing Editor Form (`components/listing-editor.tsx`)
- Added `squareFeet` input field (3-column grid with bedrooms/bathrooms)
- Added `addressLine2` input field
- Added `state` input field (State / County / Region)
- Added `country` input field
- Improved form layout and mobile responsiveness
- Added helpful placeholders for all fields

### 3. API Routes
- **POST `/api/listings`**: Now accepts and validates new fields
- **PATCH `/api/listings/[id]`**: Now accepts and validates new fields
- Geocoding includes all address fields for better accuracy

## Testing Checklist

Once migration is applied:

- [ ] Create a new listing with all fields filled
- [ ] Verify square feet displays correctly
- [ ] Verify full address (including addressLine2, state, country) saves
- [ ] Edit an existing listing and add new fields
- [ ] Check listing detail page displays new fields
- [ ] Verify geocoding still works correctly
- [ ] Test mobile responsiveness of form

## Notes

- All new location fields are optional to maintain backward compatibility
- Existing listings will have NULL values for new fields
- Default country is "United Kingdom" for new listings
- Form includes helpful placeholders for better UX

