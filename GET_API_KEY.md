# 🔑 How to Get Your Correct Supabase API Key

## ⚠️ You're Getting "Invalid API Key" Error

This happens because your API key doesn't match your project URL.

## 📋 Quick Steps (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Log in with your account

### Step 2: Find Your Project
1. Look for project with URL ending in: **bewaxbuupahsspnxfyyb**
2. Click on that project

### Step 3: Get Your API Key
1. In the left sidebar, click **⚙️ Settings**
2. Click **🔌 API** (under Settings)
3. Scroll down to **"Project API keys"** section
4. Find the **`anon` `public`** key
5. Click the **copy** button (📋) next to it

### Step 4: Update Your .env File

**Option A: Manual Edit**
1. Open `.env` file in your project root folder
2. Replace the value after `VITE_SUPABASE_PUBLISHABLE_KEY=`
3. Paste your new API key
4. Save the file

**Option B: Use PowerShell Command** (Windows)
```powershell
# First, get your new API key from Supabase dashboard
# Then run this command (replace YOUR_NEW_KEY with your actual key):
$newKey = "YOUR_NEW_KEY_HERE"
$envContent = "VITE_SUPABASE_URL=https://bewaxbuupahsspnxfyyb.supabase.co`nVITE_SUPABASE_PUBLISHABLE_KEY=$newKey"
Set-Content -Path .env -Value $envContent
```

### Step 5: Restart Your Server
1. Stop your dev server (Press `Ctrl+C`)
2. Start it again: `npm run dev`
3. Check the browser console (F12) - you should see:
   - ✅ "Supabase client initialized"
   - ✅ "Supabase connection test successful"

## 🔍 How to Verify Your Key is Correct

Your API key should:
- ✅ Start with `eyJ` (it's a JWT token)
- ✅ Be very long (200+ characters)
- ✅ Come from the project: **bewaxbuupahsspnxfyyb**

## 📸 Visual Guide

When you're in Supabase Dashboard:
```
Settings (⚙️)
  └── API (🔌)
      └── Project API keys
          └── anon public [📋 Copy button here]
```

## ❓ Still Having Issues?

If you can't find your API key:
1. Make sure you're logged into the correct Supabase account
2. Verify the project URL shows: `bewaxbuupahsspnxfyyb.supabase.co`
3. Check that you have access to the project (not just viewing)
4. The `anon` key is different from the `service_role` key - make sure you're copying the `anon public` one

## 🆘 Need to Create a New Project?

If you don't see the project `bewaxbuupahsspnxfyyb`:
1. Create a new project in Supabase
2. Use the new project's URL and API key
3. Run your database migrations (SQL files in `supabase/migrations/` folder)

