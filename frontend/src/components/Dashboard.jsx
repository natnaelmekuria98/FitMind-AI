import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/clerk-react';
import { History, TrendingUp, Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-10">
      {/* Navbar */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <h1 className="text-2xl font-black tracking-tighter text-white">FIT<span className="text-blue-500">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm text-slate-400">Welcome back</p>
                <p className="text-sm font-medium text-white">{user.firstName || user.emailAddresses[0]?.emailAddress}</p>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-slate-800 border-slate-700",
                    userButtonPopoverActionButton: "text-slate-300 hover:text-white hover:bg-slate-700",
                    userButtonPopoverActionButtonText: "text-slate-300",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4">
        {/* Stats Bar - shown when user has data */}
        {(userStats.totalPlans > 0 || userStats.totalProgressEntries > 0) && (
          <div className="max-w-7xl mx-auto mb-6 mt-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <History className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Plans</p>
                    <p className="text-lg font-bold text-white">{userStats.totalPlans}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <TrendingUp className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Progress Entries</p>
                    <p className="text-lg font-bold text-white">{userStats.totalProgressEntries}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {savedPlans.length > 0 && (
                  <button
                    onClick={() => setShowSavedPlans(!showSavedPlans)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                  >
                    <History size={16} />
                    {showSavedPlans ? 'Hide' : 'View'} Saved Plans
                  </button>
                )}
                <button
                  onClick={() => {
                    setStep(1);
                    setShowSavedPlans(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Plans List */}
        {showSavedPlans && savedPlans.length > 0 && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Your Saved Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPlans.map((savedPlan) => (
                  <div
                    key={savedPlan.id}
                    onClick={() => handleLoadSavedPlan(savedPlan.id)}
                    className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:bg-slate-800"
                  >
                    <p className="text-sm text-slate-400 mb-2">
                      {new Date(savedPlan.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-white font-semibold mb-1">
                      {savedPlan.plan_name || 'Fitness Plan'}
                    </p>
                    {savedPlan.plan_data?.userPreferences && (
                      <p className="text-xs text-slate-400">
                        Goal: {savedPlan.plan_data.userPreferences.goal} • Level: {savedPlan.plan_data.userPreferences.level}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

