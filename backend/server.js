require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const app = express();
if (!process.env.GOOGLE_API_KEY) {
  console.error("CRITICAL ERROR: GOOGLE_API_KEY is missing in your .env file or Deployment Settings!");
} else {
  console.log("SUCCESS: GOOGLE_API_KEY loaded successfully.");
}

app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST"],
  credentials: false 
})); 

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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


app.post('/api/generate-plan', async (req, res) => {
  const { name, goal, level, dietary } = req.body;
  
  console.log(`Generating plan for: ${name} (${goal})...`);

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const plan = JSON.parse(text);

    res.json(plan);
    console.log("Plan generated successfully.");
  } catch (err) {
    console.error("Backend Error Details:", err);
    
    if (err.response && err.response.promptFeedback && err.response.promptFeedback.blockReason) {
        return res.status(500).json({ error: "Blocked by safety settings." });
    }
    res.status(500).json({ error: "Failed to generate plan." });
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