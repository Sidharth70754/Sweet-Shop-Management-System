# 🚨 URGENT: Fix "Invalid API Key" Error

## Problem
Your API key is from project `iimfcjlmebeuwbxvgudd` but your URL is for `bewaxbuupahsspnxfyyb`. They MUST match!

## ✅ Quick Fix (3 Steps)

### Step 1: Get Your Correct API Key

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb/settings/api
   - (Direct link to API settings - if it doesn't work, follow Step 2 below)

2. **Or navigate manually**:
   - Go to https://supabase.com/dashboard
   - Click on project **bewaxbuupahsspnxfyyb**
   - Click **Settings** (⚙️ gear icon) → **API**
   - Scroll to **"Project API keys"**
   - Find **`anon` `public`** key
   - Click **📋 Copy**

### Step 2: Update Your .env File

**Method 1: Edit Manually**
1. Open `.env` file in your project root
2. Find this line:
   ```
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Replace everything after `=` with your NEW API key
4. Save the file

**Method 2: Use PowerShell** (After you have your new key)
```powershell
# Replace YOUR_NEW_KEY with the key you copied from Supabase
$newKey = "YOUR_NEW_KEY_HERE"
Set-Content -Path .env -Value @"
VITE_SUPABASE_URL=https://bewaxbuupahsspnxfyyb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=$newKey
"@
```

### Step 3: Restart Your Server
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

## ✅ Verify It Works

After restarting, open browser console (F12) and look for:
- ✅ "✅ Supabase client initialized"
- ✅ "✅ Supabase connection test successful"

If you still see errors, double-check:
1. The key you copied starts with `eyJ`
2. The key is very long (200+ characters)
3. You saved the .env file
4. You restarted the server

## 🔍 Your Current .env File

Currently has:
```
VITE_SUPABASE_URL=https://bewaxbuupahsspnxfyyb.supabase.co ✅ (Correct)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...iimfcjlmebeuwbxvgudd... ❌ (Wrong project!)
```

You need to replace the key with one from project: **bewaxbuupahsspnxfyyb**

## 🆘 Can't Access the Project?

If you don't have access to project `bewaxbuupahsspnxfyyb`:
1. Create a new Supabase project
2. Get its URL and API key
3. Update both in `.env`
4. Run database migrations from `supabase/migrations/` folder

