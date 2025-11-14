# 🗺️ Google Maps Setup Guide

## Quick Fix Checklist

Follow these steps to get your maps working:

### ✅ Step 1: Verify API Key Exists

Check your `.env.local` file has:
```bash
NEXT_PUBLIC_MAPS_BROWSER_KEY=your_api_key_here
```

### ✅ Step 2: Authorize Your Domain

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your API key (the one in `NEXT_PUBLIC_MAPS_BROWSER_KEY`)
3. Click on the key name to edit it
4. Under "Application restrictions", select **"HTTP referrers (websites)"**
5. Add these referrers:

```
http://localhost:*/*
http://127.0.0.1:*/*
https://yourdomain.com/*
https://*.vercel.app/*
```

6. Click **Save** and wait 1-2 minutes

### ✅ Step 3: Enable Required APIs

Make sure these APIs are enabled in your Google Cloud project:

1. **Maps JavaScript API** ✅ (Required)
2. **Places API** ✅ (For location search)
3. **Geocoding API** ✅ (For address lookup)

[Enable APIs here](https://console.cloud.google.com/apis/library)

### ✅ Step 4: Verify Coordinates

Your property listings need lat/lng coordinates. Check your database:

```sql
SELECT id, title, lat, lng FROM "Listing" WHERE lat IS NULL OR lng IS NULL;
```

If properties are missing coordinates, add them via the admin panel or API.

### ✅ Step 5: Test

1. Restart your dev server: `npm run dev`
2. Go to `/search?type=sale`
3. Check browser console (F12) for error messages
4. Look for the map in the right sidebar (desktop only)

---

## Common Errors & Solutions

### 🔴 "RefererNotAllowedMapError"
**Problem**: Your domain isn't authorized  
**Solution**: Add your domain to HTTP referrers (Step 2 above)

### 🔴 "InvalidKeyMapError"
**Problem**: API key is wrong or missing  
**Solution**: Check your `.env.local` file has the correct key

### 🔴 "ApiNotActivatedMapError"
**Problem**: Maps JavaScript API not enabled  
**Solution**: Enable it in Google Cloud Console

### 🟡 "No location data available"
**Problem**: Properties don't have coordinates  
**Solution**: Add lat/lng to your listings in the database

---

## Testing Your Setup

### Browser Console Check:
Open DevTools (F12) and look for:

✅ **Success:**
```
🗺️ Initializing map with 8 properties
✅ Map initialized successfully
```

❌ **Error:**
```
❌ Google Maps RefererNotAllowedMapError detected
```

### Visual Check:
- Map should show in right sidebar on `/search` page
- Blue pins should appear for each property
- Clicking pins shows property info popup

---

## Need More Help?

1. **Check Environment Variables:**
   ```bash
   echo $NEXT_PUBLIC_MAPS_BROWSER_KEY
   ```

2. **View Full Docs:**
   - [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
   - [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

3. **Project Files:**
   - Map Component: `components/property-map.tsx`
   - Search Page: `app/(public)/search/page.tsx`
   - Environment Config: `lib/env.ts`

---

## Pro Tips 💡

- Use `http://localhost:*/*` during development to support any port
- Add specific production domains for security
- Never commit your API key to git
- Consider using different keys for dev/production
- Monitor your API usage in Google Cloud Console

