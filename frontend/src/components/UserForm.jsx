import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Info, User, Calendar, Scale, Target, TrendingUp, Home, UtensilsCrossed, Sparkles, CheckCircle2 } from 'lucide-react';

const UserForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', weight: '',
    goal: 'Weight Loss', level: 'Beginner', location: 'Gym', dietary: 'Non-Veg', model: 'gemini'
  });

  const [showTooltip, setShowTooltip] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 10 || formData.age > 100) newErrors.age = 'Please enter a valid age (10-100)';
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Please enter a valid weight (30-300 kg)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClass = "w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all hover:border-slate-600";
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2";

  const fieldConfigs = [
    { 
      name: 'name', 
      label: 'Your Name', 
      icon: User, 
      placeholder: 'Enter your full name',
      tooltip: 'This helps personalize your fitness plan',
      type: 'text'
    },
    { 
      name: 'age', 
      label: 'Age', 
      icon: Calendar, 
      placeholder: '25',
      tooltip: 'Your age helps determine appropriate exercise intensity',
      type: 'number',
      min: 10,
      max: 100
    },
    { 
      name: 'gender', 
      label: 'Gender', 
      icon: User, 
      options: ['Male', 'Female', 'Other'],
      tooltip: 'Helps customize workout recommendations'
    },
    { 
      name: 'weight', 
      label: 'Weight (kg)', 
      icon: Scale, 
      placeholder: '70',
      tooltip: 'Current weight helps calculate calorie needs',
      type: 'number',
      min: 30,
      max: 300
    },
    { 
      name: 'goal', 
      label: 'Fitness Goal', 
      icon: Target, 
      options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness'],
      tooltip: 'What do you want to achieve?',
      descriptions: {
        'Weight Loss': 'Burn fat and lose weight',
        'Muscle Gain': 'Build muscle and strength',
        'Endurance': 'Improve cardiovascular fitness',
        'General Fitness': 'Overall health and wellness'
      }
    },
    { 
      name: 'level', 
      label: 'Fitness Level', 
      icon: TrendingUp, 
      options: ['Beginner', 'Intermediate', 'Advanced'],
      tooltip: 'How experienced are you with exercise?',
      descriptions: {
        'Beginner': 'New to fitness or returning after a break',
        'Intermediate': 'Regular exercise 2-3 times per week',
        'Advanced': 'Experienced with consistent training'
      }
    },
    { 
      name: 'location', 
      label: 'Workout Location', 
      icon: Home, 
      options: ['Gym', 'Home'],
      tooltip: 'Where will you be working out?',
      descriptions: {
        'Gym': 'Access to gym equipment',
        'Home': 'Home-based workouts with minimal equipment'
      }
    },
    { 
      name: 'dietary', 
      label: 'Dietary Preference', 
      icon: UtensilsCrossed, 
      options: ['Non-Veg', 'Veg', 'Vegan', 'Keto', 'Paleo'],
      tooltip: 'Your dietary preferences for meal planning',
      descriptions: {
        'Non-Veg': 'Includes meat and animal products',
        'Veg': 'Vegetarian (no meat, includes dairy/eggs)',
        'Vegan': 'Plant-based only',
        'Keto': 'Low-carb, high-fat diet',
        'Paleo': 'Whole foods, no processed foods'
      }
    },
    { 
      name: 'model', 
      label: 'AI Model', 
      icon: Sparkles, 
      options: [
        { value: 'gemini', label: 'Google Gemini 2.5 Flash (Recommended)' },
        { value: 'openai', label: 'OpenAI GPT-4o Mini' }
      ],
      tooltip: 'Choose the AI model to generate your plan',
      type: 'select-custom'
    }
  ];

  const filledFields = Object.values(formData).filter(v => v !== '').length;
  const totalFields = Object.keys(formData).length;
  const progress = (filledFields / totalFields) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm mt-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4"
        >
          <User className="text-white" size={32} />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Tell Us About Yourself
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Help us create the perfect fitness plan tailored just for you
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-400">Form Progress</span>
          <span className="text-xs font-bold text-blue-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldConfigs.map((field, index) => {
          const Icon = field.icon;
          const hasError = errors[field.name];
          
          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <label className={labelClass}>
                <Icon size={16} className="text-blue-400" />
                {field.label}
                {field.tooltip && (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(field.name)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info size={14} className="text-slate-500 cursor-help hover:text-blue-400 transition-colors" />
                    <AnimatePresence>
                      {showTooltip === field.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300"
                        >
                          {field.tooltip}
                          {field.descriptions && field.descriptions[formData[field.name]] && (
                            <div className="mt-2 pt-2 border-t border-slate-700 text-blue-400">
                              {field.descriptions[formData[field.name]]}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </label>

              {field.type === 'select-custom' ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name]}
                  className={`${inputClass} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.options ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name]}
                  className={`${inputClass} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                >
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  onChange={handleChange}
                  value={formData[field.name]}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  className={`${inputClass} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
              )}

              {hasError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400 flex items-center gap-1"
                >
                  <span>⚠</span> {errors[field.name]}
                </motion.p>
              )}

              {field.descriptions && formData[field.name] && !hasError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-blue-400 flex items-center gap-1"
                >
                  <CheckCircle2 size={12} />
                  {field.descriptions[formData[field.name]]}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      <motion.button 
        onClick={handleSubmit} 
        disabled={loading || !formData.name || !formData.age || !formData.weight}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 py-5 rounded-xl font-bold text-lg text-white transition-all flex justify-center items-center shadow-2xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-3" size={20} />
            <span>Generating Your Personalized Plan...</span>
          </>
        ) : (
          <>
            <Sparkles className="mr-2" size={20} />
            <span>Generate My Plan</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </>
        )}
      </motion.button>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-slate-400">
            🤖 Our AI is crafting your personalized fitness plan...
          </p>
          <p className="text-xs text-slate-500 mt-1">This usually takes 10-30 seconds</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserForm;