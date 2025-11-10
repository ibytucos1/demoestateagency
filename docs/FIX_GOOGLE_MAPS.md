# Fix Google Maps API Key Authorization

## Problem
You're seeing this error:
```
Google Maps JavaScript API error: RefererNotAllowedMapError
Your site URL to be authorized: http://localhost:3005/search
```

## Solution
You need to authorize `localhost:3005` (or whichever port your dev server is using) in your Google Cloud Console.

### Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project

2. **Find Your API Key**
   - Look for the API key used in `NEXT_PUBLIC_MAPS_BROWSER_KEY`
   - Click on the key name to edit it

3. **Add Application Restrictions**
   - Under "Application restrictions", select **"HTTP referrers (websites)"**
   
4. **Add Authorized Referrers**
   Add these referrer patterns (adjust port to match yours):
   ```
   http://localhost:3005/*
   http://localhost:3000/*
   http://localhost:3001/*
   https://yourdomain.com/*
   https://*.vercel.app/*
   ```
   
   💡 **Tip**: Use `http://localhost:*/*` to allow all localhost ports (development only)

5. **Save Changes**
   - Click "Save" at the bottom
   - Wait 1-2 minutes for changes to propagate

6. **Refresh Your Browser**
   - Clear cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
   - Reload the search page

## Alternative: Temporary Unrestricted Access (Development Only)

If you just want to test quickly:

1. In Google Cloud Console, find your API key
2. Under "Application restrictions", select **"None"**
3. Click "Save"

⚠️ **Warning**: This makes your API key public. Only use for local testing, then add restrictions back!

## Verify It's Working

After fixing, you should see:
- A map with blue pins for each property
- No error message
- Clicking a pin shows property details

## Additional Notes

- The map uses Google Maps JavaScript API with the new `AdvancedMarkerElement`
- The `mapId: 'PROPERTY_MAP'` is required for advanced markers
- Map styling is controlled via Cloud Console when using mapId
- The map only shows on desktop (hidden on mobile)

