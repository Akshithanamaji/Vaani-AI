// Voice recognition and text-to-speech utilities

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

/**
 * Languages supported by Google Translate TTS
 * Odia (or) is NOT supported reliably by Google TTS
 */
const GOOGLE_TTS_SUPPORTED_LANGUAGES = new Set([
  'en', 'hi', 'te', 'ta', 'ml', 'kn', 'mr', 'bn', 'gu', 'pa', 'ur'
]);

/**
 * Fallback languages for unsupported TTS languages
 * Maps unsupported languages to their fallback alternatives
 */
const TTS_FALLBACK_LANGUAGES: Record<string, string[]> = {
  'or': ['hi', 'en'], // Odia -> Hindi -> English
  'as': ['hi', 'en'], // Assamese -> Hindi -> English
  'sa': ['hi', 'en'], // Sanskrit -> Hindi -> English
  'ks': ['hi', 'en'], // Kashmiri -> Hindi -> English
  'sd': ['hi', 'en'], // Sindhi -> Hindi -> English
  'bh': ['hi', 'en'], // Bhojpuri -> Hindi -> English
  'mai': ['hi', 'en'], // Maithili -> Hindi -> English
};

/**
 * Check if a language is supported by Google TTS
 */
function isGoogleTTSSupported(language: string): boolean {
  const langCode = language.split('-')[0];
  return GOOGLE_TTS_SUPPORTED_LANGUAGES.has(langCode);
}

/**
 * Get fallback language for unsupported TTS languages
 */
function getTTSFallbackLanguage(language: string): string | null {
  const langCode = language.split('-')[0];
  const fallbacks = TTS_FALLBACK_LANGUAGES[langCode];
  
  if (!fallbacks || fallbacks.length === 0) {
    return null;
  }
  
  // Return first fallback with -IN suffix
  return `${fallbacks[0]}-IN`;
}

/**
 * Get the best language for TTS, with fallback if original not supported
 * This ensures we fetch prompts in a language that can actually be spoken
 */
export function getTTSLanguage(requestedLanguage: string): string {
  const langCode = requestedLanguage.split('-')[0];
  
  // Check if browser might have this voice
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    const hasBrowserVoice = voices.some((v: any) =>
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    if (hasBrowserVoice) {
      return requestedLanguage;
    }
  }
  
  // Check if Google TTS supports it
  if (isGoogleTTSSupported(requestedLanguage)) {
    return requestedLanguage;
  }
  
  // Use fallback language
  const fallback = getTTSFallbackLanguage(requestedLanguage);
  return fallback || 'en-IN';
}

/**
 * Play text using Google Translate TTS via server proxy
 * This works without any language pack installation and bypasses CORS
 * Note: Silently skips if language is not supported by Google TTS
 */
async function speakWithGoogleTTS(text: string, language: string): Promise<void> {
  return new Promise((resolve) => {
    if (!text || text.trim().length === 0) {
      console.warn('[GoogleTTS] Empty text provided, skipping');
      resolve();
      return;
    }

    try {
      // Extract language code (e.g., 'hi' from 'hi-IN')
      const langCode = language.split('-')[0];

      // Check if language is supported by Google TTS
      if (!GOOGLE_TTS_SUPPORTED_LANGUAGES.has(langCode)) {
        console.warn(`[GoogleTTS] Language '${langCode}' is not supported by Google TTS, skipping speech synthesis`);
        console.warn(`[GoogleTTS] Supported languages:`, Array.from(GOOGLE_TTS_SUPPORTED_LANGUAGES).join(', '));
        resolve();
        return;
      }

      console.log(`[GoogleTTS] Speaking text: "${text.substring(0, 50)}..." in language: ${language}`);

      // Use our server-side proxy to avoid CORS issues
      const encodedText = encodeURIComponent(text);
      const proxyUrl = `/api/tts-proxy?text=${encodedText}&lang=${langCode}`;

      console.log(`[GoogleTTS] Proxy URL: ${proxyUrl.substring(0, 100)}...`);

      // Create and play audio element
      const audio = new Audio(proxyUrl);

      audio.onended = () => {
        console.log(`[GoogleTTS] Speech completed for ${language}`);
        resolve();
      };

      audio.onerror = (error) => {
        console.error(`[GoogleTTS] Error playing audio for ${language}:`, error);
        console.error(`[GoogleTTS] Failed URL:`, proxyUrl.substring(0, 150));
        resolve(); // Resolve even on error
      };

      audio.play().catch(error => {
        console.error(`[GoogleTTS] Error starting playback:`, error);
        console.error(`[GoogleTTS] Text was:`, text);
        resolve();
      });

    } catch (error) {
      console.error('[GoogleTTS] Error in speakWithGoogleTTS:', error);
      resolve();
    }
  });
}


