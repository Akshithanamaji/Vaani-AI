'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isValidEmail } from '@/lib/auth-utils';
import { Mail, User, Phone, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { translations } from '@/lib/translations';

// Sign-in page voice instructions in all 12 supported languages
const signInVoiceInstructions: Record<string, string> = {
  en: 'Welcome to Vaani AI. Please enter your full name, phone number, and email address to get started. You can tap the microphone button next to each field to fill it using your voice.',
  hi: 'वानी एआई में आपका स्वागत है। शुरू करने के लिए कृपया अपना पूरा नाम, फ़ोन नंबर और ईमेल पता दर्ज करें। आप प्रत्येक फ़ील्ड के बगल में माइक्रोफ़ोन बटन दबाकर अपनी आवाज़ से भर सकते हैं।',
  te: 'వానీ AI కు స్వాగతం. ప్రారంభించడానికి దయచేసి మీ పూర్తి పేరు, ఫోన్ నంబర్ మరియు ఇమెయిల్ చిరునామా నమోదు చేయండి. మీ వాయిస్ ద్వారా నింపడానికి ప్రతి ఫీల్డ్ పక్కన మైక్రోఫోన్ బటన్ నొక్కండి.',
  kn: 'ವಾಣಿ AI ಗೆ ಸ್ವಾಗತ. ಪ್ರಾರಂಭಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು, ಫೋನ್ ನಂಬರ್ ಮತ್ತು ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ. ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ ತುಂಬಿಸಲು ಪ್ರತಿ ಕ್ಷೇತ್ರದ ಪಕ್ಕದ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಒತ್ತಿರಿ.',
  ta: 'வாணி AI க்கு வரவேற்கிறோம். தொடங்க உங்கள் முழு பெயர், தொலைபேசி எண் மற்றும் மின்னஞ்சல் முகவரியை உள்ளிடவும். உங்கள் குரலால் நிரப்ப ஒவ்வொரு புலத்தின் அருகே உள்ள மைக்ரோபோன் பொத்தானை அழுத்தவும்.',
  ml: 'വാണി AI-ലേക്ക് സ്വാഗതം. ആരംഭിക്കാൻ നിങ്ങളുടെ പൂർണ്ണ നാമം, ഫോൺ നമ്പർ, ഇമെയിൽ വിലാസം എന്നിവ നൽകുക. ശബ്ദം ഉപയോഗിച്ച് പൂരിപ്പിക്കാൻ ഓരോ ഫീൽഡിന്റെ അടുത്തുള്ള മൈക്രോഫോൺ ബട്ടൺ അമർത്തുക.',
  mr: 'वाणी AI मध्ये स्वागत आहे. सुरुवात करण्यासाठी कृपया आपले पूर्ण नाव, फोन नंबर आणि ईमेल पत्ता प्रविष्ट करा. आपल्या आवाजाने भरण्यासाठी प्रत्येक फील्डच्या शेजारील मायक्रोफोन बटण दाबा.',
  bn: 'ভানী AI তে স্বাগতম। শুরু করতে অনুগ্রহ করে আপনার পূর্ণ নাম, ফোন নম্বর এবং ইমেইল ঠিকানা লিখুন। আপনার কণ্ঠস্বর দিয়ে পূরণ করতে প্রতিটি ক্ষেত্রের পাশের মাইক্রোফোন বোতামে চাপুন।',
  gu: 'વાણી AI માં આપનું સ્વાગત છે. શરૂ કરવા માટે કૃপા કરીને તમારું પૂરું નામ, ફોન નંબર અને ઈ-મેઈલ સરનામું દાખલ કરો. તમારા અવાજથી ભરવા માટે દરેક ફીલ્ડ પાસેના માઇક્રોફોન બટન દબાવો.',
  or: 'ଭଣ୍ଡ AI କୁ ସ୍ୱାଗତ। ଆରମ୍ଭ କରିବାକୁ ଦୟାକରି ଆପଣଙ୍କ ପୂର୍ଣ ନାମ, ଫୋନ ନମ୍ବର ଏବଂ ଇ-ମେଲ ଠିକଣା ଦିଅନ୍ତୁ। ଆପଣଙ୍କ ଆୱାଜ ଦ୍ୱାରା ଭରିବା ପାଇଁ ପ୍ରତ୍ୟେକ ଫିଲ୍ଡ ପଆଶ ମାଇକ୍ରୋଫୋନ ବଟନ ଦବାନ୍ତୁ।',
  pa: 'ਵਾਣੀ AI ਵਿੱਚ ਸ਼ਾਮਲ ਸਵਾਗਤ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ, ਫ਼ੋਨ ਨੰਬਰ ਅਤੇ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ। ਆਪਣੀ ਆਵਾਜ਼ ਨਾਲ ਭਰਨ ਲਈ ਹਰੇਕ ਖੇਤਰ ਦੇ ਨਾਲ ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਬਟਨ ਦਬਾਓ।',
  ur: 'وانی AI میں خوش آمدید۔ شروع کرنے کے لیے براہ کرم اپنا پورا نام، فون نمبر اور ای میل پتہ درج کریں۔ اپنی آواز سے بھرنے کے لیے ہر فیلڈ کے ساتھ مائیکروفون بٹن دبائیں۔',
};

// Field-level voice prompts in all 12 languages
const fieldVoicePrompts: Record<string, Record<string, string>> = {
  name: {
    en: 'Please say your full name.',
    hi: 'कृपया अपना पूरा नाम बोलें।',
    te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ.',
    ta: 'உங்கள் முழு பெயரைச் சொல்லுங்கள்.',
    ml: 'നിങ്ങളുടെ പൂർണ്ണ നാമം പറയുക.',
    mr: 'कृपया आपले पूर्ण नाव सांगा.',
    bn: 'অনুগ্রহ করে আপনার পূর্ণ নাম বলুন।',
    gu: 'કૃપા કરીને તમારું પૂરું નામ બોલો.',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ପୂର୍ଣ ନାମ କୁହନ୍ତୁ।',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਬੋਲੋ।',
    ur: 'براہ کرم اپنا پورا نام بولیں۔',
  },
  phone: {
    en: 'Please say your phone number.',
    hi: 'कृपया अपना फ़ोन नंबर बोलें।',
    te: 'దయచేసి మీ ఫోన్ నంబర్ చెప్పండి.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್ ಹೇಳಿ.',
    ta: 'உங்கள் தொலைபேசி எண்ணைச் சொல்லுங்கள்.',
    ml: 'നിങ്ങളുടെ ഫോൺ നമ്പർ പറയുക.',
    mr: 'कृपया आपला फोन नंबर सांगा.',
    bn: 'অনুগ্রহ করে আপনার ফোন নম্বর বলুন।',
    gu: 'કૃપા કરીને તમારો ફоન નંбр બоλо.',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ଫୋନ ନମ୍ବର କୁହନ୍ତୁ।',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਫ਼ੋਨ ਨੰਬਰ ਬੋਲੋ।',
    ur: 'براہ کرم اپنا فون نمبر بولیں۔',
  },
  email: {
    en: 'Please say your email address.',
    hi: 'कृपया अपना ईमेल पता बोलें।',
    te: 'దయచేసి మీ ఇమెయిల్ చిరునామా చెప్పండి.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ಹೇಳಿ.',
    ta: 'உங்கள் மின்னஞ்சல் முகவரியைச் சொல்லுங்கள்.',
    ml: 'നിങ്ങളുടെ ഇമെയിൽ വിലാസം പറയുക.',
    mr: 'कृपया आपला ईमेल पत्ता सांगा.',
    bn: 'অনুগ্রহ করে আপনার ইমেইল ঠিকানা বলুন।',
    gu: 'કૃपा করীने তमারо ई-মেইল सरनামु बोलो.',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ଇ-ମେଲ ଠିକଣା କୁହନ୍ତୁ।',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਈਮੇਲ ਪਤਾ ਬੋਲੋ।',
    ur: 'براہ کرم اپنا ای میل پتہ بولیں۔',
  },
};

// Language code to BCP-47 tag for speech recognition
const langToBCP47: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', te: 'te-IN', kn: 'kn-IN', ta: 'ta-IN',
  ml: 'ml-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN', or: 'or-IN',
  pa: 'pa-IN', ur: 'ur-PK',
};

