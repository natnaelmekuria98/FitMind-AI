# Text-to-Speech API Options for FitMind AI
# this is my voice 
This document outlines various TTS API options you can use instead of the browser's Web Speech API.

## ✅ Currently Implemented: OpenAI TTS

**Status**: ✅ Implemented and ready to use

**Cost**: $15 per 1M characters (~$0.015 per 1K characters)
- Very affordable for most use cases
- Example: 1,000 characters = $0.015 (less than 2 cents)

**Quality**: Excellent, natural-sounding voices

**Setup Required**:
1. You already have `OPENAI_API_KEY` in your backend `.env`
2. The endpoint is already implemented at `/api/generate-voice`
3. Frontend is already configured to use it

**Voice Options** (in `backend/server.js`):
- `"alloy"` - Neutral, balanced voice
- `"echo"` - Clear, confident voice
- `"fable"` - Warm, friendly voice
- `"onyx"` - Deep, authoritative voice
- `"nova"` - Bright, energetic voice (recommended for fitness)
- `"shimmer"` - Soft, gentle voice

**Model Options**:
- `"tts-1"` - Faster, cheaper (current default)
- `"tts-1-hd"` - Higher quality, slightly more expensive

---

## Alternative Options

### 1. ElevenLabs TTS (Best Quality)

**Cost**: 
- Free tier: 10,000 characters/month
- Paid: $5/month for 30,000 characters
- $0.30 per 1,000 characters after free tier

**Quality**: ⭐⭐⭐⭐⭐ Excellent, most natural voices

**Implementation**:

```bash
# Install package
cd backend
npm install elevenlabs
```

**Backend Code** (`backend/server.js`):
```javascript
const { ElevenLabsClient } = require("elevenlabs");

// Initialize (add to top of file)
let elevenlabs = null;
if (process.env.ELEVENLABS_API_KEY) {
  elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });
}

// Replace the /api/generate-voice endpoint:
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!elevenlabs) {
      return res.status(500).json({ error: "ElevenLabs API key not configured" });
    }

    // Generate audio
    const audio = await elevenlabs.generate({
      voice: "Rachel", // Options: Rachel, Domi, Bella, Antoni, Elli, Josh, Arnold, Adam, Sam
      text: text,
      model_id: "eleven_monolingual_v1", // or "eleven_multilingual_v1"
    });

    // Convert to buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error("ElevenLabs Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});
```

**Setup**:
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get API key from dashboard
3. Add to `backend/.env`: `ELEVENLABS_API_KEY=your_key_here`

---

### 2. Google Cloud Text-to-Speech (Best Free Tier)

**Cost**: 
- Free tier: 0-4 million characters/month
- After free tier: $4 per 1M characters

**Quality**: ⭐⭐⭐⭐ Very good

**Implementation**:

```bash
# Install package
cd backend
npm install @google-cloud/text-to-speech
```

**Backend Code** (`backend/server.js`):
```javascript
const textToSpeech = require('@google-cloud/text-to-speech');
const { Readable } = require('stream');

// Initialize (add to top of file)
let gcpTTS = null;
if (process.env.GOOGLE_TTS_CREDENTIALS) {
  const credentials = JSON.parse(process.env.GOOGLE_TTS_CREDENTIALS);
  gcpTTS = new textToSpeech.TextToSpeechClient({ credentials });
}

// Replace the /api/generate-voice endpoint:
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!gcpTTS) {
      return res.status(500).json({ error: "Google Cloud TTS not configured" });
    }

    const request = {
      input: { text: text },
      voice: { 
        languageCode: 'en-US', 
        name: 'en-US-Neural2-D', // Options: en-US-Neural2-A through J, en-US-Standard-A through F
        ssmlGender: 'NEUTRAL' 
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await gcpTTS.synthesizeSpeech(request);
    const buffer = Buffer.from(response.audioContent, 'base64');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error("Google Cloud TTS Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});
```

