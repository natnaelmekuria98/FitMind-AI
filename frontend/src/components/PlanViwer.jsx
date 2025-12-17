import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Image as ImageIcon, RefreshCw, Dumbbell, Utensils, TrendingUp, CheckCircle, X, HelpCircle, ZoomIn, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import { dbService } from '../services/supabase';

const PlanViewer = ({ plan, onReset, planId, userId }) => {
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'diet' | 'progress'
  const [modalImage, setModalImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageGuide, setShowImageGuide] = useState(false);
  const [progressEntries, setProgressEntries] = useState([]);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressFormData, setProgressFormData] = useState({
    workout_completed: false,
    exercises_completed: [],
    diet_followed: false,
    meals_logged: [],
    energy_level: 5,
    mood: 'Good',
    weight_kg: '',
    notes: ''
  });

  // Load progress entries when planId is available
  useEffect(() => {
    if (planId && userId) {
      loadProgressEntries();
    }
  }, [planId, userId]);

  // Handle ESC key to close image modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showImageModal]);

  const loadProgressEntries = async () => {
    try {
      const entries = await dbService.getProgressEntries(userId, planId);
      setProgressEntries(entries);
    } catch (error) {
      console.error('Error loading progress entries:', error);
    }
  };

  const handleSaveProgress = async () => {
    if (!planId || !userId) {
      alert('Plan must be saved first before tracking progress');
      return;
    }

    try {
      await dbService.saveProgressEntry(userId, planId, {
        ...progressFormData,
        weight_kg: progressFormData.weight_kg ? parseFloat(progressFormData.weight_kg) : null
      });
      
      // Reset form and reload entries
      setProgressFormData({
        workout_completed: false,
        exercises_completed: [],
        diet_followed: false,
        meals_logged: [],
        energy_level: 5,
        mood: 'Good',
        weight_kg: '',
        notes: ''
      });
      setShowProgressForm(false);
      await loadProgressEntries();
      alert('Progress saved successfully!');
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save progress. Please try again.');
    }
  };


  // Export PDF
   // Export PDF Function
  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let yPos = 20; // Vertical cursor position

    // Helper: Check if we need a new page
    const checkPageBreak = (spaceNeeded = 10) => {
      if (yPos + spaceNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = 20; // Reset to top
      }
    };

    // --- 1. TITLE & HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 100, 255); // Blue color
    doc.text("FITAI - Personal Transformation Plan", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" });

    // --- 2. MOTIVATION ---
    yPos += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(80);
    // Split text to fit width
    const splitQuote = doc.splitTextToSize(`"${plan.motivation}"`, pageWidth - (margin * 2));
    doc.text(splitQuote, pageWidth / 2, yPos, { align: "center" });
    yPos += (splitQuote.length * 7) + 10;

    // --- 3. TIPS SECTION ---
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Coach Tips:", margin, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    plan.tips.forEach((tip) => {
      checkPageBreak();
      doc.text(`• ${tip}`, margin + 5, yPos);
      yPos += 8;
    });
    yPos += 10;

    // --- 4. WORKOUT SECTION ---
    checkPageBreak(30);
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos); // Divider line
    yPos += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 100, 255);
    doc.text("Weekly Workout Routine", margin, yPos);
    yPos += 15;

    plan.weekly_workout.forEach((day) => {
      checkPageBreak(40); // Ensure header + 1 exercise fits
      
      // Day Header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F'); // Gray background
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(day.day, margin + 2, yPos);
      yPos += 12;

      // Exercises
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      day.exercises.forEach((ex) => {
        checkPageBreak();
        const exText = `${ex.name}`;
        const detailsText = `${ex.sets} Sets  |  ${ex.reps} Reps  |  Rest: ${ex.rest}`;
        
        doc.setFont("helvetica", "bold");
        doc.text(exText, margin + 5, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(detailsText, margin + 80, yPos); // Align details to right side
        yPos += 8;
      });
      yPos += 8; // Spacing between days
    });

    // --- 5. DIET SECTION ---
    checkPageBreak(40);
    doc.addPage(); // Force start diet on new page for cleanliness
    yPos = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text("Weekly Diet Plan", margin, yPos);
    yPos += 15;

    plan.weekly_diet.forEach((day) => {
      checkPageBreak(50);

      // Day Header
      doc.setFillColor(240, 255, 240); // Light green bg
      doc.rect(margin, yPos - 6, pageWidth - (margin * 2), 10, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(day.day, margin + 2, yPos);
      yPos += 12;

      // Meals
      doc.setFontSize(11);
      const meals = [
        { label: "Breakfast", value: day.meals.breakfast },
        { label: "Lunch", value: day.meals.lunch },
        { label: "Dinner", value: day.meals.dinner },
        { label: "Snacks", value: day.meals.snacks },
      ];

      meals.forEach((meal) => {
        checkPageBreak();
        doc.setFont("helvetica", "bold");
        doc.text(`${meal.label}:`, margin + 5, yPos);
        
        doc.setFont("helvetica", "normal");
        // Wrap long food text
        const splitFood = doc.splitTextToSize(meal.value, pageWidth - margin - 50);
        doc.text(splitFood, margin + 40, yPos);
        
        yPos += (splitFood.length * 6) + 4; // Dynamic spacing based on text length
      });
      yPos += 10;
    });

    // --- SAVE ---
    doc.save("FITAI-Transformation-Plan.pdf");
  };

  const handleImgGen = (prompt) => {
      setLoadingImg(true);
      setModalImage(null); // Reset current image

      // 1. Construct the URL directly (No Backend call needed)
      const cleanPrompt = encodeURIComponent(prompt + " fitness gym realistic 4k lighting");
      const directUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?nodelay=true`;

      setTimeout(() => {
        setModalImage(directUrl);
        setLoadingImg(false);
        // Automatically open the image in modal when generated
        setShowImageModal(true);
      }, 1);
    };

  const handleImageClick = () => {
    if (modalImage) {
      setShowImageModal(true);
    }
  };

  // Handle Voice using OpenAI TTS API
  const handleVoice = async () => {
    try {
      // Format the text to be readable (Human style, not JSON style)
      let textToRead = "";

      if (activeTab === 'workout') {
        const dayPlan = plan.weekly_workout[0];
        textToRead = `Here is your workout for ${dayPlan.day}. `;
        
        // Loop through exercises to make a sentence
        dayPlan.exercises.forEach(ex => {
          textToRead += `Do ${ex.name} for ${ex.sets} sets of ${ex.reps} reps. `;
        });

      } else {
        const dayDiet = plan.weekly_diet[0];
        textToRead = `Here is your diet plan for ${dayDiet.day}. 
          For Breakfast, have ${dayDiet.meals.breakfast}. 
          For Lunch, have ${dayDiet.meals.lunch}. 
          For Dinner, have ${dayDiet.meals.dinner}. 
          For Snacks, have ${dayDiet.meals.snacks}.`;
      }

      // Import the generateVoice function
      const { generateVoice } = await import('../Api/data');
      
      // Generate audio using OpenAI TTS API
      const audioUrl = await generateVoice(textToRead);
      setAudioUrl(audioUrl);
      
      // Auto-play the audio
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        alert("Failed to play audio. Please check your browser's autoplay settings.");
      });
    } catch (error) {
      console.error("Error generating voice:", error);
      alert("Failed to generate voice. Please ensure the backend is running and OpenAI API key is configured.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-slate-700/50 shadow-2xl"
      >
        <div className="flex-1 mb-3 sm:mb-4 md:mb-0 w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl">
              <Dumbbell className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Your Personal AI Plan
            </h1>
          </div>
          <p className="text-blue-400/90 italic text-sm sm:text-base md:text-lg pl-8 sm:pl-11">"{plan.motivation}"</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full md:w-auto mt-3 md:mt-0">
          <motion.button 
            onClick={handleExport} 
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 hover:bg-blue-600 rounded-xl text-white transition-all border border-slate-600 hover:border-blue-500 group touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download as PDF"
          >
            <Download size={16} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
            <span className="hidden sm:inline font-medium text-sm">Export PDF</span>
            <span className="sm:hidden text-xs">PDF</span>
          </motion.button>
          <motion.button 
            onClick={onReset} 
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 hover:bg-purple-600 rounded-xl text-white transition-all border border-slate-600 hover:border-purple-500 group touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Create New Plan"
          >
            <RefreshCw size={16} className="sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline font-medium text-sm">New Plan</span>
            <span className="sm:hidden text-xs">New</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Audio Player */}
      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Play className="text-blue-400" size={20} />
            </div>
            <span className="text-sm font-medium text-slate-300">Audio Guide</span>
          </div>
          <audio controls autoPlay src={audioUrl} className="w-full" />
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 border-b border-slate-700/50 pb-3 sm:pb-4 overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
        <TabButton 
          active={activeTab === 'workout'} 
          onClick={() => setActiveTab('workout')} 
          icon={<Dumbbell size={16} className="sm:w-5 sm:h-5"/>} 
          label="Workout" 
          count={plan.weekly_workout.length}
        />
        <TabButton 
          active={activeTab === 'diet'} 
          onClick={() => setActiveTab('diet')} 
          icon={<Utensils size={16} className="sm:w-5 sm:h-5"/>} 
          label="Diet" 
          count={plan.weekly_diet.length}
        />
        {planId && (
          <TabButton 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
            icon={<TrendingUp size={16} className="sm:w-5 sm:h-5"/>} 
            label="Progress" 
            count={progressEntries.length}
          />
        )}
        
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {/* Image Guide Button */}
          <motion.button
            onClick={() => setShowImageGuide(!showImageGuide)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all border border-slate-600 hover:border-blue-500 touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="How to generate images"
          >
            <HelpCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Guide</span>
          </motion.button>
          
          <motion.button 
            onClick={handleVoice} 
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600 hover:to-purple-600 rounded-xl text-xs sm:text-sm font-medium text-blue-400 hover:text-white transition-all border border-blue-500/30 hover:border-blue-500 touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Listen to Day 1 plan"
          >
            <Play size={14} className="sm:w-4 sm:h-4" /> 
            <span className="hidden sm:inline">Listen</span>
          </motion.button>
        </div>
      </div>

      {/* Image Generation Guide */}
      <AnimatePresence>
        {showImageGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 sm:mb-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
                <Sparkles className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">
                  How to Generate & View Images
                </h3>
                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-blue-400 font-bold text-base sm:text-lg flex-shrink-0">1.</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Click the Image Icon</p>
                      <p>Look for the <ImageIcon className="inline mx-1 text-blue-400 w-3 h-3 sm:w-4 sm:h-4" /> icon next to any exercise or meal item</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-blue-400 font-bold text-base sm:text-lg flex-shrink-0">2.</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Wait for Generation</p>
                      <p>The AI will create a realistic image (takes 2-5 seconds)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-blue-400 font-bold text-base sm:text-lg flex-shrink-0">3.</span>
                    <div>
                      <p className="font-semibold text-white mb-1">View Full Size</p>
                      <p>Tap on the generated image in the preview panel to view it in full screen</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-blue-300 flex items-start gap-2">
                    <span className="flex-shrink-0">💡</span>
                    <span><strong>Tip:</strong> Images help you visualize exercises and meals for better understanding!</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImageGuide(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors flex-shrink-0 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close guide"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        
        {/* Main Content List */}
        <div className="md:col-span-2 space-y-3 sm:space-y-4 order-2 md:order-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'workout' ? (
                plan.weekly_workout.map((day, idx) => (
                  <Card key={idx} title={day.day}>
                    {day.exercises.map((ex, i) => (
                      <RowItem key={i} title={ex.name} sub={`${ex.sets} sets | ${ex.reps} reps`} onImg={() => handleImgGen(ex.name)} />
                    ))}
                  </Card>
                ))
              ) : activeTab === 'diet' ? (
                plan.weekly_diet.map((day, idx) => (
                  <Card key={idx} title={day.day} color="text-emerald-400">
                    {Object.entries(day.meals).map(([type, meal], i) => (
                      <RowItem key={i} title={type.toUpperCase()} sub={meal} onImg={() => handleImgGen(meal)} />
                    ))}
                  </Card>
                ))
              ) : activeTab === 'progress' ? (
                <ProgressTrackingView
                  planId={planId}
                  userId={userId}
                  progressEntries={progressEntries}
                  showProgressForm={showProgressForm}
                  setShowProgressForm={setShowProgressForm}
                  progressFormData={progressFormData}
                  setProgressFormData={setProgressFormData}
                  onSaveProgress={handleSaveProgress}
                  onReload={loadProgressEntries}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar: Tips & Image Preview */}
        <div className="md:col-span-1 space-y-4 sm:space-y-6 order-1 md:order-2">
          <motion.div 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-white">Coach Tips</h4>
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {plan.tips.map((tip, i) => (
                <motion.li 
                  key={i}
                  className="flex items-start gap-2 sm:gap-3 text-slate-300 text-xs sm:text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-blue-400 mt-0.5 sm:mt-1">💡</span>
                  <span className="leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/50 min-h-[250px] sm:min-h-[300px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loadingImg && (
              <motion.div 
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <RefreshCw className="animate-spin text-blue-400 mb-2 w-8 h-8 sm:w-10 sm:h-10" />
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Generating image...</p>
                <p className="text-xs text-slate-500 mt-1">This may take a few seconds</p>
              </motion.div>
            )}
            {modalImage ? (
              <motion.div
                className="w-full h-full relative group cursor-pointer touch-manipulation"
                onClick={handleImageClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img 
                  src={modalImage} 
                  alt="Generated" 
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-black/0 group-active:bg-black/30 rounded-lg sm:rounded-xl transition-all flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-active:opacity-100 transition-opacity flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/60 rounded-lg backdrop-blur-sm"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <ZoomIn className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-white text-xs sm:text-sm font-medium">Tap to view full size</span>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-slate-500 p-4 sm:p-6">
                <motion.div 
                  className="p-3 sm:p-4 bg-slate-700/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ImageIcon size={32} className="sm:w-10 sm:h-10 opacity-50"/>
                </motion.div>
                <p className="text-xs sm:text-sm font-medium mb-1 text-slate-400">Visual Preview</p>
                <p className="text-xs text-slate-600 mb-2 sm:mb-3">Click any <ImageIcon className="inline mx-1 text-blue-400 w-3 h-3 sm:w-4 sm:h-4" /> icon to generate</p>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs text-blue-400">
                  <HelpCircle size={12} className="sm:w-4 sm:h-4" />
                  <span>See guide above</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {showImageModal && modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[95vh] sm:max-h-[90vh] w-full h-full sm:h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-10 sm:-top-12 right-0 sm:right-0 p-2.5 sm:p-3 bg-slate-800/90 hover:bg-slate-700 rounded-full text-white transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Close (ESC)"
                aria-label="Close image"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </motion.button>

              {/* Image */}
              <motion.img
                src={modalImage}
                alt="Generated"
                className="w-full h-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              />

              {/* Image Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/50"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <Sparkles className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base">AI-Generated Image</p>
                    <p className="text-xs text-slate-400">Tap outside or press ESC to close</p>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = modalImage;
                      link.download = 'fitness-image.jpg';
                      link.click();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components for cleaner code
const TabButton = ({ active, onClick, icon, label, count }) => (
  <motion.button 
    onClick={onClick} 
    className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-xs sm:text-sm touch-manipulation min-h-[44px] ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon} 
    <span className="whitespace-nowrap">{label}</span>
    {count !== undefined && (
      <span className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
        active ? 'bg-white/20' : 'bg-slate-700'
      }`}>
        {count}
      </span>
    )}
    {active && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
        layoutId="activeTab"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </motion.button>
);

