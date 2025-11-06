# Google Console HTTP Referrers Setup Guide

## 🎯 Quick Setup - Copy & Paste

### Step 1: Get Your Vercel Domain

After deploying to Vercel, you'll get a URL like:
- `https://your-project-name.vercel.app`

### Step 2: Configure Browser API Key

In Google Cloud Console → APIs & Services → Credentials → Edit API Key:

#### Add These HTTP Referrers:

```
# Local Development
http://localhost:3000/*
http://localhost:*

# Vercel Deployment (Replace 'your-project-name' with your actual project name)
https://your-project-name.vercel.app/*
https://your-project-name-*.vercel.app/*

# All Vercel preview deployments
https://*.vercel.app/*

# Your custom domain (if you have one)
https://yourdomain.com/*
https://www.yourdomain.com/*
```

**Important:** The `/*` at the end is required!

---

## 📋 Complete Step-by-Step

### 1. Open Google Cloud Console
Go to: https://console.cloud.google.com/apis/credentials

### 2. Find Your Browser API Key
Look for the key you're using for `NEXT_PUBLIC_MAPS_BROWSER_KEY`

### 3. Click "Edit" (Pencil Icon)

### 4. Set Application Restrictions
- **Application restrictions** section
- Select: ⦿ **HTTP referrers (websites)**
- Click **+ ADD AN ITEM**

### 5. Add Each Referrer (One Per Line)

**For Development:**
```
http://localhost:3000/*
```
Click **+ ADD AN ITEM**

```
http://localhost:*
```
Click **+ ADD AN ITEM**

**For Production (Vercel):**
```
https://your-actual-project-name.vercel.app/*
```
Click **+ ADD AN ITEM**

```
https://your-actual-project-name-*.vercel.app/*
```
Click **+ ADD AN ITEM**

```
https://*.vercel.app/*
```

**If using custom domain:**
Click **+ ADD AN ITEM**
```
https://yourdomain.com/*
```

### 6. Set API Restrictions
- **API restrictions** section
- Select: ⦿ **Restrict key**
- Check these boxes:
  - ☑️ **Maps JavaScript API**
  - ☑️ **Places API**

### 7. Save
Click the blue **SAVE** button at the bottom

**⏰ Wait 5 minutes** for changes to propagate across Google's servers

---

## 🔄 After Each Vercel Deployment

When you deploy or get a new preview URL, add it to the referrers list:

1. Find the new URL (e.g., `https://my-app-git-feature-branch.vercel.app`)
2. Go back to Google Console
3. Click **Edit** on your browser key
4. Click **+ ADD AN ITEM** under HTTP referrers
5. Paste the new URL with `/*` at the end
6. Click **SAVE**

---

## ✅ How to Test if It's Working

### Test 1: Check Console for Errors

1. Open your deployed site
2. Press F12 (open Developer Tools)
3. Go to **Console** tab
4. Look for errors starting with "Google Maps"

**✅ Good:** No Google Maps errors
**❌ Bad:** "This page can't load Google Maps correctly"

### Test 2: Check if Maps Load

1. Go to a page with a map (e.g., property detail page)
2. Map should load and display properly

**✅ Good:** Map displays with pins
**❌ Bad:** Gray box or error message

### Test 3: Check Location Autocomplete

1. Go to property creation or search page
2. Start typing an address
3. Should see autocomplete suggestions

**✅ Good:** Dropdown appears with suggestions
**❌ Bad:** No dropdown or error message

---

## 🐛 Troubleshooting

### Error: "This API key is not authorized to use this service or API"

**Problem:** HTTP referrer doesn't match or APIs not enabled

**Solution:**
1. Double-check your referrer matches EXACTLY: `https://your-domain.com/*`
2. Ensure the `/*` is at the end
3. Wait 5 minutes after saving
4. Clear browser cache (Ctrl+Shift+Delete)
5. Verify Maps JavaScript API and Places API are **enabled** in Google Console

### Error: "RefererNotAllowedMapError"

**Problem:** Your domain is not in the allowed referrers list

**Solution:**
1. Check the current URL in your browser address bar
2. Add that EXACT domain to the referrers (with `/*` at end)
3. Example: If URL is `https://my-app-abc123.vercel.app/properties`
   Add: `https://my-app-abc123.vercel.app/*`

### Maps Work Locally But Not on Vercel

**Problem:** Forgot to add Vercel domain to referrers

**Solution:**
1. Get your Vercel URL from deployment
2. Add to Google Console referrers
3. Pattern: `https://your-project-name.vercel.app/*`

### Autocomplete Works But Maps Don't Load

**Problem:** Different API key for Maps vs Places, or missing API restriction

**Solution:**
1. Ensure you're using the SAME key for both
2. Verify both APIs are checked in "API restrictions"
3. Check that `NEXT_PUBLIC_MAPS_BROWSER_KEY` is set in Vercel

---

## 📸 Visual Guide

### What the Google Console Should Look Like:

```
┌─────────────────────────────────────────────────────┐
│  Application restrictions                            │
│  ⦿ HTTP referrers (websites)                        │
│                                                      │
│  [1] http://localhost:3000/*                   [×]  │
│  [2] http://localhost:*                        [×]  │
│  [3] https://your-app.vercel.app/*            [×]  │
│  [4] https://*.vercel.app/*                   [×]  │
│  [5] https://yourdomain.com/*                 [×]  │
│                                                      │
│  [+ ADD AN ITEM]                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  API restrictions                                    │
│  ⦿ Restrict key                                     │
│                                                      │
│  ☑ Maps JavaScript API                              │
│  ☑ Places API                                       │
│  ☐ Directions API                                   │
│  ☐ Distance Matrix API                              │
│  ... (other APIs unchecked)                         │
└─────────────────────────────────────────────────────┘

                    [SAVE]
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Always use HTTP referrers for browser keys
- Restrict to specific APIs (Maps, Places only)
- Use separate keys for browser and server
- Monitor API usage in Google Console
- Set up billing alerts

### ❌ DON'T:
- Don't use the same key for browser and server
- Don't leave "None" for application restrictions
- Don't allow all APIs (security risk)
- Don't commit API keys to git (they're in .env)
- Don't share keys publicly

---

## 💰 Cost Management

Google Maps has a **$200/month free tier**:
- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

**Free tier covers:**
- ~28,500 map loads/month
- ~11,700 place searches/month
- ~40,000 geocoding requests/month

**To avoid charges:**
1. Enable billing with a credit card (required for API access)
2. Set billing alerts at $50, $100, $150
3. Monitor usage in Google Console

---

## 📝 Checklist

Before going live:

- [ ] Browser API key created
- [ ] Server API key created  
- [ ] Both keys restricted properly
- [ ] HTTP referrers include localhost
- [ ] HTTP referrers include Vercel domain
- [ ] Maps JavaScript API enabled
- [ ] Places API enabled
- [ ] Geocoding API enabled
- [ ] Keys added to Vercel env vars
- [ ] Tested on localhost
- [ ] Tested on Vercel deployment
- [ ] Maps load correctly
- [ ] Autocomplete works
- [ ] Billing enabled with alerts

---

## 🎉 Done!

Your Google Maps and Places API are now properly configured for Vercel!

**Remember:** Add new domains to referrers whenever you:
- Deploy to a new Vercel preview
- Add a custom domain
- Create a new environment

