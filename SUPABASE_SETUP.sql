-- ============================================
-- FitMind AI - Supabase Database Setup
-- ============================================
-- Run this script in your Supabase SQL Editor
-- to set up all required tables and policies
-- ============================================

-- 1. User Profiles Table
-- Stores user information from the form
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT,
  weight_kg DECIMAL(5,2),
  fitness_goal TEXT,
  fitness_level TEXT,
  workout_location TEXT,
  dietary_preference TEXT,
  preferred_ai_model TEXT DEFAULT 'gemini',
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fitness Plans Table
-- Stores generated fitness plans
CREATE TABLE IF NOT EXISTS fitness_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  plan_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Progress Tracking Table
-- Stores daily progress entries
CREATE TABLE IF NOT EXISTS progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  fitness_plan_id UUID REFERENCES fitness_plans(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better query performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_user ON fitness_plans(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_plans_created ON fitness_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user ON progress_tracking(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_plan ON progress_tracking(fitness_plan_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_date ON progress_tracking(entry_date DESC);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own plans" ON fitness_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON fitness_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON fitness_plans;
DROP POLICY IF EXISTS "Users can view own progress" ON progress_tracking;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress_tracking;
DROP POLICY IF EXISTS "Users can update own progress" ON progress_tracking;
DROP POLICY IF EXISTS "Users can delete own progress" ON progress_tracking;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (true); -- Allow all users to view (adjust based on your auth setup)

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (true); -- Allow all users to insert (adjust based on your auth setup)

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (true); -- Allow all users to update (adjust based on your auth setup)

-- Fitness Plans Policies
CREATE POLICY "Users can view own plans" ON fitness_plans
  FOR SELECT USING (true); -- Allow all users to view (adjust based on your auth setup)

CREATE POLICY "Users can insert own plans" ON fitness_plans
  FOR INSERT WITH CHECK (true); -- Allow all users to insert (adjust based on your auth setup)

CREATE POLICY "Users can delete own plans" ON fitness_plans
  FOR DELETE USING (true); -- Allow all users to delete (adjust based on your auth setup)

-- Progress Tracking Policies
CREATE POLICY "Users can view own progress" ON progress_tracking
  FOR SELECT USING (true); -- Allow all users to view (adjust based on your auth setup)

CREATE POLICY "Users can insert own progress" ON progress_tracking
  FOR INSERT WITH CHECK (true); -- Allow all users to insert (adjust based on your auth setup)

CREATE POLICY "Users can update own progress" ON progress_tracking
  FOR UPDATE USING (true); -- Allow all users to update (adjust based on your auth setup)

CREATE POLICY "Users can delete own progress" ON progress_tracking
  FOR DELETE USING (true); -- Allow all users to delete (adjust based on your auth setup)

-- ============================================
-- Functions for automatic timestamp updates
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fitness_plans_updated_at ON fitness_plans;
CREATE TRIGGER update_fitness_plans_updated_at
    BEFORE UPDATE ON fitness_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_tracking_updated_at ON progress_tracking;
CREATE TRIGGER update_progress_tracking_updated_at
    BEFORE UPDATE ON progress_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries
-- ============================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'fitness_plans', 'progress_tracking');

-- Verify indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'fitness_plans', 'progress_tracking');

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'fitness_plans', 'progress_tracking');

-- ============================================
-- Notes:
-- ============================================
-- 1. The RLS policies above use "true" which allows all operations.
--    For production, you should implement proper authentication checks.
--    Example: USING (auth.uid()::text = clerk_user_id)
--
-- 2. If using Clerk authentication, you may need to:
--    - Set up Clerk webhooks to sync user data
--    - Use service role key for server-side operations
--    - Implement custom RLS policies based on Clerk user IDs
--
-- 3. For better security, consider:
--    - Adding foreign key constraints
--    - Implementing soft deletes
--    - Adding data validation triggers
--    - Setting up proper backup strategies

