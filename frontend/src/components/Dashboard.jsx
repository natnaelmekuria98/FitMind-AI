import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser, UserButton } from '@clerk/clerk-react';
import { History, TrendingUp, Plus, Activity, Sparkles } from 'lucide-react';
import Hero from './Hero';
import UserForm from './UserForm';
import PlanViewer from './PlanViwer';
import { generatePlan } from '../Api/data';
import { dbService } from '../services/supabase';

const Dashboard = () => {
  const { user } = useUser();
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [userStats, setUserStats] = useState({ totalPlans: 0, totalProgressEntries: 0 });

  // Load saved plans and stats on mount
  useEffect(() => {
    if (user?.id) {
      loadSavedPlans();
      loadUserStats();
    }
  }, [user?.id]);

  const loadSavedPlans = async () => {
    try {
      const plans = await dbService.getUserFitnessPlans(user.id);
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading saved plans:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await dbService.getUserStats(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await generatePlan(formData);
      setPlan(data);
      
      // Save plan to Supabase
      if (user?.id) {
        try {
          const savedPlan = await dbService.saveFitnessPlan(user.id, {
            ...data,
            userPreferences: formData
          });
          setCurrentPlanId(savedPlan.id);
          await loadSavedPlans();
          await loadUserStats();
        } catch (dbError) {
          console.error('Error saving plan to database:', dbError);
          // Continue even if save fails - plan is still displayed
        }
      }
      
      setStep(2);
    } catch (error) {
      alert("Failed to generate plan. Ensure Backend is running.");
    }
    setLoading(false);
  };

  const handleLoadSavedPlan = async (planId) => {
    try {
      const savedPlan = await dbService.getFitnessPlan(planId, user.id);
      setPlan(savedPlan.plan_data);
      setCurrentPlanId(savedPlan.id);
      setStep(2);
      setShowSavedPlans(false);
    } catch (error) {
      console.error('Error loading saved plan:', error);
      alert('Failed to load saved plan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-10">
      {/* Navbar */}
      <nav className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30 sticky top-0 z-40">
        <motion.div 
          className="flex items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            FitMind<span className="text-blue-500">AI</span>
          </h1>
        </motion.div>
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500">Welcome back</p>
                <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[120px] sm:max-w-none">{user.firstName || user.emailAddresses[0]?.emailAddress}</p>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 sm:w-10 sm:h-10 border-2 border-slate-700 hover:border-blue-500 transition-colors",
                    userButtonPopoverCard: "bg-slate-800 border-slate-700 shadow-2xl",
                    userButtonPopoverActionButton: "text-slate-300 hover:text-white hover:bg-slate-700",
                    userButtonPopoverActionButtonText: "text-slate-300",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4">
        {/* Stats Bar - shown when user has data */}
        {(userStats.totalPlans > 0 || userStats.totalProgressEntries > 0) && (
          <motion.div 
            className="max-w-7xl mx-auto mb-6 mt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-700/50 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap w-full md:w-auto">
                  <motion.div 
                    className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg sm:rounded-xl border border-blue-500/30">
                      <History className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Total Plans</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{userStats.totalPlans}</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl border border-purple-500/30">
                      <TrendingUp className="text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Progress Entries</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{userStats.totalProgressEntries}</p>
                    </div>
                  </motion.div>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                  {savedPlans.length > 0 && (
                    <motion.button
                      onClick={() => setShowSavedPlans(!showSavedPlans)}
                      className="flex-1 md:flex-none px-4 sm:px-5 py-2.5 bg-slate-700/50 hover:bg-slate-600 rounded-xl text-xs sm:text-sm font-medium text-white transition-all border border-slate-600 hover:border-slate-500 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <History size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">{showSavedPlans ? 'Hide' : 'View'} Plans</span>
                      <span className="xs:hidden">{showSavedPlans ? 'Hide' : 'View'}</span>
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => {
                      setStep(1);
                      setShowSavedPlans(false);
                    }}
                    className="flex-1 md:flex-none px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">New Plan</span>
                    <span className="xs:hidden">New</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Plans List */}
        {showSavedPlans && savedPlans.length > 0 && (
          <motion.div 
            className="max-w-7xl mx-auto mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <History className="text-blue-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Your Saved Plans</h3>
                <span className="ml-auto px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                  {savedPlans.length} {savedPlans.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPlans.map((savedPlan, index) => (
                  <motion.div
                    key={savedPlan.id}
                    onClick={() => handleLoadSavedPlan(savedPlan.id)}
                    className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all hover:bg-slate-800/50 group relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      {new Date(savedPlan.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-white font-semibold mb-2 text-lg group-hover:text-blue-400 transition-colors">
                      {savedPlan.plan_name || 'Fitness Plan'}
                    </p>
                    {savedPlan.plan_data?.userPreferences && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium">
                          {savedPlan.plan_data.userPreferences.goal}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs font-medium">
                          {savedPlan.plan_data.userPreferences.level}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      <Sparkles size={12} />
                      <span>Click to view</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <Hero key="hero" onStart={() => setStep(1)} />
          )}

          {step === 1 && (
            <UserForm key="form" onSubmit={handleFormSubmit} loading={loading} />
          )}

          {step === 2 && plan && (
            <PlanViewer 
              key="plan" 
              plan={plan} 
              planId={currentPlanId}
              userId={user?.id}
              onReset={() => {
                setStep(0);
                setPlan(null);
                setCurrentPlanId(null);
                loadSavedPlans();
                loadUserStats();
              }} 
            />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;


