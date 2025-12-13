# 🏋️‍♂️ AI Fitness Coach

An AI-powered web application that generates fully personalized workout routines and diet plans based on user goals, body 

type, and dietary preferences. Powered by **Google Gemini AI** or **OpenAI GPT-4o Mini** for intelligence and **Pollinations.ai** for visual generation.

# 🚀 Features

- **Personalized Plans:** Generates 7-day workout and diet schedules using LLMs.

- **Multiple AI Models:** Choose between Google Gemini 2.5 Flash or OpenAI GPT-4o Mini via dropdown selector.

- **AI Visuals:** Generates realistic images for exercises and meals on the fly.

- **Voice Assistant:** Reads out the workout plan using the Web Speech API.

- **PDF Export:** Download professional, multi-page PDF plans.

- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion animations.

# 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, jsPDF.

- **Backend:** Node.js, Express.js, Google Gemini API, OpenAI API.

- **External APIs:** Google Gemini (Text), OpenAI GPT-4o Mini (Text), Pollinations.ai (Images).

# 📂 Project Structure

```
/AI-Fitness-Coach-App
├── /backend
        └── /server.js
        └── /.env 
└── /frontend
         └── /src
         |     └── /components
         |              └── /Hero.jsx
         |              └── /PlainViewer.jsx     
         |               └── /UserForm.jsx
         └── /App.jsx
         └── /App.css
         └── /Index.js
         └── /Index.css
         └── /pakage.json
         └── /pakage-lock-json
         └── /redme.md
  
```
# ⚡ Quick Start

You need to run the Backend and Frontend in two separate terminals.

Terminal 1: Backend

code
Bash
```
cd backend
```
```
npm install
```
# Setup your .env file (see backend/README.md)
```
node server.js
```
Terminal 2: Frontend

code
Bash
```
cd frontend
```
```
npm install

```
```
npm run dev
```

2. Backend README

File Location: backend/README.md

code
Markdown

# 🧠 AI Fitness Coach - Backend

This is the server-side application for the AI Fitness Coach. It handles communication with the Google Gemini API to generate 

JSON-structured fitness data.

# ⚙️ Setup & Installation

1. **Navigate to the directory:**

```bash
   cd backend
```
Install dependencies:

code
Bash
```
npm install express cors dotenv @google/generative-ai openai
```

Configure Environment Variables:

Create a file named .env in the backend folder and add your API Keys:

code
Env
```
PORT=5000
# Get Google API key from https://aistudio.google.com/
GOOGLE_API_KEY=AIzaSyD_Your_Actual_Key_Here
# Get OpenAI API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-Your_Actual_Key_Here
```

**Note:** You can use either one or both API keys. The application will use the selected model from the frontend dropdown. If a model's API key is missing, you'll see a warning but the server will still run with the available models.

Run the Server:

code
Bash
```
node server.js
```

You should see: Backend running on port 5000

# 📡 API Endpoints

# 1. Generate Plan

POST /api/generate-plan

Body: { name, age, weight, goal, level, location, dietary, model }

**Parameters:**
- `model` (optional): Select the LLM model to use. Options: `"gemini"` (default) or `"openai"`

Response: JSON object containing weekly_workout, weekly_diet, motivation, and tips.

# 2. Generate Image
```
POST /api/generate-image
Body: { prompt: "Squats" }
Response: { imageUrl: "https://..." }
```
# AI Image Generation:

Note: Uses Pollinations.ai fallback.

# 🐛 Troubleshooting:

404 Not Found (Gemini):

Ensure you are using gemini-pro in server.js if gemini-1.5-flash is not available in your region.

CORS Errors:

Ensure cors is enabled in server.js for 
```
http://localhost:3000 (or 5173 depending on your Vite port).
```

# 3. Frontend README

**File Location:** `frontend/README.md`

# 🎨 AI Fitness Coach - Frontend

The user interface for the fitness application. Built with **Vite + React** for speed and performance.

# 📦 Setup & Installation

1. **Navigate to the directory:**

```
cd frontend
```

Install dependencies:

code
Bash
```
npm install axios framer-motion lucide-react jspdf
```
(If you encounter version errors with Framer Motion, run:
```
npm install framer-motion@latest react@latest)
```
Run the Development Server:

code
Bash
```
npm run dev
```
Open the link shown (usually 

```
http://localhost:5173 
``` 
or 3000) in your browser.

# 🔧 Configuration:

If your backend is running on a port other than 5000, update the API URL:
```
File: src/api/api.js
```

code
JavaScript
```
const API_BASE = "http://localhost:5000/api";
```

# 🌟 Key Features Implementation:

PDF Export: Uses jsPDF to render text and add automatic page breaks.

Voice: Uses window.speechSynthesis (Browser Native) to avoid API costs.

Animations: Uses framer-motion for page transitions (AnimatePresence).

Images: Fetches directly from Pollinations.ai using <img> tags to reduce backend load.

# 🖌️ Styling

Styles are handled via Tailwind CSS.

Main CSS: src/index.css

Theme Config: tailwind.config.js

# Image Overview:

1.Hero Section:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/400b8341-51a9-47fe-8b75-a02ffd1b49c4" />

2.Personal details:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7bb30ab8-3fce-4d7e-9560-df7ba4b7bc0f" />

3.AI Generating:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ed2823ca-6ab6-43f1-9d59-d2f178429ba2" />

4.Every Day Helath feature:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/3e407c2d-e58b-4a85-823b-3750f0e0150f" />

5.Image Grid Section:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/282daa5b-43ca-4e4e-be2a-3045dba2d30b" />

6.Diat Maintance:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7c3e138b-67e1-44ec-a7c8-fa973f7ad070" />

7.Image Grid Section:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/97e8fdc7-0335-4e8f-8e47-17c0f572a4f6" />

8.Health deatils PDF:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/e4b242ae-a0a6-4a86-a13a-19781a64f8e9" />

9.PDF Overview:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7271836f-8731-4912-a700-3b4dfeea2e95" />

10.Audio Play List:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/558a5bca-65ad-451a-9948-c2409390b552" />

11.Render Deployment in backend:

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d8e2d679-b88b-4434-9e91-574c15ea986a" />

# Help:

Frontend Deployment Link:

```
https://ai-fitness-coach-app-wl1r.vercel.app
```

Backend Deployment Link: 
```
https://ai-fitness-coach-app-project-48tt.onrender.com
```

GitHub Project Link:
```
https://github.com/dhamodharanECE/AI-Fitness-Coach-App.git
```

GitHub Link:
```
https://github.com/dhamodharanECE
```
Email Id:
```
dhamodharansece23@gmail.com
```

# FitMind-AI
