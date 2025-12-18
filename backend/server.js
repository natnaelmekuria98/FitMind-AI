require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const OpenAI = require('openai');

const app = express();

// Validate API Keys
if (!process.env.GOOGLE_API_KEY) {
  console.error("WARNING: GOOGLE_API_KEY is missing in your .env file!");
} else {
  console.log("SUCCESS: GOOGLE_API_KEY loaded successfully.");
}

if (!process.env.OPENAI_API_KEY) {
  console.error("WARNING: OPENAI_API_KEY is missing in your .env file!");
} else {
  console.log("SUCCESS: OPENAI_API_KEY loaded successfully.");
}

app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST"],
  credentials: false 
})); 

app.use(express.json());

// Initialize Gemini AI
let genAI = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Helper function to generate plan with Gemini
async function generateWithGemini(prompt) {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    generationConfig: { 
      responseMimeType: "application/json" 
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ]
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// Helper function to generate plan with OpenAI
async function generateWithOpenAI(prompt) {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a fitness and nutrition expert. Always respond with valid JSON only, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content.trim();
  return JSON.parse(text);
}


app.post('/api/generate-plan', async (req, res) => {
  const requestId = Date.now().toString(36);
  const { name, goal, level, dietary, model: selectedModel = 'gemini', age, gender, weight, location } = req.body;
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📋 [BACKEND] Plan Generation Request #${requestId}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`👤 User: ${name || 'Unknown'}`);
  console.log(`🎯 Goal: ${goal || 'Not specified'}`);
  console.log(`📊 Level: ${level || 'Not specified'}`);
  console.log(`🍽️  Dietary: ${dietary || 'Not specified'}`);
  console.log(`🤖 AI Model: ${selectedModel}`);
  console.log(`📝 Additional Info: Age=${age || 'N/A'}, Gender=${gender || 'N/A'}, Weight=${weight || 'N/A'}kg, Location=${location || 'N/A'}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('───────────────────────────────────────────────────────────');

  const prompt = `
    Generate a fitness and diet plan for:
    User: ${name}, Goal: ${goal}, Level: ${level}, Diet: ${dietary}.
    
    Return a JSON object with this specific schema:
    {
      "motivation": "string",
      "tips": ["string", "string"],
      "weekly_workout": [
        { "day": "string", "exercises": [{ "name": "string", "sets": "string", "reps": "string", "rest": "string" }] }
      ],
      "weekly_diet": [
        { "day": "string", "meals": { "breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string" } }
      ]
    }
  `;

  const startTime = Date.now();
  try {
    let plan;
    
    // Route to appropriate model based on selection
    if (selectedModel === 'openai') {
      console.log(`🤖 [BACKEND] Using OpenAI GPT-4o Mini model...`);
      plan = await generateWithOpenAI(prompt);
    } else {
      console.log(`🤖 [BACKEND] Using Google Gemini 2.5 Flash model...`);
      plan = await generateWithGemini(prompt);
    }

    const duration = Date.now() - startTime;
    
    console.log(`✅ [BACKEND] Plan generated successfully in ${duration}ms`);
    console.log(`✅ [BACKEND] Plan structure:`, {
      hasMotivation: !!plan.motivation,
      tipsCount: plan.tips?.length || 0,
      workoutDays: plan.weekly_workout?.length || 0,
      dietDays: plan.weekly_diet?.length || 0,
      totalExercises: plan.weekly_workout?.reduce((sum, day) => sum + (day.exercises?.length || 0), 0) || 0
    });
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ [BACKEND] Request #${requestId} completed successfully`);
    console.log('═══════════════════════════════════════════════════════════\n');

    res.json(plan);
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error('═══════════════════════════════════════════════════════════');
    console.error(`❌ [BACKEND] Plan Generation Failed #${requestId}`);
    console.error('═══════════════════════════════════════════════════════════');
    console.error(`⏱️  Duration: ${duration}ms`);
    console.error(`❌ Error Type: ${err.constructor.name}`);
    console.error(`❌ Error Message: ${err.message}`);
    
    if (err.response) {
      console.error(`❌ Response Status: ${err.response.status}`);
      console.error(`❌ Response Data:`, err.response.data);
    }
    
    if (err.stack) {
      console.error(`❌ Stack Trace:`, err.stack);
    }
    console.error('═══════════════════════════════════════════════════════════\n');
    
    // Handle Gemini-specific errors
    if (err.response && err.response.promptFeedback && err.response.promptFeedback.blockReason) {
        return res.status(500).json({ error: "Blocked by safety settings." });
    }
    
    // Handle OpenAI-specific errors
    if (err.message && err.message.includes("API key")) {
        return res.status(500).json({ error: `API key not configured for ${selectedModel}.` });
    }
    
    res.status(500).json({ error: `Failed to generate plan using ${selectedModel}. ${err.message || ''}` });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " fitness gym realistic lighting")}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Image Gen Error:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Text-to-Speech endpoint using OpenAI TTS
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!openai) {
      return res.status(500).json({ error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file." });
    }

    console.log(`Generating speech for text (${text.length} characters)...`);

    // Use OpenAI TTS API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Options: "tts-1" (faster, cheaper) or "tts-1-hd" (higher quality)
      voice: "alloy", // Options: "alloy", "echo", "fable", "onyx", "nova", "shimmer"
      input: text,
    });

    // Convert response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    
    // Send the audio buffer
    res.send(buffer);
    console.log("Speech generated successfully.");
  } catch (error) {
    console.error("Voice Generation Error:", error);
    res.status(500).json({ error: "Failed to generate speech. " + (error.message || '') });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 FitMind AI Backend Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📡 Available endpoints:`);
  console.log(`   - POST /api/generate-plan`);
  console.log(`   - POST /api/generate-image`);
  console.log(`   - POST /api/generate-voice`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════════════════\n');
});