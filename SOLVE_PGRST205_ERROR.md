# 🔧 Fix: "Could not find the table 'public.sweets'" (Error PGRST205)

## ❌ The Error
```
Could not find the table 'public.sweets' in the schema cache (Error code: PGRST205)
```

This means the `sweets` table doesn't exist in your database yet.

## ✅ Solution: Create the Tables

### Step-by-Step Fix (5 minutes)

#### Step 1: Open Supabase SQL Editor
1. Go to: **https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb/sql/new**
2. Or navigate: Dashboard → **SQL Editor** → **New query**

#### Step 2: Copy the SQL Script
1. Open the file: **`CREATE_TABLES.sql`** (in your project root)
2. Select **ALL** the code (Ctrl+A)
3. Copy it (Ctrl+C)

#### Step 3: Run the Migration
1. Paste the code into the SQL Editor (Ctrl+V)
2. Click the **Run** button (or press Ctrl+Enter)
3. Wait for the result - you should see: **"Success. No rows returned"**

#### Step 4: Verify Tables Were Created
1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should now see these tables:
   - ✅ `sweets` ← **This is the one you were missing!**
   - ✅ `profiles`
   - ✅ `user_roles`
   - ✅ `purchases`

#### Step 5: Refresh Your App
1. Go back to your app
2. Refresh the browser (F5)
3. Sign in (if not already signed in)
4. Navigate to Dashboard
5. **Sweets should now load!** 🎉

## 🚀 Quick Link to SQL Editor
**Click here**: https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb/sql/new

## 📋 What the Script Does
The `CREATE_TABLES.sql` script will:
1. ✅ Create all required tables (`sweets`, `profiles`, `user_roles`, `purchases`)
2. ✅ Set up Row Level Security (RLS) policies
3. ✅ Create functions and triggers for auto-updates
4. ✅ Create indexes for better performance

## 🔍 Verify It Worked

After running the script, check:

1. **In Supabase Dashboard**:
   - Go to **Table Editor**
   - You should see `sweets` table with columns: id, name, category, price, quantity, created_at, updated_at

2. **In Your App**:
   - Refresh the page
   - The error should be gone
   - Dashboard should load (even if empty - that's OK!)

## ⚠️ Important Notes

- **You only need to run this once** - the script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- **Make sure you're signed in** to your app after creating tables
- **If you're admin**, you can add sweets via the Admin page or "Add Sweet" button

## 🎯 After Tables Are Created

1. **Add Your First Sweet**:
   - Sign in as admin
   - Go to Admin page
   - Click "Add Sample Sweets" or manually add sweets

2. **Test the Dashboard**:
   - Navigate to Dashboard
   - You should see your sweets listed!

## ❓ Still Having Issues?

If you still see the error after running the script:

1. **Check the SQL Editor output** - make sure it says "Success"
2. **Verify tables exist** - go to Table Editor and check
3. **Check browser console** (F12) for any other errors
4. **Make sure you're signed in** - RLS requires authentication

## 📞 Need Help?

Check these files:
- `CREATE_TABLES.sql` - The SQL script to run
- `DATABASE_SETUP.md` - More detailed setup instructions
- `QUICK_FIX.md` - Quick troubleshooting guide

