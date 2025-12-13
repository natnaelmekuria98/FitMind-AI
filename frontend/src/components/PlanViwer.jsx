import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Image as ImageIcon, RefreshCw, Dumbbell, Utensils } from 'lucide-react';
import jsPDF from 'jspdf';


const PlanViewer = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'diet'
  const [modalImage, setModalImage] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);


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
      }, 1);
    };

  // Handle Voice
  // inside PlanViewer.jsx

const handleVoice = () => {
  // 1. Stop any audio currently playing
  window.speechSynthesis.cancel();

  // 2. Format the text to be readable (Human style, not JSON style)
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

  // 3. Create the Speech Object
  const utterance = new SpeechSynthesisUtterance(textToRead);
  
  // Optional: Customize voice
  utterance.rate = 0.9; // Slightly slower
  utterance.pitch = 1;

  // 4. Speak
  window.speechSynthesis.speak(utterance);
};

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Personal AI Plan</h1>
          <p className="text-blue-400 italic">"{plan.motivation}"</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button onClick={handleExport} className="btn-icon"><Download size={20}/></button>
          <button onClick={onReset} className="btn-icon"><RefreshCw size={20}/></button>
        </div>
      </div>

      {audioUrl && <audio controls autoPlay src={audioUrl} className="w-full mb-6" />}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-700 pb-1">
        <TabButton active={activeTab === 'workout'} onClick={() => setActiveTab('workout')} icon={<Dumbbell size={18}/>} label="Workout" />
        <TabButton active={activeTab === 'diet'} onClick={() => setActiveTab('diet')} icon={<Utensils size={18}/>} label="Diet" />
        
        <button onClick={handleVoice} className="ml-auto flex items-center gap-2 text-sm text-blue-400 hover:text-white transition-colors">
          <Play size={16} /> Read Day 1
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content List */}
        <div className="md:col-span-2 space-y-4">
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
              ) : (
                plan.weekly_diet.map((day, idx) => (
                  <Card key={idx} title={day.day} color="text-emerald-400">
                    {Object.entries(day.meals).map(([type, meal], i) => (
                      <RowItem key={i} title={type.toUpperCase()} sub={meal} onImg={() => handleImgGen(meal)} />
                    ))}
                  </Card>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar: Tips & Image Preview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h4 className="font-bold text-lg mb-4 text-white">Coach Tips</h4>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-2">
              {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 min-h-[300px] flex items-center justify-center relative overflow-hidden">
            {loadingImg && <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10"><RefreshCw className="animate-spin text-white"/></div>}
            {modalImage ? (
               <img src={modalImage} alt="Generated" className="w-full h-full object-cover rounded-xl shadow-lg" />
            ) : (
              <div className="text-center text-slate-500">
                <ImageIcon size={48} className="mx-auto mb-2 opacity-50"/>
                <p className="text-sm">Click an image icon <br/> to generate visuals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all ${active ? 'bg-slate-800 text-white border-t border-x border-slate-700' : 'text-slate-400 hover:text-white'}`}
  >
    {icon} {label}
  </button>
);

const Card = ({ title, children, color = "text-blue-400" }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-4 shadow-sm hover:shadow-md transition-shadow">
    <h3 className={`text-xl font-bold ${color} mb-4 border-b border-slate-700 pb-2`}>{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const RowItem = ({ title, sub, onImg }) => (
  <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors group">
    <div>
      <p className="font-semibold text-slate-200">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
    <button onClick={onImg} className="p-2 text-slate-600 group-hover:text-blue-400 transition-colors bg-slate-800 rounded-full hover:bg-slate-700">
      <ImageIcon size={18} />
    </button>
  </div>
);

export default PlanViewer;