/**
 * Initialize Web Speech API for voice recognition
 */
export function initVoiceRecognition(
  language: string = 'en-IN',
  onResult: (result: VoiceRecognitionResult) => void,
  onError: (error: string) => void,
  onEnd?: () => void,
  onStart?: () => void
): any | null {
  if (typeof window === 'undefined') {
    console.log('[Voice] Window not available (SSR context)');
    return null;
  }

  console.log('[Voice] Initializing voice recognition for language:', language);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[Voice] Speech Recognition API not available - browser may not support it (requires Chrome/Edge)');
    onError('not-supported: Your browser does not support voice input. Please use Chrome or Edge.');
    return null;
  }

  console.log('[Voice] Speech Recognition API available');

  // Check for secure context
  if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    console.warn('[Voice] Not secure context and not localhost');
    onError('not-allowed: Speech recognition requires a secure (HTTPS) connection.');
    return null;
  }

  console.log('[Voice] Security check passed - creating new recognition instance');

  try {
    const recognition = new SpeechRecognition();
    console.log('[Voice] Recognition instance created successfully');
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    let interimTranscript = '';

    recognition.onstart = () => {
      console.log('[v0] Voice recognition started');
      if (onStart) onStart();
    };

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      let isFinalResult = false;

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        fullTranscript += result[0].transcript;
        if (result.isFinal && i === event.results.length - 1) {
          isFinalResult = true;
        }
      }

      if (fullTranscript) {
        console.log(`[Voice] Transcript (${isFinalResult ? 'FINAL' : 'Interim'}): "${fullTranscript.trim()}"`);
        onResult({
          transcript: fullTranscript.trim(),
          confidence: event.results[event.results.length - 1][0].confidence,
          isFinal: isFinalResult,
        });
      }
    };

    recognition.onerror = (event: any) => {
      const errorStr = (event.error || '').toString();

      // Completely silence 'aborted' and 'no-speech' errors
      if (errorStr.includes('aborted') || errorStr === 'no-speech') {
        return;
      }

      // Suppress network errors - they're too noisy for users without internet
      // Instead, silently fail so users can use manual input
      // REVERTED: We need to notify the UI so it can suggest manual input instead of just stopping silently
      /*
      if (event.error === 'network') {
        return;
      }
      */

      console.error('[Voice] Recognition engine error:', errorStr);
      let errorMessage = errorStr;

      if (event.error === 'not-allowed') {
        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname);

        errorMessage = 'Microphone access denied.';

        if (!isSecure) {
          errorMessage += ' Speech recognition requires a secure connection (HTTPS or localhost).';
          if (isIP) {
            errorMessage += ' Please use "localhost" or setup HTTPS to use voice features on an IP address.';
          }
        } else {
          errorMessage += ' Please check your browser permission settings.';
        }
      }

      onError(errorMessage);
    };

    recognition.onend = () => {
      console.log('[v0] Voice recognition ended');
      if (onEnd) onEnd();
    };

    return recognition;
  } catch (e) {
    console.error('[Voice] Error initializing recognition:', e);
    return null;
  }
}

/**
 * Update recognition language safely
 */
