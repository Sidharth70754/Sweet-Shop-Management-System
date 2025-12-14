# 🎯 Final Setup Steps - Get Your Website Working!

## ✅ Step 1: Create Database Tables (If Not Done)

1. Open: https://supabase.com/dashboard/project/bewaxbuupahsspnxfyyb/sql/new
2. Open file: `CREATE_TABLES.sql`
3. Copy ALL code and paste into SQL Editor
4. Click **Run**
5. Wait for "Success" message ✅

## ✅ Step 2: Add Sample Sweets Data (CRITICAL!)

**You MUST do this step or the database will be empty!**

### Option A: Using SQL (Recommended)
1. In Supabase SQL Editor, click **New query**
2. Open file: `ADD_SAMPLE_SWEETS.sql`
3. Copy ALL code and paste
4. Click **Run**
5. You should see "Success" with 20 rows inserted ✅

### Option B: Using Admin Page
1. **Sign up/Sign in** to your app
2. Make sure you're set as **admin** (see below)
3. Go to **Admin** page
4. Click **"Add Sample Sweets"** button
5. Wait for success message ✅

## ✅ Step 3: Make Yourself Admin (For Admin Features)

1. In Supabase Dashboard, go to **Table Editor**
2. Click on `user_roles` table
3. Find your user ID (or create a new row)
4. Set `user_id` = your user ID (from auth.users table)
5. Set `role` = `admin`
6. Save ✅

**OR use SQL:**
```sql
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
```

## ✅ Step 4: Verify Everything Works

1. **Refresh your browser** (or restart dev server: `npm run dev`)
2. **Sign in** to your account
3. **Go to Dashboard** (or click "Browse Sweets")
4. **You should see 20 sweets listed!** 🍬

## 🎯 Expected Behavior

✅ **Dashboard Page**: Shows all available sweets in a grid
✅ **Search & Filter**: Works to filter sweets
✅ **Buy Now Button**: Available on each sweet card (disabled if out of stock)
✅ **Purchase**: Click Buy Now → Select quantity → Confirm → Purchase recorded
✅ **My Purchases**: Shows all your purchase history
✅ **Admin Features**: Add, edit, delete, restock sweets (if admin)

## 🔍 Troubleshooting

### No Sweets Showing?
1. ✅ Check Table Editor - Does `sweets` table have data?
2. ✅ Are you signed in? (Authentication required)
3. ✅ Check browser console (F12) for errors
4. ✅ Click Refresh button on Dashboard

### Buy Now Button Not Working?
1. ✅ Make sure you're signed in
2. ✅ Check if sweet has quantity > 0
3. ✅ Check browser console for errors

### Can't Add Sweets as Admin?
1. ✅ Verify you're set as admin in `user_roles` table
2. ✅ Sign out and sign back in
3. ✅ Check browser console for permission errors

## 📋 Quick Checklist

- [ ] Tables created (CREATE_TABLES.sql run)
- [ ] Sample sweets added (ADD_SAMPLE_SWEETS.sql run OR Admin button clicked)
- [ ] User account created and signed in
- [ ] Admin role assigned (if you want admin features)
- [ ] Browser refreshed
- [ ] Sweets visible on Dashboard

## 🎉 After Setup

Your website should now have:
- ✅ Dashboard showing all sweets
- ✅ Working search and filters
- ✅ Buy Now buttons on each sweet
- ✅ Purchase functionality
- ✅ Purchase history tracking
- ✅ Admin management (if admin)

**Everything should be working perfectly!** 🚀

