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
  const { name, goal, level, dietary, model: selectedModel = 'gemini' } = req.body;
  
  console.log(`Generating plan for: ${name} (${goal}) using ${selectedModel}...`);

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

  try {
    let plan;
    
    // Route to appropriate model based on selection
    if (selectedModel === 'openai') {
      plan = await generateWithOpenAI(prompt);
    } else {
      // Default to Gemini
      plan = await generateWithGemini(prompt);
    }

    res.json(plan);
    console.log(`Plan generated successfully using ${selectedModel}.`);
  } catch (err) {
    console.error("Backend Error Details:", err);
    
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));