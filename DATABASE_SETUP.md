# Database Setup Guide

## ⚠️ "Failed to fetch sweets" Error

This error usually means your database tables haven't been created yet. Follow these steps to set up your database.

## Step 1: Access Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb**
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

## Step 2: Run the Migration

1. Open the file: `supabase/migrations/20251212162315_0e088754-57c5-48b7-83e0-90406448364b.sql`
2. Copy **ALL** the SQL code from that file
3. Paste it into the SQL Editor in Supabase
4. Click **Run** (or press Ctrl+Enter)

## Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `sweets`
   - ✅ `profiles`
   - ✅ `user_roles`
   - ✅ `purchases`

## Step 4: Check RLS Policies

1. Go to **Authentication** → **Policies** in Supabase Dashboard
2. Make sure RLS (Row Level Security) is enabled
3. Verify policies exist for the `sweets` table

## Quick Copy-Paste Migration

If you need to copy the migration quickly, the main parts are:

1. **Create tables**: sweets, profiles, user_roles, purchases
2. **Enable RLS**: On all tables
3. **Create policies**: For authenticated users
4. **Create triggers**: For auto-creating profiles and updating timestamps

## Alternative: Use Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref bewaxbuupahsspnxfyyb

# Run migrations
supabase db push
```

## After Running Migrations

1. **Refresh your browser** (or restart your dev server)
2. **Sign in** to your account (or create one)
3. **Check the Dashboard** - sweets should load now

## Common Issues

### Issue: "relation does not exist"
- **Solution**: Run the migration SQL script

### Issue: "permission denied"
- **Solution**: Make sure you're signed in to the app
- Check that RLS policies are set up correctly

### Issue: "JWT expired" or "Invalid API key"
- **Solution**: Check your `.env` file has the correct API key
- Restart your dev server after updating `.env`

## Need Help?

1. Check browser console (F12) for detailed error messages
2. Verify your Supabase project is active
3. Ensure migrations ran successfully (check Table Editor)

## Next Steps After Setup

Once tables are created:
1. Sign up/Sign in to create your user account
2. Go to Admin page (if you're admin) to add sweets
3. Or manually add sweets through Supabase Table Editor

