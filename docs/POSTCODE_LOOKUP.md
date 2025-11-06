# UK Postcode Lookup Feature

## Overview

The valuation form includes UK postcode lookup functionality that allows users to:
1. Enter their postcode
2. Search for addresses at that postcode
3. Select their address from a dropdown
4. Auto-fill address fields (house number, street, city, county)

## Setup

### Option 1: getaddress.io (Recommended)

**Free Tier:** 10 lookups/day (suitable for testing)
**Paid Plans:** Starting from £5/month for 500 lookups

1. Sign up at [https://getaddress.io/](https://getaddress.io/)
2. Get your API key from the dashboard
3. Add to your `.env.local`:
   ```
   NEXT_PUBLIC_GETADDRESS_API_KEY=your_api_key_here
   ```

### Option 2: Manual Entry Only

If you don't add the API key, the form will work in manual entry mode:
- Users can still type their address manually
- No postcode lookup dropdown will appear

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

- If API key is missing: Manual entry only
- If postcode not found: Error message + manual entry option
- If API rate limit reached: Error message + manual entry option

## API Response Format

getaddress.io returns addresses in this format:

```json
{
  "addresses": [
    {
      "line_1": "10 Downing Street",
      "line_2": "",
      "line_3": "",
      "town_or_city": "London",
      "county": "Greater London",
      "postcode": "SW1A 1AA",
      "formatted_address": ["10 Downing Street", "London", "SW1A 1AA"]
    }
  ]
}
```

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

## Alternative APIs

If you prefer a different service, you can modify `lib/postcode-lookup.ts`:

### Postcodes.io (Free, but limited data)
- API: `https://api.postcodes.io/postcodes/{postcode}`
- Provides coordinates but not full addresses
- Good for validation only

### Ideal Postcodes
- API: `https://api.ideal-postcodes.co.uk/`
- Paid only, but very comprehensive
- Includes PAF (Postcode Address File) data

### Loqate
- API: `https://api.addressy.com/`
- Enterprise-grade
- Used by many UK businesses

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

### "No API key configured" warning

**Solution:** Add `NEXT_PUBLIC_GETADDRESS_API_KEY` to `.env.local`

### "Postcode not found" error

**Possible causes:**
- Invalid postcode format
- Postcode doesn't exist
- API key invalid

**Solution:** Check postcode is valid UK format (e.g., "SW1A 1AA")

### Rate limit exceeded

**Solution:** 
- Upgrade getaddress.io plan
- Or use manual entry for testing

## Cost Considerations

### getaddress.io Pricing

- **Free:** 10 lookups/day
- **Starter:** £5/month for 500 lookups
- **Growth:** £10/month for 1,500 lookups
- **Pro:** £20/month for 5,000 lookups

### Optimization Tips

1. **Cache results:** Store recently looked-up postcodes
2. **Validate first:** Check postcode format before API call
3. **Debounce:** Wait for user to finish typing
4. **Manual fallback:** Always allow manual entry

## Production Checklist

- [ ] Add `NEXT_PUBLIC_GETADDRESS_API_KEY` to Vercel environment variables
- [ ] Test with real UK postcodes
- [ ] Verify manual entry fallback works
- [ ] Monitor API usage in getaddress.io dashboard
- [ ] Set up usage alerts if approaching limits

## Privacy & GDPR

- Postcode lookup API only receives postcodes, not personal data
- Full addresses are stored in your database (not sent to getaddress.io)
- See getaddress.io privacy policy: https://getaddress.io/Privacy