const Card = ({ title, children, color = "text-blue-400" }) => (
  <motion.div 
    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50 mb-3 sm:mb-4 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
  >
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-slate-700/50">
      <div className={`p-1.5 sm:p-2 bg-gradient-to-br ${color.includes('blue') ? 'from-blue-500/20 to-blue-600/20' : 'from-emerald-500/20 to-emerald-600/20'} rounded-lg`}>
        <Dumbbell className={`${color} w-4 h-4 sm:w-5 sm:h-5`} />
      </div>
      <h3 className={`text-lg sm:text-xl font-bold ${color}`}>{title}</h3>
    </div>
    <div className="space-y-2 sm:space-y-3">{children}</div>
  </motion.div>
);

const RowItem = ({ title, sub, onImg }) => (
  <motion.div 
    className="flex justify-between items-center bg-slate-900/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-800/50 hover:border-blue-500/50 transition-all group"
    whileHover={{ x: 4 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex-1 min-w-0 pr-2">
      <p className="font-semibold text-slate-200 mb-1 text-sm sm:text-base truncate">{title}</p>
      <p className="text-xs text-slate-400 line-clamp-2">{sub}</p>
    </div>
    <motion.button 
      onClick={onImg} 
      className="relative p-2 sm:p-2.5 text-slate-500 group-hover:text-blue-400 transition-colors bg-slate-800/50 rounded-lg sm:rounded-xl hover:bg-blue-500/20 border border-slate-700 group-hover:border-blue-500/50 flex-shrink-0 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      title="Click to generate image"
    >
      <ImageIcon size={16} className="sm:w-5 sm:h-5" />
      <motion.span
        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.button>
  </motion.div>
);

// Progress Tracking Component
const ProgressTrackingView = ({
  planId,
  userId,
  progressEntries,
  showProgressForm,
  setShowProgressForm,
  progressFormData,
  setProgressFormData,
  onSaveProgress,
  onReload
}) => {
  const moods = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <div className="space-y-4">
      {/* Add Progress Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Your Progress</h3>
        <button
          onClick={() => setShowProgressForm(!showProgressForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
        >
          <CheckCircle size={16} />
          {showProgressForm ? 'Cancel' : 'Log Progress'}
        </button>
      </div>

      {/* Progress Form */}
      {showProgressForm && (
        <Card title="Log Today's Progress" color="text-purple-400">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progressFormData.workout_completed}
                  onChange={(e) => setProgressFormData({ ...progressFormData, workout_completed: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-slate-300">Workout Completed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progressFormData.diet_followed}
                  onChange={(e) => setProgressFormData({ ...progressFormData, diet_followed: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-slate-300">Diet Followed</span>
              </label>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Energy Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={progressFormData.energy_level}
                onChange={(e) => setProgressFormData({ ...progressFormData, energy_level: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span className="text-blue-400 font-bold">{progressFormData.energy_level}</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Mood</label>
              <select
                value={progressFormData.mood}
                onChange={(e) => setProgressFormData({ ...progressFormData, mood: e.target.value })}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Weight (kg) - Optional</label>
              <input
                type="number"
                step="0.1"
                value={progressFormData.weight_kg}
                onChange={(e) => setProgressFormData({ ...progressFormData, weight_kg: e.target.value })}
                placeholder="Enter current weight"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Notes</label>
              <textarea
                value={progressFormData.notes}
                onChange={(e) => setProgressFormData({ ...progressFormData, notes: e.target.value })}
                placeholder="How did you feel today? Any challenges or achievements?"
                rows="3"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <button
              onClick={onSaveProgress}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors"
            >
              Save Progress
            </button>
          </div>
        </Card>
      )}

      {/* Progress Entries List */}
      {progressEntries.length > 0 ? (
        <div className="space-y-3">
          {progressEntries.map((entry) => (
            <Card key={entry.id} title={new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} color="text-green-400">
              <div className="space-y-2">
                {entry.progress_data.workout_completed && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={16} />
                    <span className="text-sm">Workout Completed</span>
                  </div>
                )}
                {entry.progress_data.diet_followed && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={16} />
                    <span className="text-sm">Diet Followed</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span>Energy: <span className="text-blue-400 font-bold">{entry.progress_data.energy_level}/10</span></span>
                  <span>Mood: <span className="text-purple-400 font-bold">{entry.progress_data.mood}</span></span>
                  {entry.progress_data.weight_kg && (
                    <span>Weight: <span className="text-emerald-400 font-bold">{entry.progress_data.weight_kg} kg</span></span>
                  )}
                </div>
                {entry.progress_data.notes && (
                  <p className="text-sm text-slate-400 italic mt-2">"{entry.progress_data.notes}"</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card title="No Progress Entries Yet" color="text-slate-400">
          <p className="text-slate-400 text-sm">Start tracking your progress by logging your daily activities!</p>
        </Card>
      )}
    </div>
  );
};

export default PlanViewer;