export function setRecognitionLanguage(recognition: any, language: string): void {
  if (recognition) {
    recognition.lang = language;
  }
}

/**
 * Start voice recording
 */
export function startVoiceRecording(recognition: any): void {
  console.log('[Voice] startVoiceRecording called with recognition:', recognition ? 'exists' : 'null/undefined');

  if (!recognition) {
    console.warn('[Voice] startVoiceRecording - recognition is null/undefined');
    return;
  }

  if (typeof recognition.start !== 'function') {
    console.warn('[Voice] startVoiceRecording - recognition.start is not a function');
    return;
  }

  try {
    console.log('[Voice] Calling recognition.start()');
    recognition.start();
    console.log('[Voice] recognition.start() completed');
  } catch (e: any) {
    if (e.name !== 'InvalidStateError') {
      console.error('[Voice] Error calling start():', e);
    } else {
      console.log('[Voice] InvalidStateError (likely already recording) - ignoring');
    }
  }
}

/**
 * Stop voice recording
 */
export function stopVoiceRecording(recognition: any): void {
  if (recognition && typeof recognition.stop === 'function') {
    try {
      recognition.stop();
    } catch (e) {
      console.error('[Voice] Error calling stop():', e);
    }
  }
}

/**
 * Abort voice recording
 */
export function abortVoiceRecording(recognition: any): void {
  if (recognition && typeof recognition.abort === 'function') {
    try {
      recognition.abort();
    } catch (e) {
      // Ignore abort errors if already stopped
    }
  }
}

/**
 * Language-to-voice code mapping for Web Speech API
 */
const LANGUAGE_VOICE_MAP: Record<string, string[]> = {
  'en-IN': ['en-IN', 'en-US', 'en-GB'],
  'hi-IN': ['hi-IN', 'hi'],
  'te-IN': ['te-IN', 'te'],
  'kn-IN': ['kn-IN', 'kn'],
  'ta-IN': ['ta-IN', 'ta'],
  'ml-IN': ['ml-IN', 'ml'],
  'mr-IN': ['mr-IN', 'mr'],
  'bn-IN': ['bn-IN', 'bn'],
  'gu-IN': ['gu-IN', 'gu'],
  'or-IN': ['or-IN', 'or'],
  'pa-IN': ['pa-IN', 'pa'],
  'ur-IN': ['ur-IN', 'ur'],
};

/**
 * Get the best available voice for a language
 */
function getBestVoiceForLanguage(language: string): any | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    console.warn('[Voice] No voices available yet');
    return null;
  }

  const langCodes = (language && typeof language === 'string')
    ? (LANGUAGE_VOICE_MAP[language] || [language])
    : ['en-IN'];

  console.log(`[Voice] Looking for voice for language: ${language}, trying codes:`, langCodes);
  console.log(`[Voice] Available voices:`, voices.map(v => `${v.name} (${v.lang})`).join(', '));

  // Try exact match first
  for (const langCode of langCodes) {
    const exactMatch = voices.find((v: any) =>
      v.lang.toLowerCase() === langCode.toLowerCase()
    );
    if (exactMatch) {
      console.log(`[Voice] Found exact match: ${exactMatch.name} (${exactMatch.lang})`);
      return exactMatch;
    }
  }

  // Try language code match (e.g., 'hi' matches 'hi-IN')
  for (const langCode of langCodes) {
    const langPrefix = langCode.split('-')[0].toLowerCase();
    const prefixMatch = voices.find((v: any) =>
      v.lang.toLowerCase().startsWith(langPrefix)
    );
    if (prefixMatch) {
      console.log(`[Voice] Found prefix match: ${prefixMatch.name} (${prefixMatch.lang})`);
      return prefixMatch;
    }
  }

  // Fallback to first available voice
  console.warn(`[Voice] No match found for ${language}, using first available voice: ${voices[0].name} (${voices[0].lang})`);
  return voices[0];
}

/**
 * Get voice settings for different languages
 */