// Listen button label in selected language
const listenLabel: Record<string, string> = {
  en: 'Listen', hi: 'सुनें', te: 'వినండి', kn: 'ಕೇಳಿ', ta: 'கேளுங்கள்',
  ml: 'കേൾക്കുക', mr: 'ऐका', bn: 'শুনুন', gu: 'સાંભળો', or: 'ଶୁଣନ୍ତୁ',
  pa: 'ਸੁਣੋ', ur: 'سنیں',
};
const stopLabel: Record<string, string> = {
  en: 'Stop', hi: 'रोकें', te: 'ఆపు', kn: 'ನಿಲ್ಲಿಸಿ', ta: 'நிறுத்து',
  ml: 'നിർത്തുക', mr: 'थांबा', bn: 'থামুন', gu: 'રોકો', or: 'ବନ୍ଦ',
  pa: 'ਰੋਕੋ', ur: 'رکیں',
};

interface EmailAuthProps {
  onAuthSuccess: (email: string) => void;
  language?: any;
}

export function EmailAuth({ onAuthSuccess, language }: EmailAuthProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeField, setActiveField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef<any>(null);
  const hasSpokenRef = useRef(false);

  const langCode = language?.code || 'en';
  const t = translations[langCode] || translations['en'];
  const bcp47 = langToBCP47[langCode] || 'en-IN';

  // No auto-play on mount — browsers block audio without a direct user gesture.
  // The Listen button below lets users trigger the instructions themselves.

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        import('@/lib/voice-utils').then(({ stopVoiceRecording }) => {
          try { stopVoiceRecording(recognitionRef.current); } catch (e) { }
        });
      }
      import('@/lib/voice-utils').then(({ stopSpeaking }) => stopSpeaking());
    };
  }, []);

  // Replay / stop instructions
  const handleListenInstructions = async () => {
    const { speakText, stopSpeaking } = await import('@/lib/voice-utils');
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); return; }
    const instruction = signInVoiceInstructions[langCode] || signInVoiceInstructions['en'];
    setIsSpeaking(true);
    speakText(instruction, bcp47).finally(() => setIsSpeaking(false));
  };

  // Start/stop voice input for a specific field
  const startVoiceInput = async (field: 'name' | 'phone' | 'email') => {
    const { stopSpeaking, speakText, initVoiceRecognition, startVoiceRecording, stopVoiceRecording } =
      await import('@/lib/voice-utils');

    stopSpeaking();
    setIsSpeaking(false);

    // Toggle off if already listening to same field
    if (isListening && activeField === field) {
      if (recognitionRef.current) {
        try { stopVoiceRecording(recognitionRef.current); } catch (e) { }
        recognitionRef.current = null;
      }
      setIsListening(false);
      setActiveField(null);
      setVoiceStatus('');
      return;
    }

    // Stop any previous recognition
    if (recognitionRef.current) {
      try { stopVoiceRecording(recognitionRef.current); } catch (e) { }
      recognitionRef.current = null;
    }

    // Speak the field prompt but DO NOT await it.
    // Awaiting it takes several seconds, causing the browser to revoke the user-gesture token,
    // which secretly blocks the microphone from starting (NotAllowedError).
    const prompt = fieldVoicePrompts[field]?.[langCode] || fieldVoicePrompts[field]?.['en'];
    speakText(prompt, bcp47).catch(e => console.warn(e));

    setActiveField(field);
    setIsListening(true);
    setVoiceStatus('...');

    const recognition = initVoiceRecognition(
      bcp47,
      async (result) => {
        if (result.transcript) {
          const text = result.transcript.trim();

          // Interim results: show exactly what the user is saying live
          if (!result.isFinal) {
            if (field === 'name') setName(text);
            else if (field === 'phone') setPhone(text);
            else if (field === 'email') setEmail(text);
          } else {
            // Final Result: Call Gemini API to parse and format it cleanly
            setVoiceStatus('Formatting...');
            try {
              const response = await fetch('/api/voice-process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  transcript: text,
                  language: bcp47,
                  fieldName: field,
                  context: {}
                })
              });
              const data = await response.json();
              const formattedText = data.success && data.transcript ? data.transcript : text;

              if (field === 'name') setName(formattedText);
              else if (field === 'phone') setPhone(formattedText);
              else if (field === 'email') setEmail(formattedText);
            } catch (e) {
              // Fallback
              if (field === 'name') setName(text);
              else if (field === 'phone') setPhone(text);
              else if (field === 'email') setEmail(text);
            }
            setVoiceStatus('');
          }
        }
      },
      (err) => {
        console.warn('[VoiceInput] Error:', err);
        setVoiceStatus(''); setIsListening(false); setActiveField(null);
      },
      () => { setIsListening(false); setActiveField(null); setVoiceStatus(''); },
      () => { setVoiceStatus('...'); }
    );

    if (recognition) {
      recognitionRef.current = recognition;
      startVoiceRecording(recognition);
    } else {
      setIsListening(false); setActiveField(null); setVoiceStatus('');
    }
  };

  const handleGetStarted = async () => {
    setError('');
    if (!name.trim()) { setError(t.enterName); return; }
    if (!phone.trim()) { setError(t.enterPhone); return; }
    if (!email.trim()) { setError(t.enterEmail); return; }
    if (!isValidEmail(email)) { setError(t.invalidEmail); return; }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      localStorage.setItem(`profile_name_${normalizedEmail}`, name);
      localStorage.setItem(`profile_phone_${normalizedEmail}`, phone);
      await new Promise((resolve) => setTimeout(resolve, 300));
      onAuthSuccess(normalizedEmail);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpeg" alt="Logo" className="h-24 w-24 rounded-3xl object-cover shadow-xl transition-transform hover:scale-105 border border-white/10" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Vaani Ai</h1>
          <p className="text-neutral-400 font-bold uppercase tracking-[0.2em] text-[10px]">Digital India Voice Portal</p>

          {/* Selected language badge */}
          {language && (
            <div className="mt-3 inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1">
              <span className="text-lg">{language.flag}</span>
              <span className="text-xs font-bold text-neutral-300">{language.nativeName}</span>
            </div>
          )}

          {/* Listen / Stop instructions button */}
          <div className="mt-4">
            <button
              onClick={handleListenInstructions}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isSpeaking
                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400 animate-pulse'
                : 'bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
            >
              {isSpeaking ? (
                <><VolumeX size={13} />{stopLabel[langCode] || 'Stop'}</>
              ) : (
                <><Volume2 size={13} />{listenLabel[langCode] || 'Listen'}</>
              )}
            </button>
          </div>

          {/* Voice status text */}
          {voiceStatus && (
            <p className="mt-2 text-xs text-cyan-400 font-bold animate-pulse">{voiceStatus}</p>
          )}
        </div>

        <Card className="p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-neutral-800 rounded-[40px] bg-black">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-2 text-center">{t.title}</h2>
              <p className="text-center text-sm text-neutral-400 font-medium">{t.subtitle}</p>
            </div>

            <div className="space-y-5">
              {/* Name field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <User size={12} className="text-cyan-400" />
                  {t.nameLabel}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    disabled={loading}
                    className={`bg-neutral-900 h-12 text-white border-2 rounded-2xl transition-all placeholder:text-neutral-500 ${activeField === 'name'
                      ? 'border-cyan-500 ring-4 ring-cyan-500/20'
                      : 'border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('name')}
                    disabled={loading}
                    title={activeField === 'name' && isListening ? 'Stop listening' : 'Speak your name'}
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${activeField === 'name' && isListening
                      ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50'
                      }`}
                  >
                    {activeField === 'name' && isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Phone size={12} className="text-cyan-400" />
                  {t.phoneLabel}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    disabled={loading}
                    className={`bg-neutral-900 h-12 text-white border-2 rounded-2xl transition-all placeholder:text-neutral-500 ${activeField === 'phone'
                      ? 'border-cyan-500 ring-4 ring-cyan-500/20'
                      : 'border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('phone')}
                    disabled={loading}
                    title={activeField === 'phone' && isListening ? 'Stop listening' : 'Speak your phone number'}
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${activeField === 'phone' && isListening
                      ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50'
                      }`}
                  >
                    {activeField === 'phone' && isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Mail size={12} className="text-cyan-400" />
                  {t.emailLabel}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    disabled={loading}
                    className={`bg-neutral-900 h-12 text-white border-2 rounded-2xl transition-all placeholder:text-neutral-500 ${activeField === 'email'
                      ? 'border-cyan-500 ring-4 ring-cyan-500/20'
                      : 'border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('email')}
                    disabled={loading}
                    title={activeField === 'email' && isListening ? 'Stop listening' : 'Speak your email'}
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${activeField === 'email' && isListening
                      ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50'
                      }`}
                  >
                    {activeField === 'email' && isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-2xl text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-95 h-14 rounded-2xl text-lg font-black shadow-xl transition-all active:scale-95"
            >
              {loading ? t.sending : t.getStarted}
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-10">
          Secure & Privacy Protected | AI Powered
        </p>
      </div>
    </div>
  );
}
