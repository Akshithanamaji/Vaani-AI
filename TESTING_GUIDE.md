# Testing the Multilingual Voice Implementation

## Quick Test Guide

### 1. Test Voice Prompt API

Open your browser and test the GET endpoint:

```
http://localhost:3000/api/voice-process?fieldName=name&language=hi-IN
```

Expected response:
```json
{
  "success": true,
  "fieldName": "name",
  "language": "hi-IN",
  "voicePrompt": "कृपया अपना पूरा नाम बताएं"
}
```

### 2. Test Different Languages

Try these URLs to test different languages:

**English:**
```
http://localhost:3000/api/voice-process?fieldName=email&language=en-IN
```

**Telugu:**
```
http://localhost:3000/api/voice-process?fieldName=phone&language=te-IN
```

**Tamil:**
```
http://localhost:3000/api/voice-process?fieldName=address&language=ta-IN
```

**Malayalam:**
```
http://localhost:3000/api/voice-process?fieldName=gender&language=ml-IN
```

**Kannada:**
```
http://localhost:3000/api/voice-process?fieldName=dob&language=kn-IN
```

**Marathi:**
```
http://localhost:3000/api/voice-process?fieldName=name&language=mr-IN
```

**Bengali:**
```
http://localhost:3000/api/voice-process?fieldName=email&language=bn-IN
```

**Gujarati:**
```
http://localhost:3000/api/voice-process?fieldName=phone&language=gu-IN
```

**Odia:**
```
http://localhost:3000/api/voice-process?fieldName=address&language=or-IN
```

**Punjabi:**
```
http://localhost:3000/api/voice-process?fieldName=gender&language=pa-IN
```

**Urdu:**
```
http://localhost:3000/api/voice-process?fieldName=dob&language=ur-IN
```

### 3. Test in Application

1. Start the application: `npm run dev`
2. Navigate to the application form
3. Select a language (e.g., Hindi)
4. Start filling the form
5. Listen to the voice prompts - they should be in Hindi
6. Provide voice input
7. Listen to the confirmation - it should also be in Hindi

### 4. Test Fallback Mechanism

To test the fallback mechanism:

1. Disconnect your internet or stop the API server
2. Try to fill a form
3. The application should fall back to the hardcoded `voiceLabel` from service definitions
4. If that's not available, it should use a generic English prompt

### 5. Test Custom Fields

For fields that don't have predefined prompts, the system generates a generic prompt:

```
http://localhost:3000/api/voice-process?fieldName=father_name&language=hi-IN
```

Expected response (generic prompt):
```json
{
  "success": true,
  "fieldName": "father_name",
  "language": "hi-IN",
  "voicePrompt": "कृपया अपना father name प्रदान करें"
}
```

## Expected Behavior

### ✅ Success Indicators

- Voice prompts are spoken in the selected language
- Validation responses are in the selected language
- Error messages are in the selected language
- All 12 languages work correctly
- Fallback mechanism works when API fails

### ❌ Issues to Watch For

- Voice prompts in wrong language
- Validation responses in English when another language is selected
- API errors or timeouts
- Missing translations
- Incorrect pronunciation

## Troubleshooting

### Issue: Voice prompts are in English despite selecting another language

**Solution:**
1. Check browser console for errors
2. Verify the API endpoint is returning the correct language
3. Check that the language parameter is being passed correctly

### Issue: API returns 404 or 500 error

**Solution:**
1. Ensure the dev server is running
2. Check the API route file exists at `app/api/voice-process/route.ts`
3. Check for TypeScript compilation errors

### Issue: Voice is not speaking

**Solution:**
1. Check browser permissions for speech synthesis
2. Verify the `speakText` function is working
3. Check browser console for errors

## Manual Testing Checklist

- [ ] Test all 12 languages for name field
- [ ] Test all 12 languages for email field
- [ ] Test all 12 languages for phone field
- [ ] Test all 12 languages for address field
- [ ] Test all 12 languages for gender field
- [ ] Test all 12 languages for dob field
- [ ] Test custom field with generic prompt
- [ ] Test fallback when API fails
- [ ] Test fallback when voiceLabel is missing
- [ ] Test voice synthesis in all languages
- [ ] Test validation responses in all languages
- [ ] Test error messages in all languages
