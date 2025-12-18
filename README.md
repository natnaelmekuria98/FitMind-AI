# 🏋️‍♂️ FitMind AI - Your Personal AI Fitness Coach

> **Transform your fitness journey with the power of artificial intelligence.** FitMind AI is an intelligent, personalized fitness companion that creates custom workout routines and nutrition plans tailored specifically to your goals, body type, and lifestyle.

[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Overview

FitMind AI revolutionizes personal fitness planning by leveraging cutting-edge AI technology to deliver comprehensive, science-backed workout and nutrition programs. Whether you're a beginner taking your first steps toward a healthier lifestyle or an advanced athlete seeking optimization, our platform adapts to your unique needs and preferences.

**Powered by Google Gemini AI and OpenAI**, FitMind AI analyzes your personal information—including fitness goals, current level, dietary preferences, and workout location—to generate detailed 7-day plans that evolve with you. Every plan is crafted with precision, motivation, and actionable insights to help you achieve sustainable results.

With secure authentication, cloud-based plan storage, and progress tracking, FitMind AI becomes your trusted companion on the path to a healthier, stronger you.

---

## 🌟 Key Features

### 🎯 **Intelligent Personalization**
- **AI-Powered Plan Generation**: Advanced LLM technology creates custom workout and diet schedules based on your specific profile
- **Multiple AI Models**: Choose between Google Gemini 2.5 Flash or OpenAI GPT-4o Mini for plan generation
- **Adaptive Recommendations**: Plans adjust to your fitness level, goals, and constraints
- **Multi-Goal Support**: Weight loss, muscle gain, endurance training, and more

### 🔐 **Secure Authentication & User Management**
- **Clerk Integration**: Enterprise-grade authentication with social login options
- **User Profiles**: Personalized experience with saved preferences and history
- **Secure Data Storage**: All your fitness data is safely stored and encrypted

### 💾 **Cloud-Based Plan Management**
- **Supabase Database**: Save unlimited fitness plans to your personal account
- **Plan History**: Access and revisit all your previously generated plans
- **Progress Tracking**: Log daily workouts, meals, energy levels, and mood
- **Statistics Dashboard**: Track your fitness journey with comprehensive analytics

### 🖼️ **Visual Learning**
- **AI-Generated Exercise Images**: Real-time visual generation for exercises and meals using Pollinations.ai
- **Interactive Image Gallery**: Click any exercise or meal to see realistic, high-quality visuals
- **Enhanced Understanding**: Visual aids help you perform exercises correctly and visualize your nutrition

### 🔊 **Voice Assistant**
- **Audio Guidance**: Built-in text-to-speech reads your daily workout and meal plans
- **Hands-Free Experience**: Perfect for gym sessions when you can't look at your phone
- **Browser-Native Technology**: No external API costs, powered by Web Speech API

### 📄 **Professional PDF Export**
- **Downloadable Plans**: Export your complete fitness plan as a beautifully formatted PDF
- **Multi-Page Documents**: Comprehensive plans with automatic page breaks and professional styling
- **Offline Access**: Take your plan anywhere, even without internet connection

### 📊 **Progress Tracking**
- **Daily Logging**: Record workout completion, diet adherence, energy levels, and mood
- **Weight Tracking**: Monitor your progress with optional weight logging
- **Progress History**: View your complete fitness journey over time
- **Visual Analytics**: See your improvement trends and patterns

### 🎨 **Modern User Experience**
- **Sleek, Dark Theme UI**: Eye-friendly dark interface designed for focus and motivation
- **Smooth Animations**: Fluid transitions powered by Framer Motion
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean, user-friendly interface that guides you through your journey

### 💡 **Smart Coaching**
- **Motivational Messages**: Personalized encouragement tailored to your goals
- **Pro Tips**: Expert advice and best practices integrated into every plan
- **Progress Insights**: Get actionable feedback based on your tracking data

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.1** - Modern UI library with latest features
- **Create React App** - Optimized build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12.23** - Production-ready motion library for React
- **React Router 7.10** - Declarative routing for React applications
- **Axios** - Promise-based HTTP client for API communication
- **jsPDF** - Client-side PDF generation
- **Lucide React** - Beautiful, customizable icon library
- **Clerk React** - Authentication and user management
- **Supabase JS** - Real-time database and backend services

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.2** - Fast, unopinionated web framework
- **Google Gemini AI 2.5 Flash** - Advanced AI model for intelligent plan generation
- **OpenAI GPT-4o Mini** - Alternative AI model option
- **CORS** - Cross-origin resource sharing support
- **dotenv** - Environment variable management

### External Services
- **Google Gemini API** - AI-powered text generation
- **OpenAI API** - Alternative AI text generation
- **Pollinations.ai** - AI image generation for exercises and meals
- **Supabase** - PostgreSQL database with real-time capabilities
- **Clerk** - Authentication and user management platform

---

## 📁 Project Structure

```
FitMind-AI/
├── backend/
│   ├── server.js              # Express server and API endpoints
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (create this)
│
└── frontend/
    ├── public/                # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── Hero.jsx       # Landing page hero section
    │   │   ├── UserForm.jsx   # User input form
    │   │   ├── PlanViwer.jsx  # Plan display with progress tracking
    │   │   ├── Dashboard.jsx  # Main dashboard with saved plans
    │   │   ├── SignIn.jsx     # Authentication sign-in page
    │   │   └── SignUp.jsx     # Authentication sign-up page
    │   ├── services/
    │   │   └── supabase.js    # Supabase database service functions
    │   ├── Api/
    │   │   └── data.js        # API service functions
    │   ├── App.jsx            # Main application component with routing
    │   ├── App.css            # Application styles
    │   ├── index.js           # React entry point with ClerkProvider
    │   └── index.css          # Global styles
    ├── package.json           # Frontend dependencies
    ├── tailwind.config.js     # Tailwind configuration
    ├── postcss.config.js     # PostCSS configuration
    └── .env                   # Environment variables (create this)
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Google Gemini API Key** (optional) - [Get one here](https://aistudio.google.com/)
- **OpenAI API Key** (optional) - [Get one here](https://platform.openai.com/api-keys)
- **Clerk Account** - [Sign up here](https://clerk.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd FitMind-AI
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env
```

**Configure your `backend/.env` file:**

```env
PORT=5000
GOOGLE_API_KEY=your_google_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: You can use either one or both API keys. The application will use the selected model from the frontend dropdown. If a model's API key is missing, you'll see a warning but the server will still run with the available models.

**Start the backend server:**

```bash
node server.js
```

You should see: `Backend running on port 5000` ✅

#### 3. Frontend Setup

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env
```

**Configure your `frontend/.env` file:**

```env
# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase Database
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Important**: 
> - Get your Clerk publishable key from your [Clerk Dashboard](https://dashboard.clerk.com/)
> - Get your Supabase URL and anon key from your [Supabase Project Settings](https://app.supabase.com/project/_/settings/api)

**Start the development server:**

```bash
npm start
```

The application will open at `http://localhost:3000` (or the port shown in your terminal).

> **Tip**: Keep both terminals open—one for the backend server and one for the frontend development server.

---

## 🗄️ Database Setup (Supabase)

To enable plan saving and progress tracking, you need to set up the following tables in your Supabase database:

### 1. User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT,
  weight_kg DECIMAL(5,2),
  fitness_goal TEXT,
  fitness_level TEXT,
  workout_location TEXT,
  dietary_preference TEXT,
  preferred_ai_model TEXT DEFAULT 'gemini',
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields Description:**
- `clerk_user_id`: Unique identifier from Clerk authentication
- `first_name`, `last_name`, `email`: User's basic information
- `age`: User's age
- `gender`: User's gender (Male, Female, Other)
- `weight_kg`: Current weight in kilograms
- `fitness_goal`: Primary fitness goal (Weight Loss, Muscle Gain, Endurance, etc.)
- `fitness_level`: Current fitness level (Beginner, Intermediate, Advanced)
- `workout_location`: Where user works out (Gym, Home)
- `dietary_preference`: Dietary restrictions/preferences (Non-Veg, Veg, Vegan, Keto, etc.)
- `preferred_ai_model`: Preferred AI model for plan generation (gemini, openai)
- `form_data`: Complete form data stored as JSON for easy access

### 2. Fitness Plans Table

```sql
CREATE TABLE fitness_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL REFERENCES user_profiles(clerk_user_id),
  plan_data JSONB NOT NULL,
  plan_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fitness_plans_user ON fitness_plans(clerk_user_id);
```

### 3. Progress Tracking Table

```sql
CREATE TABLE progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL REFERENCES user_profiles(clerk_user_id),
  fitness_plan_id UUID REFERENCES fitness_plans(id),
  progress_data JSONB NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_progress_tracking_user ON progress_tracking(clerk_user_id);
CREATE INDEX idx_progress_tracking_plan ON progress_tracking(fitness_plan_id);
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can view own plans" ON fitness_plans
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can insert own plans" ON fitness_plans
  FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can view own progress" ON progress_tracking
  FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can insert own progress" ON progress_tracking
  FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);
```

> **Note**: Since we're using Clerk for authentication, you may need to adjust the RLS policies based on your authentication setup. The current implementation uses `clerk_user_id` for data isolation.

---

## 📡 API Endpoints

### Generate Fitness Plan

**POST** `/api/generate-plan`

Generates a personalized 7-day workout and diet plan based on user input.

**Request Body:**
```json
{
  "name": "John Doe",
  "age": "28",
  "gender": "Male",
  "weight": "75",
  "goal": "Weight Loss",
  "level": "Intermediate",
  "location": "Gym",
  "dietary": "Non-Veg",
  "model": "gemini"
}
```

**Parameters:**
- `model` (optional): Select the LLM model to use. Options: `"gemini"` (default) or `"openai"`

**Response:**
```json
{
  "motivation": "Your personalized motivational message...",
  "tips": ["Tip 1", "Tip 2", "..."],
  "weekly_workout": [
    {
      "day": "Monday",
      "exercises": [
        {
          "name": "Squats",
          "sets": "3",
          "reps": "12",
          "rest": "60s"
        }
      ]
    }
  ],
  "weekly_diet": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": "Oatmeal with fruits",
        "lunch": "Grilled chicken with vegetables",
        "dinner": "Salmon with quinoa",
        "snacks": "Greek yogurt"
      }
    }
  ]
}
```

### Generate Image

**POST** `/api/generate-image`

Generates an AI image for exercises or meals.

**Request Body:**
```json
{
  "prompt": "Squats exercise"
}
```

**Response:**
```json
{
  "imageUrl": "https://image.pollinations.ai/prompt/..."
}
```

---

## 🎯 Usage Guide

### Step 1: Sign Up / Sign In
1. Launch the application and you'll be redirected to the sign-in page
2. Create a new account or sign in with your existing credentials
3. You can use email/password or social login options (if configured in Clerk)

### Step 2: Enter Your Information
Fill out the user form with:
- **Personal Details**: Name, age, gender, weight
- **Fitness Goals**: Weight loss, muscle gain, or endurance
- **Current Level**: Beginner, intermediate, or advanced
- **Workout Location**: Gym or home
- **Dietary Preferences**: Non-vegetarian, vegetarian, vegan, or keto
- **AI Model**: Choose between Gemini or OpenAI (if both are configured)

### Step 3: Generate Your Plan
Click **"Generate My Plan"** and wait for the AI to create your personalized program. The plan will be automatically saved to your account.

### Step 4: Explore Your Plan
- **View Workouts**: Browse your 7-day workout routine with detailed exercises
- **View Diet**: Check your daily meal plans
- **Track Progress**: Use the Progress tab to log your daily activities, energy levels, and mood
- **Generate Images**: Click the image icon next to any exercise or meal to see visual representations
- **Listen to Plan**: Use the voice assistant to hear your Day 1 plan
- **Export PDF**: Download your complete plan as a professional PDF document

### Step 5: Manage Your Plans
- **View Saved Plans**: Access all your previously generated plans from the dashboard
- **Load Previous Plans**: Click on any saved plan to view and continue tracking progress
- **Create New Plans**: Generate new plans as your goals evolve

---

## 🔧 Configuration

### Backend Port
If you need to change the backend port, update the `PORT` variable in `backend/.env`:

```env
PORT=5000  # Change to your preferred port
```

### Frontend API URL
If your backend runs on a different port or domain, update the API base URL in `frontend/src/Api/data.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';  // Update this
```

### Google Gemini Model
The backend uses `gemini-2.5-flash` by default. If this model is unavailable in your region, you can switch to `gemini-pro` in `backend/server.js`:

```javascript
model: "gemini-pro",  // Fallback option
```

### Clerk Configuration
Configure your Clerk application settings in the [Clerk Dashboard](https://dashboard.clerk.com/):
- Set up sign-in and sign-up URLs
- Configure social providers (Google, GitHub, etc.)
- Customize email templates and branding

### Supabase Configuration
Ensure your Supabase project has:
- Row Level Security (RLS) enabled on all tables
- Proper policies set up for data access
- API keys properly configured

---

## 🐛 Troubleshooting

### Backend Issues

**❌ "GOOGLE_API_KEY is missing"**
- Ensure your `.env` file exists in the `backend` directory
- Verify the API key is correctly formatted (no quotes, no spaces)
- Restart the server after adding the key

**❌ "404 Not Found" (Gemini API)**
- Check if `gemini-2.5-flash` is available in your region
- Switch to `gemini-pro` as a fallback (see Configuration section)
- Verify your API key is valid and has sufficient quota

**❌ CORS Errors**
- Ensure CORS is enabled in `server.js`
- Verify the frontend URL matches the CORS origin settings
- Check that both servers are running

### Frontend Issues

**❌ "Failed to generate plan"**
- Verify the backend server is running on port 5000
- Check the browser console for detailed error messages
- Ensure the API URL in `src/Api/data.js` matches your backend URL

**❌ "supabaseUrl is required"**
- Ensure your `.env` file exists in the `frontend` directory
- Verify environment variables are prefixed with `REACT_APP_`
- **Restart your development server** after adding/changing `.env` variables (Create React App only loads env vars on startup)

**❌ Clerk Authentication Errors**
- Verify `REACT_APP_CLERK_PUBLISHABLE_KEY` is set in your `.env` file
- Check that your Clerk application is properly configured
- Ensure the publishable key matches your Clerk application

**❌ Supabase Connection Errors**
- Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set
- Check that your Supabase project is active
- Ensure database tables are created and RLS policies are configured

**❌ Framer Motion Version Errors**
- Run: `npm install framer-motion@latest react@latest`
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**❌ Images Not Loading**
- Check your internet connection (Pollinations.ai requires internet)
- Verify the image generation endpoint is accessible
- Try refreshing the page

---

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variables in the platform's dashboard:
   - `REACT_APP_CLERK_PUBLISHABLE_KEY`
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Deploy!

### Backend Deployment (Render/Railway)

1. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables:
   - `GOOGLE_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `PORT`: 5000 (or your preferred port)
5. Update the frontend API URL to point to your deployed backend
6. Deploy!

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements, your help makes FitMind AI better for everyone.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all environment variables are documented

---

## 📝 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent plan generation
- **OpenAI** for providing alternative AI model options
- **Pollinations.ai** for providing AI-generated images
- **Supabase** for robust database infrastructure
- **Clerk** for seamless authentication solutions
- **React Community** for amazing tools and libraries
- **Open Source Contributors** who make projects like this possible

---

## 🎯 Future Enhancements

We're constantly improving FitMind AI. Here's what's coming next:

- [ ] Video demonstrations for exercises
- [ ] Meal recipe details with cooking instructions
- [ ] Integration with fitness wearables (Fitbit, Apple Watch)
- [ ] Social features and community challenges
- [ ] Advanced analytics and progress visualization
- [ ] Multi-language support
- [ ] Mobile app (iOS & Android)
- [ ] AI-powered form corrections and suggestions
- [ ] Custom workout plan templates
- [ ] Nutrition calculator and macro tracking

---

## 💬 Support

Need help? Have questions? We're here for you!

- 🐛 **Issues**: Report bugs and request features through GitHub Issues
- 📖 **Documentation**: Check this README and inline code comments
- 💡 **Questions**: Open a discussion in the repository

---

<div align="center">

### 🌟 **Start Your Transformation Today** 🌟

*"The only bad workout is the one that didn't happen."*

**Built with ❤️ and AI**

[⭐ Star us on GitHub](#) | [🐛 Report Bug](#) | [💡 Request Feature](#)

</div>
# FItMindAI
# FItMindAI