**Setup**:
1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Text-to-Speech API
3. Create service account and download JSON key
4. Add to `backend/.env`: `GOOGLE_TTS_CREDENTIALS='{"type":"service_account",...}'` (as single-line JSON string)

---

### 3. Amazon Polly (AWS) (Generous Free Tier)

**Cost**: 
- Free tier: 5 million characters/month (first 12 months)
- After free tier: $4 per 1M characters

**Quality**: ⭐⭐⭐⭐ Very good, neural voices available

**Implementation**:

```bash
# Install package
cd backend
npm install @aws-sdk/client-polly
```

**Backend Code** (`backend/server.js`):
```javascript
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

// Initialize (add to top of file)
let polly = null;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  polly = new PollyClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// Replace the /api/generate-voice endpoint:
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!polly) {
      return res.status(500).json({ error: "AWS Polly not configured" });
    }

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna', // Options: Joanna, Matthew, Amy, Brian, Emma, etc.
      Engine: 'neural', // Options: 'standard' or 'neural' (better quality)
    });

    const response = await polly.send(command);
    const buffer = Buffer.from(await response.AudioStream.transformToByteArray());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error("AWS Polly Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});
```

**Setup**:
1. Create AWS account
2. Go to IAM and create access keys
3. Add to `backend/.env`:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

---

### 4. Unreal Speech (Lowest Cost)

**Cost**: $0.25 per 1M characters (very cheap!)

**Quality**: ⭐⭐⭐⭐ Good quality

**Implementation**:

```bash
# No special package needed, uses axios (already installed)
```

**Backend Code** (`backend/server.js`):
```javascript
const axios = require('axios');

// Replace the /api/generate-voice endpoint:
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!process.env.UNREAL_SPEECH_API_KEY) {
      return res.status(500).json({ error: "Unreal Speech API key not configured" });
    }

    const response = await axios.post(
      'https://api.v6.unrealspeech.com/speech',
      {
        Text: text,
        VoiceId: 'Scarlett', // Options: Scarlett, Dan, Liv, Will, Amy
        Bitrate: '192k',
        Speed: '0',
        Pitch: '1.0',
        Codec: 'libmp3lame',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.UNREAL_SPEECH_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const buffer = Buffer.from(response.data);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error("Unreal Speech Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});
```

**Setup**:
1. Sign up at [Unreal Speech](https://unrealspeech.com/)
2. Get API key from dashboard
3. Add to `backend/.env`: `UNREAL_SPEECH_API_KEY=your_key_here`

---

## Comparison Table

| Service | Free Tier | Paid Cost | Quality | Setup Difficulty |
|---------|-----------|-----------|---------|------------------|
| **OpenAI TTS** ✅ | None | $15/1M chars | ⭐⭐⭐⭐⭐ | Easy (already set up) |
| **ElevenLabs** | 10K/month | $5/month (30K) | ⭐⭐⭐⭐⭐ | Easy |
| **Google Cloud** | 4M/month | $4/1M chars | ⭐⭐⭐⭐ | Medium |
| **Amazon Polly** | 5M/month | $4/1M chars | ⭐⭐⭐⭐ | Medium |
| **Unreal Speech** | None | $0.25/1M chars | ⭐⭐⭐⭐ | Easy |

## Recommendation

1. **For best quality**: Use **ElevenLabs** (if free tier is enough) or **OpenAI TTS** (current implementation)
2. **For free usage**: Use **Google Cloud TTS** or **Amazon Polly** (generous free tiers)
3. **For lowest cost**: Use **Unreal Speech** ($0.25/1M is extremely cheap)

## Current Implementation

The project currently uses **OpenAI TTS** which is:
- ✅ Already configured (you have OpenAI API key)
- ✅ High quality voices
- ✅ Very affordable ($15/1M characters)
- ✅ Easy to use

To switch to a different provider, simply replace the `/api/generate-voice` endpoint code in `backend/server.js` with one of the implementations above.

