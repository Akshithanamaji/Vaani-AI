# Python Speech-to-Text Implementation

This is a Python conversion of your JavaScript/TypeScript speech-to-text functionality using Groq's Whisper API.

## 🔄 What Was Converted

✅ **From JavaScript/TypeScript:**
- Next.js API route (`/api/speech-to-text/route.ts`)
- Groq transcription utility (`lib/groq-transcription.ts`)

✅ **To Python:**
- `speech_to_text.py` - Core speech-to-text class
- `flask_stt_server.py` - Flask API server (replaces Next.js route)
- `stt_examples.py` - Usage examples and integration guide

## 📁 Files Created

| File | Purpose |
|------|---------|
| `speech_to_text.py` | Core `GroqSpeechToText` class with all transcription logic |
| `flask_stt_server.py` | Flask API server that mimics your Next.js API route |
| `requirements.txt` | Python dependencies |
| `stt_examples.py` | Usage examples and setup guide |

## 🚀 Quick Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Groq API key:**
   ```bash
   # Windows
   set GROQ_API_KEY=your_groq_api_key_here
   
   # Linux/Mac
   export GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the Flask server:**
   ```bash
   python flask_stt_server.py
   ```

4. **Test it works:**
   ```bash
   curl http://localhost:5000/health
   ```

## 💻 Usage Options

### Option 1: Direct Python Usage
```python
from speech_to_text import GroqSpeechToText

stt = GroqSpeechToText()
result = stt.transcribe_from_file("audio.wav", language="hi", field_name="name")
print(result["text"])
```

### Option 2: API Server (Drop-in Replacement)
The Flask server provides the exact same API as your Next.js route:

```javascript
// Your existing frontend code works unchanged!
const response = await fetch('http://localhost:5000/api/speech-to-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        audio: base64Audio,
        mimeType: 'audio/wav',
        language: 'hi',
        fieldName: 'name'
    }),
});
```

## ✨ Features Preserved

- ✅ All field-specific context prompts for better accuracy
- ✅ Support for multiple audio formats (wav, mp3, ogg, webm, mp4)
- ✅ Same error handling and rate limiting messages
- ✅ Identical API interface as your Next.js implementation
- ✅ Hindi language support and other language codes
- ✅ Base64 audio processing
- ✅ File upload support (bonus feature in Python version)

## 🔧 Integration

Simply update your frontend fetch URLs from:
```
/api/speech-to-text
```

To:
```
http://localhost:5000/api/speech-to-text
```

Everything else remains the same!

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/speech-to-text` | POST | Transcribe base64 audio (original API) |
| `/api/speech-to-text/file` | POST | Transcribe uploaded file (bonus) |
| `/health` | GET | Health check |
| `/` | GET | API information |

## 🎯 Benefits of Python Version

1. **Standalone Service** - Can run independently of Next.js
2. **Better Error Handling** - More detailed error messages
3. **File Upload Support** - Bonus feature for direct file processing
4. **Easy Deployment** - Simple Flask app, easy to containerize
5. **Same Performance** - Uses same Groq Whisper API under the hood

Run `python stt_examples.py` for detailed usage examples! 🚀