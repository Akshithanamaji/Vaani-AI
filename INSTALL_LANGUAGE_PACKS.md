# How to Install Language Packs on Windows

## Quick Steps (5 minutes)

### 1. Open Windows Settings
- Press `Windows Key + I` on your keyboard
- OR Click Start → Settings

### 2. Go to Language Settings
- Click on **Time & Language**
- Click on **Language & Region** (left sidebar)

### 3. Add Indian Languages
Click **Add a language** button and add these one by one:

1. **Telugu** - Search "telugu" → Select "తెలుగు (Telugu)" → Click Next → Install
2. **Tamil** - Search "tamil" → Select "தமிழ் (Tamil)" → Click Next → Install
3. **Kannada** - Search "kannada" → Select "ಕನ್ನಡ (Kannada)" → Click Next → Install
4. **Malayalam** - Search "malayalam" → Select "മലയാളം (Malayalam)" → Click Next → Install
5. **Marathi** - Search "marathi" → Select "मराठी (Marathi)" → Click Next → Install
6. **Bengali** - Search "bengali" → Select "বাংলা (Bengali)" → Click Next → Install
7. **Gujarati** - Search "gujarati" → Select "ગુજરાતી (Gujarati)" → Click Next → Install
8. **Odia** - Search "odia" → Select "ଓଡ଼ିଆ (Odia)" → Click Next → Install
9. **Punjabi** - Search "punjabi" → Select "ਪੰਜਾਬੀ (Punjabi)" → Click Next → Install
10. **Urdu** - Search "urdu" → Select "اردو (Urdu)" → Click Next → Install

### 4. Download Speech Features for Each Language

For EACH language you just added:

1. Find the language in the list
2. Click the **⋯** (three dots) next to it
3. Click **Language options**
4. Scroll down to **Speech** section
5. Click **Download** button next to "Text-to-speech"
6. Wait for download to complete (shows checkmark when done)

### 5. Restart Your Browser
- Close Chrome/Edge completely
- Open it again
- Go to `http://localhost:3000/voice-diagnostic`
- Click "Reload Voices"
- You should now see voices for all languages!

## Visual Guide

```
Windows Settings
    ↓
Time & Language
    ↓
Language & Region
    ↓
Add a language (button)
    ↓
Search for language (e.g., "Telugu")
    ↓
Select language → Next → Install
    ↓
After installed: Click ⋯ → Language options
    ↓
Speech section → Download Text-to-speech
    ↓
Repeat for all 10 languages
    ↓
Restart browser
    ↓
Test at http://localhost:3000/voice-diagnostic
```

## Alternative: Automated Script (PowerShell)

If you want to automate this, run PowerShell as Administrator and execute:

```powershell
# Install language packs
$languages = @(
    "te-IN",  # Telugu
    "ta-IN",  # Tamil
    "kn-IN",  # Kannada
    "ml-IN",  # Malayalam
    "mr-IN",  # Marathi
    "bn-IN",  # Bengali
    "gu-IN",  # Gujarati
    "or-IN",  # Odia
    "pa-IN",  # Punjabi
    "ur-IN"   # Urdu
)

foreach ($lang in $languages) {
    Write-Host "Installing $lang..."
    Install-Language $lang
}

Write-Host "Language packs installed. Please restart your browser."
```

## Verification

After installation, check:
1. Go to `http://localhost:3000/voice-diagnostic`
2. You should see voices like:
   - "Microsoft Heera - Telugu (India)"
   - "Microsoft Shruti - Gujarati (India)"
   - "Microsoft Hemant - Hindi (India)"
   - etc.

## Troubleshooting

**If languages don't appear after installation:**
1. Restart Windows (not just browser)
2. Check Windows Update for pending updates
3. Ensure you downloaded "Text-to-speech" not just the language pack

**If you can't find a language:**
- Make sure you're searching in English (e.g., "Telugu" not "తెలుగు")
- Some languages might be listed with country (e.g., "Telugu (India)")

## Time Required
- Adding all languages: ~2 minutes
- Downloading speech for all: ~5-10 minutes (depending on internet speed)
- Total: ~15 minutes

After this, your application will speak in all 12 languages! 🎉
