# Debugging the 400 Error

## What to Check

The 400 error means the server is receiving an empty or invalid text parameter. Let's debug this step by step.

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Look for these logs when you select Odia language:

**Expected logs:**
```
[GoogleTTS] Speaking text: "ଦୟାକରି ଆପଣଙ୍କର ପୂର୍ଣ୍ଣ ନାମ କୁହନ୍ତୁ..." in language: or-IN
[GoogleTTS] Proxy URL: /api/tts-proxy?text=...&lang=or
```

**If you see:**
```
[GoogleTTS] Empty text provided, skipping
```
This means the text is empty before reaching the TTS function.

### Step 2: Check Server Terminal

Look at the terminal running `npm run dev`:

**Expected logs:**
```
[TTS Proxy] Request received - text: ଦୟାକରି ଆପଣଙ୍କର ପୂର୍ଣ୍ଣ ନାମ କୁହନ୍ତୁ lang: or
[TTS Proxy] Fetching audio for language: or, text length: 35
[TTS Proxy] Successfully fetched audio, size: 12345 bytes
```

**If you see:**
```
[TTS Proxy] Missing or empty text parameter
```
This confirms the text is not being passed correctly.

### Step 3: Test the Proxy Directly

Open this URL in your browser:
```
http://localhost:3000/api/tts-proxy?text=ହେଲୋ&lang=or
```

**Expected:** Audio file should download
**If 400 error:** The proxy itself has an issue

### Step 4: Check the Voice Prompt API

Test if the backend is returning the Odia prompt:
```
http://localhost:3000/api/voice-process?fieldName=name&language=or-IN
```

**Expected response:**
```json
{
  "success": true,
  "fieldName": "name",
  "language": "or-IN",
  "voicePrompt": "ଦୟାକରି ଆପଣଙ୍କର ପୂର୍ଣ୍ଣ ନାମ କୁହନ୍ତୁ"
}
```

**If voicePrompt is empty or missing:** The backend isn't generating the prompt correctly.

### Step 5: Common Issues and Fixes

#### Issue 1: Text is undefined
**Symptom:** `[GoogleTTS] Empty text provided, skipping`
**Cause:** The voice prompt is not being fetched or is empty
**Fix:** Check that the backend API is returning the voicePrompt

#### Issue 2: Text has special characters
**Symptom:** 400 error even though text exists
**Cause:** URL encoding issue
**Fix:** Already handled with `encodeURIComponent`, but check the encoded URL

#### Issue 3: Language code is wrong
**Symptom:** Google returns error
**Cause:** Invalid language code
**Fix:** Verify Odia code is 'or' not 'od'

### Step 6: Manual Test

Try this in browser console:
```javascript
// Test if speakText works
const { speakText } = await import('/lib/voice-utils.ts');
await speakText('ହେଲୋ', 'or-IN');
```

### Step 7: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "tts-proxy"
3. Look for the request
4. Check:
   - Request URL
   - Query parameters
   - Response status
   - Response body

### Quick Fix

If the issue persists, try this temporary workaround:

1. Open `lib/voice-utils.ts`
2. Find the `speakWithGoogleTTS` function
3. Add this at the start:

```typescript
// Temporary debug
console.log('[DEBUG] Text:', text);
console.log('[DEBUG] Text length:', text?.length);
console.log('[DEBUG] Text type:', typeof text);
console.log('[DEBUG] Language:', language);
```

This will help us see exactly what's being passed.

### Expected Flow

```
1. User selects Odia language
2. Voice form fetches prompt: GET /api/voice-process?fieldName=name&language=or-IN
3. Backend returns: { voicePrompt: "ଦୟାକରି..." }
4. Frontend calls: speakText("ଦୟାକରି...", "or-IN")
5. speakText checks: No browser voice for Odia
6. Calls: speakWithGoogleTTS("ଦୟାକରି...", "or-IN")
7. Creates URL: /api/tts-proxy?text=ଦୟାକରି...&lang=or
8. Server fetches from Google
9. Returns audio
10. Browser plays audio ✅
```

### Next Steps

1. **Refresh browser** (Ctrl + F5)
2. **Select Odia language**
3. **Check console logs** (both browser and server)
4. **Share the logs** with me so I can help debug

The enhanced logging should now show exactly where the issue is occurring.