function getVoiceSettings(language: string) {
  const settings: Record<string, { rate: number; pitch: number; volume: number }> = {
    'en': { rate: 0.9, pitch: 1.0, volume: 1.0 },
    'hi': { rate: 0.85, pitch: 1.1, volume: 1.0 },
    'te': { rate: 0.85, pitch: 1.1, volume: 1.0 },
    'ta': { rate: 0.85, pitch: 1.1, volume: 1.0 },
    'ml': { rate: 0.85, pitch: 1.1, volume: 1.0 },
    'kn': { rate: 0.85, pitch: 1.1, volume: 1.0 },
    'mr': { rate: 0.85, pitch: 1.0, volume: 1.0 },
    'bn': { rate: 0.85, pitch: 1.0, volume: 1.0 },
    'gu': { rate: 0.85, pitch: 1.0, volume: 1.0 },
    'or': { rate: 0.85, pitch: 1.0, volume: 1.0 },
    'pa': { rate: 0.85, pitch: 1.0, volume: 1.0 },
    'ur': { rate: 0.85, pitch: 1.0, volume: 1.0 },
  };

  const langCode = (language && typeof language === 'string') ? language.split('-')[0] : 'en';
  return settings[langCode] || settings['en'];
}

/**
 * Text-to-Speech utility with proper voice selection and Google TTS fallback
 * Prioritizes browser TTS for languages not supported by Google (like Odia)
 */
export function speakText(text: string, language: string = 'en-IN'): Promise<void> {
  return new Promise(async (resolve) => {
    if (typeof window === 'undefined') {
      console.warn('[Voice] Window not available');
      resolve();
      return;
    }

    if (!text || text.trim().length === 0) {
      resolve();
      return;
    }

    // Ensure language is a valid string
    const validLanguage = (typeof language === 'string' && language.length > 0) ? language : 'en-IN';
    const langCode = validLanguage.split('-')[0];
    const isGoogleSupported = isGoogleTTSSupported(validLanguage);

    try {
      // Check if speech synthesis is available
      if (!window.speechSynthesis) {
        if (isGoogleSupported) {
          console.log('[Voice] Speech Synthesis not available, using Google TTS');
          return speakWithGoogleTTS(text, validLanguage).then(resolve);
        } else {
          console.warn(`[Voice] Speech Synthesis not available and Google TTS doesn't support ${validLanguage}`);
          // Try fallback language with Google TTS
          const fallbackLang = getTTSFallbackLanguage(validLanguage);
          if (fallbackLang && isGoogleTTSSupported(fallbackLang)) {
            console.log(`[Voice] Using fallback language: ${fallbackLang}`);
            return speakWithGoogleTTS(text, fallbackLang).then(resolve);
          }
          resolve();
          return;
        }
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Ensure voices are loaded
      await initializeVoices();

      // Get available voices
      const voices = window.speechSynthesis.getVoices();

      // Check if we have a browser voice for this language
      const hasVoiceForLanguage = voices.some((v: any) =>
        v.lang.toLowerCase().startsWith(langCode.toLowerCase())
      );

      // Try browser TTS first for the requested language
      if (hasVoiceForLanguage) {
        console.log(`[Voice] Found browser voice for ${validLanguage}, using browser TTS`);
        
        const voice = getBestVoiceForLanguage(validLanguage);
        const settings = getVoiceSettings(validLanguage);

        console.log(`[Voice] Speaking in ${validLanguage}, using voice:`, voice?.name || 'default', voice?.lang || 'unknown');

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = validLanguage;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        if (voice) {
          utterance.voice = voice;
          console.log(`[Voice] Voice set to: ${voice.name} (${voice.lang})`);
        }

        utterance.onend = () => {
          console.log(`[Voice] Speech completed for ${validLanguage}`);
          resolve();
        };

        utterance.onerror = (event: any) => {
          if (event.error === 'interrupted') {
            resolve();
            return;
          }

          console.error(`[Voice] Browser TTS error for ${validLanguage}:`, event.error);
          
          // Try Google TTS as fallback if supported
          if (isGoogleSupported) {
            console.log('[Voice] Falling back to Google TTS');
            speakWithGoogleTTS(text, validLanguage).then(resolve);
          } else {
            // Try fallback language
            const fallbackLang = getTTSFallbackLanguage(validLanguage);
            if (fallbackLang) {
              console.log(`[Voice] Trying fallback language: ${fallbackLang}`);
              speakText(text, fallbackLang).then(resolve);
            } else {
              resolve();
            }
          }
        };

        window.speechSynthesis.speak(utterance);
        return;
      }

      // No browser voice - try Google TTS if supported
      if (isGoogleSupported) {
        console.log(`[Voice] No browser voice for ${validLanguage}, using Google TTS`);
        return speakWithGoogleTTS(text, validLanguage).then(resolve);
      }

      // Neither browser nor Google supports this language - try fallback
      const fallbackLang = getTTSFallbackLanguage(validLanguage);
      if (fallbackLang) {
        console.log(`[Voice] ${validLanguage} not supported, trying fallback: ${fallbackLang}`);
        return speakText(text, fallbackLang).then(resolve);
      }

      console.warn(`[Voice] No TTS available for ${validLanguage} and no fallback found`);
      resolve();

    } catch (e) {
      console.error('[Voice] Error in speakText:', e);
      
      // Try Google TTS as fallback only if supported
      if (isGoogleSupported) {
        console.log('[Voice] Falling back to Google TTS due to exception');
        speakWithGoogleTTS(text, validLanguage).then(resolve);
      } else {
        console.warn(`[Voice] Cannot fallback - ${validLanguage} not supported by Google TTS`);
        resolve();
      }
    }
  });
}

/**
 * Stop text-to-speech
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    console.log('[Voice] Speech stopped');
  }
}

/**
 * Initialize voices and ensure they are loaded
 */
export function initializeVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Check if voices are already loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }

    // Wait for voices to be loaded
    const voiceschanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', voiceschanged);
      resolve();
    };

    window.speechSynthesis.addEventListener('voiceschanged', voiceschanged);
  });
}

