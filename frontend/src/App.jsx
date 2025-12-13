import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import UserForm from './components/UserForm';
import PlanViewer from './components/PlanViwer';
import { generatePlan } from './Api/data';

function App() {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await generatePlan(formData);
      setPlan(data);
      setStep(2);
    } catch (error) {
      alert("Failed to generate plan. Ensure Backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-10">
      {/* Navbar */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
        <h1 className="text-2xl font-black tracking-tighter text-white">FIT<span className="text-blue-500">AI</span></h1>
      </nav>

      <main className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <Hero key="hero" onStart={() => setStep(1)} />
          )}

          {step === 1 && (
            <UserForm key="form" onSubmit={handleFormSubmit} loading={loading} />
          )}

          {step === 2 && plan && (
            <PlanViewer key="plan" plan={plan} onReset={() => setStep(0)} />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;