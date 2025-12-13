import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const UserForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', weight: '',
    goal: 'Weight Loss', level: 'Beginner', location: 'Gym', dietary: 'Non-Veg'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = "w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-400 mb-2";

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 mt-10"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Tell us about yourself</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Name</label>
          <input name="name" onChange={handleChange} className={inputClass} placeholder="John Doe" />
        </div>
        <div>
          <label className={labelClass}>Age</label>
          <input name="age" type="number" onChange={handleChange} className={inputClass} placeholder="25" />
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select name="gender" onChange={handleChange} className={inputClass}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Weight (kg)</label>
          <input name="weight" type="number" onChange={handleChange} className={inputClass} placeholder="70" />
        </div>
        <div>
          <label className={labelClass}>Fitness Goal</label>
          <select name="goal" onChange={handleChange} className={inputClass}>
            <option>Weight Loss</option><option>Muscle Gain</option><option>Endurance</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Current Level</label>
          <select name="level" onChange={handleChange} className={inputClass}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <select name="location" onChange={handleChange} className={inputClass}>
            <option>Gym</option><option>Home</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Dietary Preference</label>
          <select name="dietary" onChange={handleChange} className={inputClass}>
            <option>Non-Veg</option><option>Veg</option><option>Vegan</option><option>Keto</option>
          </select>
        </div>
      </div>

      <button 
        onClick={() => onSubmit(formData)} 
        disabled={loading}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg text-white transition-all flex justify-center items-center shadow-lg disabled:opacity-50"
      >
        {loading ? <><Loader2 className="animate-spin mr-2"/> Generating Plan...</> : "Generate My Plan"}
      </button>
    </motion.div>
  );
};

export default UserForm;