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
    console.log('📝 [DB] Creating/Updating user profile...');
    console.log('📝 [DB] User ID:', userId);
    console.log('📝 [DB] Profile Data:', {
      name: `${profileData.first_name} ${profileData.last_name}`,
      age: profileData.age,
      gender: profileData.gender,
      weight: profileData.weight_kg,
      goal: profileData.fitness_goal,
      level: profileData.fitness_level,
      location: profileData.workout_location,
      dietary: profileData.dietary_preference,
      model: profileData.preferred_ai_model
    });

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        clerk_user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'clerk_user_id'
      })
      .select();
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error creating/updating user profile:', error);
      console.error('❌ [DB] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log(`✅ [DB] User profile saved successfully in ${duration}ms`);
    console.log('✅ [DB] Profile ID:', data?.[0]?.id);
    console.log('✅ [DB] Updated at:', data?.[0]?.updated_at);
    return data;
  },

  async getUserProfile(userId) {
    console.log('🔍 [DB] Loading user profile...');
    console.log('🔍 [DB] User ID:', userId);
    
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();
    
    const duration = Date.now() - startTime;
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error loading user profile:', error);
      throw error;
    }
    
    if (data) {
      console.log(`✅ [DB] User profile loaded successfully in ${duration}ms`);
      console.log('✅ [DB] Profile found:', {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        goal: data.fitness_goal,
        level: data.fitness_level
      });
    } else {
      console.log(`ℹ️ [DB] No user profile found for user ${userId} (${duration}ms)`);
    }
    
    return data;
  },

  // Fitness Plan Operations
  async saveFitnessPlan(userId, planData) {
    console.log('💾 [DB] Saving fitness plan...');
    console.log('💾 [DB] User ID:', userId);
    console.log('💾 [DB] Plan data keys:', Object.keys(planData));
    console.log('💾 [DB] Plan includes:', {
      hasWorkout: !!planData.weekly_workout,
      hasDiet: !!planData.weekly_diet,
      hasMotivation: !!planData.motivation,
      hasTips: !!planData.tips,
      workoutDays: planData.weekly_workout?.length || 0,
      dietDays: planData.weekly_diet?.length || 0
    });

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('fitness_plans')
      .insert({
        clerk_user_id: userId,
        plan_data: planData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error saving fitness plan:', error);
      console.error('❌ [DB] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
    
    console.log(`✅ [DB] Fitness plan saved successfully in ${duration}ms`);
    console.log('✅ [DB] Plan ID:', data.id);
    console.log('✅ [DB] Created at:', data.created_at);
    return data;
  },

  async getUserFitnessPlans(userId) {
    console.log('🔍 [DB] Loading user fitness plans...');
    console.log('🔍 [DB] User ID:', userId);
    
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error loading fitness plans:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Loaded ${data?.length || 0} fitness plans in ${duration}ms`);
    if (data && data.length > 0) {
      console.log('✅ [DB] Plans:', data.map(p => ({
        id: p.id,
        created: p.created_at,
        hasData: !!p.plan_data
      })));
    }
    
    return data || [];
  },

  async getFitnessPlan(planId, userId) {
    console.log('🔍 [DB] Loading fitness plan...');
    console.log('🔍 [DB] Plan ID:', planId);
    console.log('🔍 [DB] User ID:', userId);
    
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('id', planId)
      .eq('clerk_user_id', userId)
      .single();
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error loading fitness plan:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Fitness plan loaded successfully in ${duration}ms`);
    console.log('✅ [DB] Plan details:', {
      id: data.id,
      created: data.created_at,
      hasWorkout: !!data.plan_data?.weekly_workout,
      hasDiet: !!data.plan_data?.weekly_diet
    });
    
    return data;
  },

  async deleteFitnessPlan(planId, userId) {
    console.log('🗑️ [DB] Deleting fitness plan...');
    console.log('🗑️ [DB] Plan ID:', planId);
    console.log('🗑️ [DB] User ID:', userId);
    
    const startTime = Date.now();
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', planId)
      .eq('clerk_user_id', userId);
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error deleting fitness plan:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Fitness plan deleted successfully in ${duration}ms`);
  },

  // Progress Tracking Operations
  async saveProgressEntry(userId, planId, progressData) {
    console.log('📊 [DB] Saving progress entry...');
    console.log('📊 [DB] User ID:', userId);
    console.log('📊 [DB] Plan ID:', planId);
    console.log('📊 [DB] Progress data:', {
      workoutCompleted: progressData.workout_completed,
      dietFollowed: progressData.diet_followed,
      energyLevel: progressData.energy_level,
      mood: progressData.mood,
      weight: progressData.weight_kg,
      hasNotes: !!progressData.notes
    });

    const entryDate = new Date().toISOString().split('T')[0];
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('progress_tracking')
      .insert({
        clerk_user_id: userId,
        fitness_plan_id: planId,
        progress_data: progressData,
        entry_date: entryDate,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error saving progress entry:', error);
      console.error('❌ [DB] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
    
    console.log(`✅ [DB] Progress entry saved successfully in ${duration}ms`);
    console.log('✅ [DB] Entry ID:', data.id);
    console.log('✅ [DB] Entry date:', data.entry_date);
    return data;
  },

  async getProgressEntries(userId, planId = null) {
    console.log('🔍 [DB] Loading progress entries...');
    console.log('🔍 [DB] User ID:', userId);
    if (planId) {
      console.log('🔍 [DB] Plan ID filter:', planId);
    } else {
      console.log('🔍 [DB] Loading all progress entries for user');
    }
    
    const startTime = Date.now();
    let query = supabase
      .from('progress_tracking')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('entry_date', { ascending: false });
    
    if (planId) {
      query = query.eq('fitness_plan_id', planId);
    }
    
    const { data, error } = await query;
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error loading progress entries:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Loaded ${data?.length || 0} progress entries in ${duration}ms`);
    if (data && data.length > 0) {
      console.log('✅ [DB] Entries:', data.map(e => ({
        id: e.id,
        date: e.entry_date,
        planId: e.fitness_plan_id,
        energy: e.progress_data?.energy_level,
        mood: e.progress_data?.mood
      })));
    }
    
    return data || [];
  },

  async updateProgressEntry(entryId, userId, progressData) {
    console.log('✏️ [DB] Updating progress entry...');
    console.log('✏️ [DB] Entry ID:', entryId);
    console.log('✏️ [DB] User ID:', userId);
    console.log('✏️ [DB] Updated data:', progressData);

    const startTime = Date.now();
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
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error updating progress entry:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Progress entry updated successfully in ${duration}ms`);
    console.log('✅ [DB] Updated at:', data.updated_at);
    return data;
  },

  async deleteProgressEntry(entryId, userId) {
    console.log('🗑️ [DB] Deleting progress entry...');
    console.log('🗑️ [DB] Entry ID:', entryId);
    console.log('🗑️ [DB] User ID:', userId);
    
    const startTime = Date.now();
    const { error } = await supabase
      .from('progress_tracking')
      .delete()
      .eq('id', entryId)
      .eq('clerk_user_id', userId);
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [DB] Error deleting progress entry:', error);
      throw error;
    }
    
    console.log(`✅ [DB] Progress entry deleted successfully in ${duration}ms`);
  },

  // Get user statistics
  async getUserStats(userId) {
    console.log('📈 [DB] Loading user statistics...');
    console.log('📈 [DB] User ID:', userId);
    
    const startTime = Date.now();
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

    const duration = Date.now() - startTime;
    const stats = {
      totalPlans: plansResult.count || 0,
      totalProgressEntries: progressResult.count || 0
    };
    
    console.log(`✅ [DB] User statistics loaded in ${duration}ms`);
    console.log('✅ [DB] Stats:', stats);
    
    return stats;
  }
};

