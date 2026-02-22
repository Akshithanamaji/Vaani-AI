# GROQ AI INTEGRATION SETUP GUIDE

## Step 1: Get Groq API Key
1. Visit: https://console.groq.com
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

## Step 2: Add to Environment Variables
Add this to your `.env.local` file:

```
GROQ_API_KEY=gsk_your_api_key_here
```

## Step 3: Supported Languages for Whisper Large v3
The Groq Whisper model supports the following languages:
- hi (Hindi)
- en (English)
- te (Telugu)
- ta (Tamil)
- bn (Bengali)
- ml (Malayalam)
- kn (Kannada)
- gu (Gujarati)
- or (Odia)
- pa (Punjabi)
- ur (Urdu)

## Step 4: Using in Your Code
```typescript
import { transcribeAudioWithGroq } from '@/lib/groq-transcription';

// In your component
const audioBlob = await recorder.stop(); // Your audio recording
const result = await transcribeAudioWithGroq(audioBlob, 'hi');

if (result.success) {
  console.log('Transcribed text:', result.text);
} else {
  console.error('Transcription error:', result.error);
}
```

## Step 5: Cost
Groq offers fast, affordable transcription:
- First 50 hours per month: FREE for Whisper
- After 50 hours: Very affordable pay-as-you-go pricing
- Check: https://console.groq.com/pricing

## API Response Format
```json
{
  "success": true,
  "text": "transcribed text here",
  "language": "hi",
  "raw": {
    "text": "transcribed text here"
  }
}
```

## Troubleshooting
1. **API Key Error**: Make sure `GROQ_API_KEY` is in `.env.local`
2. **Audio Format**: Supports WAV, MP3, OGG, FLAC, M4A
3. **Language Issues**: Specify correct language code in the request
4. **Rate Limiting**: Groq has generous limits - check console for details

## Files Created/Modified
- ✅ `/app/api/speech-to-text/route.ts` - API endpoint
- ✅ `/lib/groq-transcription.ts` - Utility functions
- ✅ `.env.local` - Add GROQ_API_KEY here

Integration complete! Start using Groq Whisper Large v3 now.
