import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate that we have the required credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Current values:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  console.error('\nPlease add the following to your .env file in the frontend directory:');
  console.error('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.error('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('\n⚠️ IMPORTANT: After adding/changing .env variables, you MUST restart your development server (stop and run npm start again)');
}

// Create Supabase client only if we have valid credentials
// This will throw an error if values are missing, which is better than silent failures
let supabase;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✓ Supabase client initialized successfully');
  } else {
    throw new Error('Supabase credentials are missing');
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  // Create a dummy client that will fail gracefully
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };

// Database service functions
export const dbService = {
  // User Profile Operations
  async createOrUpdateUserProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        clerk_user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'clerk_user_id'
      });
    
    if (error) throw error;
    return data;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Fitness Plan Operations
  async saveFitnessPlan(userId, planData) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .insert({
        clerk_user_id: userId,
        plan_data: planData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserFitnessPlans(userId) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFitnessPlan(planId, userId) {
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('id', planId)
      .eq('clerk_user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFitnessPlan(planId, userId) {
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', planId)
      .eq('clerk_user_id', userId);
    
    if (error) throw error;
  },

  // Progress Tracking Operations
  async saveProgressEntry(userId, planId, progressData) {
    const { data, error } = await supabase
      .from('progress_tracking')
      .insert({
        clerk_user_id: userId,
        fitness_plan_id: planId,
        progress_data: progressData,
        entry_date: new Date().toISOString().split('T')[0], // Store date only
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProgressEntries(userId, planId = null) {
    let query = supabase
      .from('progress_tracking')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('entry_date', { ascending: false });
    
    if (planId) {
      query = query.eq('fitness_plan_id', planId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  async updateProgressEntry(entryId, userId, progressData) {
    const { data, error } = await supabase
      .from('progress_tracking')
      .update({
        progress_data: progressData,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .eq('clerk_user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProgressEntry(entryId, userId) {
    const { error } = await supabase
      .from('progress_tracking')
      .delete()
      .eq('id', entryId)
      .eq('clerk_user_id', userId);
    
    if (error) throw error;
  },

  // Get user statistics
  async getUserStats(userId) {
    const [plansResult, progressResult] = await Promise.all([
      supabase
        .from('fitness_plans')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_user_id', userId),
      supabase
        .from('progress_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_user_id', userId)
    ]);

    return {
      totalPlans: plansResult.count || 0,
      totalProgressEntries: progressResult.count || 0
    };
  }
};

