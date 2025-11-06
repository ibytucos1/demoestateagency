# UK Postcode Lookup Feature

## Overview

The valuation form includes UK postcode lookup functionality that allows users to:
1. Enter their postcode
2. Search for addresses at that postcode
3. Select their address from a dropdown
4. Auto-fill address fields (house number, street, city, county)

## Setup

### Using Google Places API (Default)

**Already Configured!** The postcode lookup uses your existing Google Places API key.

- Uses the same `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` as location search
- No additional setup required
- Works immediately
- Free tier: Generous limits with Google's $200 monthly credit

The feature is **ready to use** with your existing Google Places API configuration.

## How It Works

### User Flow

1. User enters postcode (e.g., "SW1A 1AA")
2. Clicks "Find Address" button
3. Dropdown shows all addresses at that postcode
4. User selects their address
5. Address fields auto-fill:
   - Address Line 1 (house number + street)
   - Address Line 2 (area/district)
   - Town/City
   - County
   - Postcode

### Fallback Behavior

- If postcode not found: Shows message + manual entry option
- If API rate limit reached: Error message + manual entry option
- Always allows manual entry as backup

## How It Works (Google Places API)

1. **Autocomplete Search**: Searches for addresses matching the postcode
2. **Place Details**: Gets full address components for each result
3. **Parse Components**: Extracts structured address data:
   - `street_number` + `route` → Address Line 1
   - `locality` / `postal_town` → Town/City
   - `administrative_area_level_2` → County
   - `postal_code` → Postcode

## Components

### `PostcodeLookup`

**Location:** `components/postcode-lookup.tsx`

**Props:**
- `onAddressSelect`: Callback when address is selected
- `initialPostcode`: Pre-fill postcode (from URL param)

**Usage:**
```tsx
<PostcodeLookup 
  onAddressSelect={(address) => {
    setAddressLine1(address.line_1)
    setCity(address.town_or_city)
    // ...
  }}
  initialPostcode={urlPostcode}
/>
```

### `lookupPostcode()`

**Location:** `lib/postcode-lookup.ts`

**Function:** Fetches addresses for a given postcode

**Usage:**
```ts
const addresses = await lookupPostcode('SW1A1AA')
// Returns: UKAddress[]
```

## Why Google Places API?

✅ **Already configured** - No additional setup
✅ **No extra cost** - Uses existing API key
✅ **Global coverage** - Works worldwide, not just UK
✅ **Generous limits** - Google's $200/month free credit
✅ **Maintained** - Google keeps data up to date
✅ **Reliable** - Enterprise-grade infrastructure

## Testing

### Test Postcodes

Use these UK postcodes for testing:
- `SW1A 1AA` - 10 Downing Street, London
- `W1A 1AA` - BBC Broadcasting House, London
- `EC1A 1BB` - Barbican Centre, London
- `UB1 1AB` - Southall addresses

### Local Development

```bash
# Add API key to .env.local
NEXT_PUBLIC_GETADDRESS_API_KEY=your_test_key

# Start dev server
npm run dev

# Test at: http://localhost:3000/valuation
```

## Troubleshooting

### "Postcode not found" error

**Possible causes:**
- Invalid postcode format
- Postcode doesn't exist in Google's database
- Very new developments

**Solution:** 
- Check postcode is valid UK format (e.g., "SW1A 1AA")
- Use manual entry fallback

### No results returned

**Possible causes:**
- Google Places API key not configured
- API rate limit reached (rare with free tier)

**Solution:** 
- Check `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` is set
- Monitor usage in Google Cloud Console
- Manual entry always available

## Cost Considerations

### Google Places API

**Free Tier:** $200/month credit = ~28,000 address lookups/month
- Autocomplete: $2.83 per 1000 requests
- Place Details: $17 per 1000 requests
- **Total per lookup:** ~$0.02 (2 cents)

**With $200 credit:** 
- ~10,000 lookups before any charges
- More than enough for most estate agencies

### Optimization Tips

1. **Limit results:** Only fetch details for first 10 addresses
2. **Manual fallback:** Always allow manual entry
3. **Monitor usage:** Check Google Cloud Console monthly

## Production Checklist

- [x] Google Places API key already configured
- [ ] Test with real UK postcodes (UB1 1BJ, SW1A 1AA, etc.)
- [x] Manual entry fallback implemented
- [ ] Monitor API usage in Google Cloud Console
- [ ] Set up billing alerts in Google Cloud (optional)

## Privacy & GDPR

- Google Places API only receives postcodes for search
- No personal data sent to Google
- Full addresses stored in your database only
- Compliant with GDPR
- See Google Privacy Policy: https://policies.google.com/privacy