/**
 * Translate text descriptions to multiple languages
 */
export const LANGUAGE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  en: {
    nameLabel: 'Please tell me your full name',
    emailLabel: 'Please tell me your email address',
    phoneLabel: 'Please tell me your phone number',
    addressLabel: 'Please tell me your complete address',
    infoLabel: 'Tell me any additional information',
    listenButton: 'Start Speaking',
    stopButton: 'Stop Speaking',
    submitButton: 'Submit Application',
    reviewText: 'Please review your information',
  },
  hi: {
    nameLabel: 'अपना पूरा नाम बताएं',
    emailLabel: 'अपना ईमेल पता बताएं',
    phoneLabel: 'अपना फोन नंबर बताएं',
    addressLabel: 'अपना संपूर्ण पता बताएं',
    infoLabel: 'कोई अतिरिक्त जानकारी बताएं',
    listenButton: 'बोलना शुरू करें',
    stopButton: 'बोलना बंद करें',
    submitButton: 'आवेदन जमा करें',
    reviewText: 'कृपया अपनी जानकारी की समीक्षा करें',
  },
  te: {
    nameLabel: 'దయచేసి మీ పూర్తి పేరు చెప్పండి',
    emailLabel: 'దయచేసి మీ ఇమెయిల్ చిరునామా చెప్పండి',
    phoneLabel: 'దయచేసి మీ ఫోన్ నంబర్ చెప్పండి',
    addressLabel: 'దయచేసి మీ సంపూర్ణ చిరునామా చెప్పండి',
    infoLabel: 'ఏదైనా అదనపు సమాచారం చెప్పండి',
    listenButton: 'మాట్లాడటం ప్రారంభిసి',
    stopButton: 'మాట్లాడటం ఆపండి',
    submitButton: 'దరఖాస్తు సమర్పించి',
    reviewText: 'దయచేసి మీ సమాచారాన్ని సమీక్షించి',
  },
  kn: {
    nameLabel: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ',
    emailLabel: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ಹೇಳಿ',
    phoneLabel: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ಹೇಳಿ',
    addressLabel: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪೂರ್ಣ ವಿಳಾಸ ಹೇಳಿ',
    infoLabel: 'ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ ಹೇಳಿ',
    listenButton: 'ಮಾತನಾಡುವಿಕೆ ಪ್ರಾರಂಭಿಸಿ',
    stopButton: 'ಮಾತನಾಡುವಿಕೆ ನಿಲ್ಲಿಸಿ',
    submitButton: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    reviewText: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
  },
  ta: {
    nameLabel: 'தயவுசெய்து உங்கள் முழு பெயரைச் சொல்லுங்கள்',
    emailLabel: 'தயவுசெய்து உங்கள் ஈமெயில் முகவரியைச் சொல்லுங்கள்',
    phoneLabel: 'தயவுசெய்து உங்கள் ஃபோன் எண்ணைச் சொல்லுங்கள்',
    addressLabel: 'தயவுசெய்து உங்கள் முழு முகவரியைச் சொல்லுங்கள்',
    infoLabel: 'கூடுதல் தகவல் சொல்லுங்கள்',
    listenButton: 'பேச ஆரம்பிக்கவும்',
    stopButton: 'பேசுவதை நிறுத்தவும்',
    submitButton: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    reviewText: 'தயவுசெய்து உங்கள் தகவலை மதிப்பாய்వు செய்யவும்',
  },
  ml: {
    nameLabel: 'ദയവായി നിങ്ങളുടെ പൂർണ്ണനാമം പറയുക',
    emailLabel: 'ദയവായി നിങ്ങളുടെ ഇമെയിൽ വിലാസം പറയുക',
    phoneLabel: 'ദയവായി നിങ്ങളുടെ ഫോൺ നമ്പർ പറയുക',
    addressLabel: 'ദയവായി നിങ്ങളുടെ പൂർണ്ണ വിലാസം പറയുക',
    infoLabel: 'അര്ജിത അധിക വിവരങ്ങൾ പറയുക',
    listenButton: 'സംസാരിക്കാൻ തുടങ്ങുക',
    stopButton: 'സംസാരിക്കുന്നത് നിർത്തുക',
    submitButton: 'അപേക്ഷ സമർപ്പിക്കുക',
    reviewText: 'ദയവായി നിങ്ങളുടെ വിവരങ്ങൾ പരിശോധിക്കുക',
  },
  mr: {
    nameLabel: 'कृपया आपले पूर्ण नाव सांगा',
    emailLabel: 'कृपया आपला ईमेल पत्ता सांगा',
    phoneLabel: 'कृपया आपला फोन नंबर सांगा',
    addressLabel: 'कृपया आपला संपूर्ण पत्ता सांगा',
    infoLabel: 'कोणतीही अतिरिक्त माहिती सांगा',
    listenButton: 'बोलणे सुरू करा',
    stopButton: 'बोलणे थांबवा',
    submitButton: 'अर्ज सादर करा',
    reviewText: 'कृपया आपली माहिती तपासा',
  },
  bn: {
    nameLabel: 'অনুগ্রহ করে আপনার পুরো নাম বলুন',
    emailLabel: 'অনুগ্রহ করে আপনার ইমেল ঠিকানা বলুন',
    phoneLabel: 'অনুগ্রহ করে আপনার ফোন নম্বর বলুন',
    addressLabel: 'অনুগ্রহ করে আপনার সম্পূর্ণ ঠিকানা বলুন',
    infoLabel: 'কোনো অতিরিক্ত তথ্য বলুন',
    listenButton: 'কথা বলা শুরু করুন',
    stopButton: 'কথা বলা বন্ধ করুন',
    submitButton: 'আবেদন জমা দিন',
    reviewText: 'অনুগ্রহ করে আপনার তথ্য পর্যালোচনা করুন',
  },
  gu: {
    nameLabel: 'કૃપા કરીને તમારું પૂરું નામ કહો',
    emailLabel: 'કૃપા કરીને તમારું ઈમેલ સરનામું કહો',
    phoneLabel: 'કૃપા કરીને તમારો ફોન નંબર કહો',
    addressLabel: 'કૃપા કરીને તમારું સંપૂર્ણ સરનામું કહો',
    infoLabel: 'કોઈપણ વધારાની માહિતી કહો',
    listenButton: 'બોલવાનું શરૂ કરો',
    stopButton: 'બોલવાનું બંધ કરો',
    submitButton: 'અરજી સબમિટ કરો',
    reviewText: 'કૃપા કરીને તમારી માહિતીની સમીક્ષા કરો',
  },
  or: {
    nameLabel: 'ଦୟାକରି ଆପଣଙ୍କର ପୂର୍ଣ୍ଣ ନାମ କୁହନ୍ତୁ',
    emailLabel: 'ଦୟାକରି ଆପଣଙ୍କର ଇମେଲ୍ ଠିକଣା କୁହନ୍ତୁ',
    phoneLabel: 'ଦୟାକରି ଆପଣଙ୍କର ଫୋନ୍ ନମ୍ବର କୁହନ୍ତୁ',
    addressLabel: 'ଦୟାକରି ଆପଣଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ଠିକଣା କୁହନ୍ତୁ',
    infoLabel: 'କୌଣସି ଅତିରିକ୍ତ ସୂଚନା କୁହନ୍ତୁ',
    listenButton: 'କଥାବାର୍ତ୍ତା ଆରମ୍ଭ କରନ୍ତୁ',
    stopButton: 'କଥାବାର୍ତ୍ତା ବନ୍ଦ କରନ୍ତୁ',
    submitButton: 'ଆବେଦନ ଦାଖଲ କରନ୍ତୁ',
    reviewText: 'ଦୟାକରି ଆପଣଙ୍କର ସୂଚନା ସମୀକ୍ଷା କରନ୍ତୁ',
  },
  pa: {
    nameLabel: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਬਤਾਓ',
    emailLabel: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਈਮੇਲ ਪਤਾ ਬਤਾਓ',
    phoneLabel: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਫੋਨ ਨੰਬਰ ਬਤਾਓ',
    addressLabel: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਪਤਾ ਬਤਾਓ',
    infoLabel: 'ਕੋਈ ਵਾਧੂ ਜਾਣਕਾਰੀ ਬਤਾਓ',
    listenButton: 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    stopButton: 'ਬੋਲਣਾ ਬੰਦ ਕਰੋ',
    submitButton: 'ਅਰਜ਼ੀ ਦਾਖਲ ਕਰੋ',
    reviewText: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦੀ ਸਮੀਖਿਆ ਕਰੋ',
  },
  ur: {
    nameLabel: 'براہ کرم اپنا پورا نام بتائیں',
    emailLabel: 'براہ کرم اپنا ای میل پتہ بتائیں',
    phoneLabel: 'براہ کرم اپنا فون نمبر بتائیں',
    addressLabel: 'براہ کرم اپنا مکمل پتہ بتائیں',
    infoLabel: 'کوئی اضافی معلومات بتائیں',
    listenButton: 'بولنا شروع کریں',
    stopButton: 'بولنا بند کریں',
    submitButton: 'درخواست جمع کرائیں',
    reviewText: 'براہ کرم اپنی معلومات کا جائزہ لیں',
  },
};

/**
 * Get description text for a field in the specified language
 */
export function getFieldDescription(fieldKey: string, language: string): string {
  const lang = (language && typeof language === 'string') ? language.split('-')[0] : 'en'; // Extract language code (e.g., 'en' from 'en-IN')
  return LANGUAGE_DESCRIPTIONS[lang]?.[fieldKey] || LANGUAGE_DESCRIPTIONS['en']?.[fieldKey] || '';
}
