# 🗄️ Supabase Database Setup Guide

This guide will walk you through setting up your Supabase database for FitMind AI.

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com) if you don't have one)
2. A Supabase project created
3. Your Supabase project URL and anon key (found in Project Settings → API)

---

## 🚀 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"** button

### Step 2: Run the Database Setup Script

1. Open the file `SUPABASE_SETUP.sql` in this project
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 3: Verify Tables Were Created

After running the script, verify the tables were created:

1. Go to **"Table Editor"** in the left sidebar
2. You should see three tables:
   - ✅ `user_profiles`
   - ✅ `fitness_plans`
   - ✅ `progress_tracking`

### Step 4: Verify Table Structure

Click on each table to verify the columns:

#### `user_profiles` table should have:
- `id` (uuid, primary key)
- `clerk_user_id` (text, unique)
- `first_name`, `last_name`, `email`
- `age`, `gender`, `weight_kg`
- `fitness_goal`, `fitness_level`
- `workout_location`, `dietary_preference`
- `preferred_ai_model`
- `form_data` (jsonb)
- `created_at`, `updated_at`

#### `fitness_plans` table should have:
- `id` (uuid, primary key)
- `clerk_user_id` (text)
- `plan_data` (jsonb)
- `plan_name` (text)
- `created_at`, `updated_at`

#### `progress_tracking` table should have:
- `id` (uuid, primary key)
- `clerk_user_id` (text)
- `fitness_plan_id` (uuid, foreign key)
- `progress_data` (jsonb)
- `entry_date` (date)
- `created_at`, `updated_at`

---

## 🔒 Step 5: Configure Row Level Security (RLS)

The setup script includes RLS policies, but since we're using Clerk (not Supabase Auth), we need to adjust them.

### Option A: Disable RLS (For Development/Testing)

If you want to test quickly without authentication checks:

1. Go to **SQL Editor**
2. Run this query:

```sql
-- Disable RLS temporarily for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: Only do this for development! Never disable RLS in production.

### Option B: Keep RLS Enabled (Recommended)

The current policies allow all operations. For production, you should:

1. Set up Clerk webhooks to sync user data
2. Use service role key for server-side operations
3. Implement custom RLS policies based on `clerk_user_id`

---

## ✅ Step 6: Test the Setup

### Test 1: Check Tables Exist

Run this in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'fitness_plans', 'progress_tracking');
```

You should see all three tables listed.

### Test 2: Check Indexes

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'fitness_plans', 'progress_tracking');
```

You should see multiple indexes for performance.

### Test 3: Check RLS Status

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'fitness_plans', 'progress_tracking');
```

All should show `true` if RLS is enabled.

---

## 🔧 Step 7: Configure Your Frontend

Make sure your `.env` file in the `frontend` directory has:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**To find these values:**
1. Go to Supabase Dashboard
2. Click **"Project Settings"** (gear icon)
3. Click **"API"** in the left menu
4. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon/public key** → `REACT_APP_SUPABASE_ANON_KEY`

---

## 🧪 Step 8: Test Database Connection

1. Start your frontend: `cd frontend && npm start`
2. Open browser console (F12)
3. Look for these logs:
   - `✓ Supabase client initialized successfully`
   - If you see errors, check your `.env` file

---

## 📊 Step 9: Test Data Storage

1. Sign up/Login to your app
2. Fill out the user form
3. Submit the form
4. Check browser console for logs like:
   - `📝 [DB] Creating/Updating user profile...`
   - `✅ [DB] User profile saved successfully`
5. Go to Supabase → **Table Editor** → `user_profiles`
6. You should see a new row with your data!

---

## 🐛 Troubleshooting

### Problem: "relation does not exist"
**Solution**: Make sure you ran the entire `SUPABASE_SETUP.sql` script.

### Problem: "permission denied"
**Solution**: 
- Check if RLS is enabled and policies are set correctly
- For testing, you can temporarily disable RLS (see Step 5, Option A)

### Problem: "column does not exist"
**Solution**: 
- Make sure you ran the complete setup script
- Check the table structure matches what's in the script

### Problem: No data appearing in tables
**Solution**:
- Check browser console for errors
- Verify `.env` file has correct Supabase credentials
- Make sure you restarted the dev server after adding `.env` variables
- Check Supabase logs: Dashboard → Logs → API Logs

### Problem: "Supabase client not initialized"
**Solution**:
- Check `.env` file exists in `frontend` directory
- Verify variable names: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- Restart your development server after changing `.env`

---

## 📝 Quick Reference

### Important Supabase URLs:
- **Dashboard**: https://app.supabase.com
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **API Settings**: Dashboard → Project Settings → API

### Key Files:
- `SUPABASE_SETUP.sql` - Complete database setup script
- `frontend/.env` - Environment variables (create this if it doesn't exist)
- `frontend/src/services/supabase.js` - Database service functions

---

## ✅ Checklist

Before you start using the app, make sure:

- [ ] Supabase project created
- [ ] `SUPABASE_SETUP.sql` script executed successfully
- [ ] All three tables visible in Table Editor
- [ ] `.env` file configured with Supabase credentials
- [ ] Frontend restarted after adding `.env` variables
- [ ] Browser console shows "Supabase client initialized successfully"
- [ ] Test data can be saved and retrieved

---

## 🎉 You're Done!

Once you've completed these steps, your database is ready to store:
- ✅ User profiles (form data)
- ✅ Fitness plans
- ✅ Progress tracking entries

The app will automatically save and load data from Supabase!

