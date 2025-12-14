# 🚀 Quick Fix for "Failed to fetch sweets"

## Most Common Cause: Database Tables Don't Exist

Your database tables need to be created first. Here's the fastest way to fix it:

## ✅ Solution (5 minutes)

### Step 1: Open Supabase SQL Editor
Click this link: **https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb/sql/new**

### Step 2: Copy the Migration SQL
1. Open file: `supabase/migrations/20251212162315_0e088754-57c5-48b7-83e0-90406448364b.sql`
2. Select ALL the code (Ctrl+A)
3. Copy it (Ctrl+C)

### Step 3: Run in SQL Editor
1. Paste into the SQL Editor (Ctrl+V)
2. Click **Run** button (or press Ctrl+Enter)
3. Wait for "Success. No rows returned" message

### Step 4: Verify
1. Click **Table Editor** in Supabase Dashboard
2. You should see: `sweets`, `profiles`, `user_roles`, `purchases` tables

### Step 5: Refresh Your App
1. Refresh your browser
2. Sign in (if not already)
3. Check Dashboard - sweets should load!

## 🔍 Check What Error You're Getting

Open browser console (F12) and look for:

- ❌ **"relation does not exist"** → Tables not created (run migration)
- ❌ **"permission denied"** → Not signed in OR RLS policies issue
- ❌ **"Invalid API key"** → Wrong API key in .env file
- ❌ **"JWT expired"** → API key issue

## 📋 Need the SQL File Location?

The migration file is at:
```
supabase/migrations/20251212162315_0e088754-57c5-48b7-83e0-90406448364b.sql
```

## ⚡ Quick Test

After running migration, test in Supabase Dashboard:
1. Go to **Table Editor**
2. Click on `sweets` table
3. Try to insert a test row (if you're admin)
4. Or just verify the table exists

## 🎯 After Setup Works

1. **Create your first sweet** (as admin)
2. Or use the "Add Sample Sweets" button on Admin page
3. Refresh Dashboard to see your sweets!

