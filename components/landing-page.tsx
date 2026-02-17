'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, QrCode, Shield, Users, Languages, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Language {
  code: 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml' | 'mr' | 'bn' | 'gu' | 'or' | 'pa' | 'ur';
  name: string;
  nativeName: string;
  flag: string;
}

interface LandingPageProps {
  onGetStarted: () => void;
  onStartSpeaking: () => void;
  selectedLanguage: Language | null;
}

// Voice instructions in all 12 languages
const voiceInstructions: Record<string, string> = {
  en: 'Please click on Start Speaking button first and select your language.',
  hi: 'कृपया पहले स्टार्ट स्पीकिंग बटन पर क्लिक करें और अपनी भाषा चुनें।',
  te: 'దయచేసి మొదట స్టార్ట్ స్పీకింగ్ బటన్ పై క్లిక్ చేసి మీ భాషను ఎంచుకోండి.',
  kn: 'ದಯವಿಟ್ಟು ಮೊದಲು ಸ್ಟಾರ್ಟ್ ಸ್ಪೀಕಿಂಗ್ ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  ta: 'முதலில் ஸ்டார்ட் ஸ்பீக்கிங் பட்டனை கிளிக் செய்து உங்கள் மொழியை தேர்ந்தெடுக்கவும்.',
  ml: 'ദയവായി ആദ്യം സ്റ്റാർട്ട് സ്പീക്കിംഗ് ബട്ടണിൽ ക്ലിക്ക് ചെയ്ത് നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.',
  mr: 'कृपया प्रथम स्टार्ट स्पीकिंग बटणावर क्लिक करा आणि आपली भाषा निवडा.',
  bn: 'অনুগ্রহ করে প্রথমে স্টার্ট স্পিকিং বোতামে ক্লিক করুন এবং আপনার ভাষা নির্বাচন করুন।',
  gu: 'કૃપા કરીને પહેલા સ્ટાર્ટ સ્પીકિંગ બટન પર ક્લિક કરો અને તમારી ભાષા પસંદ કરો.',
  or: 'ଦୟାକରି ପ୍ରଥମେ ଷ୍ଟାର୍ଟ ସ୍ପିକିଂ ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ।',
  pa: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਸਟਾਰਟ ਸਪੀਕਿੰਗ ਬਟਨ ਤੇ ਕਲਿੱਕ ਕਰੋ ਅਤੇ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ।',
  ur: 'براہ کرم پہلے سٹارٹ سپیکنگ بٹن پر کلک کریں اور اپنی زبان منتخب کریں۔',
};

const landingLabels = {
  en: {
    title: 'Voice-Powered Government Forms',
    subtitle: 'Fill government forms in your local language using just your voice.',
    startSpeaking: 'Start Speaking',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    digitalIndia: 'Digital India Initiative',
    secure: 'Secure',
    whyVaani: 'Why Vaani Ai?',
    breakingBarriers: 'Breaking literacy barriers with voice technology',
    howItWorks: 'How It Works',
    readyStarted: 'Ready to Get Started?',
    startNow: 'Get Started Now',
  },
  hi: {
    title: 'वॉयस-पावर्ड सरकारी फॉर्म',
    subtitle: 'अपनी स्थानीय भाषा में सिर्फ अपनी आवाज का इस्तेमाल करके सरकारी फॉर्म भरें।',
    startSpeaking: 'बोलना शुरू करें',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    digitalIndia: 'डिजिटल इंडिया पहल',
    secure: 'सुरक्षित',
    whyVaani: 'वानी AI क्यों?',
    breakingBarriers: 'वॉयस टेक्नोलॉजी के साथ साक्षरता बाधाओं को तोड़ना',
    howItWorks: 'यह कैसे काम करता है',
    readyStarted: 'शुरू करने के लिए तैयार हैं?',
    startNow: 'अभी शुरू करें',
  },
  te: {
    title: 'వాయిస్-ఆధారిత ప్రభుత్వ ఫారమ్‌లు',
    subtitle: 'మీ స్థానిక భాషలో సిర్ఫ మీ వాయిస్ ఉపయోగించి ప్రభుత్వ ఫారమ్‌లను పూరించండి.',
    startSpeaking: 'మాట్లాడటం ప్రారంభించండి',
    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరిన్ని తెలుసుకోండి',
    digitalIndia: 'డిజిటల్ ఇండియా సంచిక',
    secure: 'సురక్షితమైన',
    whyVaani: 'వానీ AI ఎందుకు?',
    breakingBarriers: 'వాయిస్ టెక్నాలజీ ద్వారా సాక్ష్యరత బాధలను విచ్ఛిన్నం చేయడం',
    howItWorks: 'ఇది ఎలా కార్యం చేస్తుంది',
    readyStarted: 'ప్రారంభం చేయడానికి సిద్ధమైనారా?',
    startNow: 'ఇప్పుడు ప్రారంభించండి',
  },
  kn: {
    title: 'ವಾಯಿಸ್-ಆಧಾರಿತ ಸರ್ಕಾರಿ ಫಾರ್ಮ್‌ಗಳು',
    subtitle: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಕೇವಲ ನಿಮ್ಮ ಧ್ವನಿ ಬಳಸಿ ಸರ್ಕಾರಿ ಫಾರ್ಮ್‌ಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
    startSpeaking: 'ಮಾತನಾಡುವುದು ಪ್ರಾರಂಭಿಸಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    learnMore: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ',
    digitalIndia: 'ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉದ್ಯೋಗ',
    secure: 'ಸುರಕ್ಷಿತ',
    whyVaani: 'ವಾಣಿ AI ಏಕೆ?',
    breakingBarriers: 'ವೈಶ್ವಿಕ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ಸಾಕ್ಷರತೆ ತೊಂದರೆಗಳನ್ನು ಮುರಿಯುವುದು',
    howItWorks: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    readyStarted: 'ಶುರು ಮಾಡಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ?',
    startNow: 'ಈಗ ಶೂರು ಮಾಡಿ',
  },
  ta: {
    title: 'குரல் சக்தியால் கட்டப்பட்ட அரசாங்க ஆவணங்கள்',
    subtitle: 'உங்கள் உள்ளூர் மொழியில் உங்கள் குரலை வைத்து அரசாங்க படிவங்களை நிரப்பவும்.',
    startSpeaking: 'பேசத் தொடங்கவும்',
    getStarted: 'தொடங்கவும்',
    learnMore: 'மேலும் அறிக',
    digitalIndia: 'டிஜிட்டல் இந்தியா முயற்சி',
    secure: 'பாதுகாப்பான',
    whyVaani: 'வாணி AI ஏன்?',
    breakingBarriers: 'குரல் தொழில்நுட்பத்துடன் சாক்ষரத தடைகளை உடைப்பது',
    howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
    readyStarted: 'தொடங்க தயாரா?',
    startNow: 'இப்போது தொடங்கவும்',
  },
  ml: {
    title: 'കണ്ഠസ്വര ആധാരിത സരകാരി ഫോമുകൾ',
    subtitle: 'നിങ്ങളുടെ പ്രാദേശിക ഭാഷയിൽ നിങ്ങളുടെ കണ്ഠസ്വരം മാത്രം ഉപയോഗിച്ച് സർകാരി ഫോമുകൾ പൂരിപ്പിക്കുക.',
    startSpeaking: 'സംസാരം തുടങ്ങുക',
    getStarted: 'ആരംഭിക്കുക',
    learnMore: 'കൂടുതൽ അറിയുക',
    digitalIndia: 'ഡിജിറ്റൽ ഇന്ത്യ സംരംഭണം',
    secure: 'സുരക്ഷിതമായ',
    whyVaani: 'വാണി AI എന്തെന്ന് കാരണം?',
    breakingBarriers: 'കണ്ഠസ്വര സാങ്കേതിക വിദ്യ വഴി സാക്ഷരത തടസ്സ തകർക്കുക',
    howItWorks: 'ഇത് എങ്ങനെ സംരംഭിക്കുന്നു',
    readyStarted: 'ആരംഭിക്കാൻ പ്രസ്തുത?',
    startNow: 'ഇപ്പോൾ ആരംഭിക്കുക',
  },
  mr: {
    title: 'व्हॉयस-आधारित सरकारी फॉर्म',
    subtitle: 'आपल्या स्थानिक भाषेत केवळ आपल्या व्हॉयसचा वापर करून सरकारी फॉर्म भरा.',
    startSpeaking: 'बोलायला सुरुवात करा',
    getStarted: 'सुरुवात करा',
    learnMore: 'अधिक जाणून घ्या',
    digitalIndia: 'डिजिटल इंडिया पहल',
    secure: 'सुरक्षित',
    whyVaani: 'वाणी AI का?',
    breakingBarriers: 'व्हॉयस तंत्रज्ञान सह साक्षरता अडचणी तोडणे',
    howItWorks: 'हे कसे कार्य करते',
    readyStarted: 'सुरुवात करण्यासाठी तयार?',
    startNow: 'आता सुरुवात करा',
  },
  bn: {
    title: 'ভয়েস-চালিত সরকারি ফর্ম',
    subtitle: 'আপনার স্থানীয় ভাষায় কেবল আপনার ভয়েস ব্যবহার করে সরকারি ফর্ম পূরণ করুন।',
    startSpeaking: 'কথা বলা শুরু করুন',
    getStarted: 'শুরু করুন',
    learnMore: 'আরও জানুন',
    digitalIndia: 'ডিজিটাল ইন্ডিয়া উদ্যোগ',
    secure: 'সুরক্ষিত',
    whyVaani: 'ভানী AI কেন?',
    breakingBarriers: 'ভয়েস প্রযুক্তির সাথে সাক্ষরতার বাধা ভাঙা',
    howItWorks: 'এটি কীভাবে কাজ করে',
    readyStarted: 'শুরু করতে প্রস্তুত?',
    startNow: 'এখনই শুরু করুন',
  },
  gu: {
    title: 'અવાજ-આધારિત સરકારી ફોર્મ્સ',
    subtitle: 'તમારી સ્થાનિક ભાષામાં માત્ર તમારાં અવાજનો ઉપયોગ કરીને સરકારી ફોર્મ્સ ભરો.',
    startSpeaking: 'બોલવું શરૂ કરો',
    getStarted: 'શરૂ કરો',
    learnMore: 'વધુ જાણો',
    digitalIndia: 'ડિજિટલ ઇન્ડિયા ઉદ્યોગ',
    secure: 'સુરક્ષિત',
    whyVaani: 'વાણી AI કેમ?',
    breakingBarriers: 'અવાજ તકનીક સાથે સાક્ષરતાની અવરોધ તોડવી',
    howItWorks: 'તે કેવી રીતે કાર્ય કરે છે',
    readyStarted: 'શરૂ કરવા માટે તૈયાર?',
    startNow: 'હવે શરૂ કરો',
  },
  or: {
    title: 'ଭଏସ-ଆଧାରିତ ସରକାରୀ ଫର୍ମ',
    subtitle: 'ଆପଣଙ୍କ ସ୍ଥାନୀୟ ଭାଷାରେ କେବଳ ଆପଣଙ୍କ ଭଏସ ବ୍ୟବହାର କରି ସରକାରୀ ଫର୍ମ ପୂରଣ କରନ୍ତୁ।',
    startSpeaking: 'କହିବା ଆରମ୍ଭ କରନ୍ତୁ',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
    learnMore: 'ଅଧିକ ଜାଣନ୍ତୁ',
    digitalIndia: 'ଡିଜିଟାଲ ଇଣ୍ଡିଆ ପଦକ୍ଷେପ',
    secure: 'ସୁରକ୍ଷିତ',
    whyVaani: 'ଭୟସ୍ଥି AI କାହିଁକି?',
    breakingBarriers: 'ଭଏସ ରଣନୀତି ସହ ସାକ୍ଷରତା ଦିଗ ଭାଙ୍ଗି ଦେବା',
    howItWorks: 'ଏଟା କିଭାବେ କାଜ କରେ',
    readyStarted: 'ଆରମ୍ଭ ସିଦ୍ଧ?',
    startNow: 'ଏବେ ଆରମ୍ଭ କରନ୍ତୁ',
  },
  pa: {
    title: 'ਵਾਇਸ-ਆਧਾਰਿਤ ਸਰਕਾਰੀ ਫਾਰਮ',
    subtitle: 'ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਸਿਰਫ਼ ਆਪਣੀ ਆਵਾਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਰਕਾਰੀ ਫਾਰਮ ਭਰੋ।',
    startSpeaking: 'ਬੋਲਨਾ ਸ਼ੁਰੂ ਕਰੋ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    learnMore: 'ਹੋਰ ਜਾਣੋ',
    digitalIndia: 'ਡਿਜੀਟਲ ਇੰਡੀਆ ਯੋਜਨਾ',
    secure: 'ਸੁਰੱਖਿਅਤ',
    whyVaani: 'ਵਾਂਈ AI ਕਿਉਂ?',
    breakingBarriers: 'ਵਾਇਸ ਪ੍ਰਣਾਲੀ ਦੀ ਸਹਾਇਤਾ ਨਾਲ ਸਾਖਰਤਾ ਦੀ ਰੁਕਾਵਟ ਤੋੜਨਾ',
    howItWorks: 'ਇਹ ਕਿਵੇ ਕਾਮ ਕਰਦਾ ਹੈ',
    readyStarted: 'ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ?',
    startNow: 'ਹੁਣ ਸ਼ੁਰੂ ਕਰੋ',
  },
  ur: {
    title: 'وائس سے چلنے والی حکومتی فارمز',
    subtitle: 'اپنی مقامی زبان میں محض اپنی آواز کے ذریعے حکومتی فارمز بھریں۔',
    startSpeaking: 'بات کرنا شروع کریں',
    getStarted: 'شروع کریں',
    learnMore: 'مزید جانیں',
    digitalIndia: 'ڈیجیٹل انڈیہ منصوبہ',
    secure: 'محفوظ',
    whyVaani: 'وانی AI کیوں؟',
    breakingBarriers: 'وائس ٹیکنالوجی سے خواندگی کی رکاوٹ توڑنا',
    howItWorks: 'یہ کیسے کام کرتا ہے',
    readyStarted: 'شروع کرنے کے لیے تیار ہیں؟',
    startNow: 'اب شروع کریں',
  },
};

export function LandingPage({ onGetStarted, onStartSpeaking, selectedLanguage }: LandingPageProps) {
  // Always show English on landing page
  const currentLabels = landingLabels['en'];
  const [isPlayingInstruction, setIsPlayingInstruction] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentLangIndex = useRef(0);
  
  // Play voice instructions in all languages sequentially
  const playVoiceInstructions = async () => {
    if (isPlayingInstruction) return;
    setIsPlayingInstruction(true);
    
    const languages = ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'ur'];
    currentLangIndex.current = 0;
    
    const playNextLanguage = async () => {
      if (currentLangIndex.current >= languages.length) {
        setIsPlayingInstruction(false);
        return;
      }
      
      const lang = languages[currentLangIndex.current];
      const text = voiceInstructions[lang];
      
      try {
        const response = await fetch(`/api/tts-proxy?text=${encodeURIComponent(text)}&lang=${lang}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          if (audioRef.current) {
            audioRef.current.pause();
          }
          
          audioRef.current = new Audio(url);
          audioRef.current.onended = () => {
            URL.revokeObjectURL(url);
            currentLangIndex.current++;
            playNextLanguage();
          };
          audioRef.current.onerror = () => {
            URL.revokeObjectURL(url);
            currentLangIndex.current++;
            playNextLanguage();
          };
          await audioRef.current.play();
        } else {
          currentLangIndex.current++;
          playNextLanguage();
        }
      } catch {
        currentLangIndex.current++;
        playNextLanguage();
      }
    };
    
    playNextLanguage();
  };
  
  // Block Get Started if no language selected
  const handleGetStartedClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!selectedLanguage) {
      playVoiceInstructions();
      return;
    }
    
    onGetStarted();
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Vaani Ai</span>
              {selectedLanguage && (
                <div className="ml-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 text-sm font-semibold rounded-full border border-white/20">
                  <span>{selectedLanguage.flag}</span>
                  <span>{selectedLanguage.nativeName}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={onStartSpeaking} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white rounded-full px-6 font-semibold border-0">
                {currentLabels.startSpeaking}
              </Button>
              <Button onClick={handleGetStartedClick} className={`rounded-full px-6 font-semibold border ${selectedLanguage ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse'}`}>
                {isPlayingInstruction ? '🔊 Listen...' : currentLabels.getStarted}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {currentLabels.title}
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {currentLabels.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onStartSpeaking} size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white h-14 px-8 rounded-lg text-lg font-bold border-0 shadow-lg">
              <Mic className="mr-2 h-5 w-5" />
              {currentLabels.startSpeaking}
            </Button>
            <Button onClick={handleGetStartedClick} size="lg" className={`h-14 px-8 rounded-lg text-lg font-bold border-0 shadow-sm ${selectedLanguage ? 'bg-white text-black hover:bg-gray-100' : 'bg-yellow-500/30 text-yellow-400 animate-pulse cursor-pointer'}`}>
              {isPlayingInstruction ? '🔊 Listen...' : currentLabels.getStarted}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {currentLabels.whyVaani}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border-0">
              <QrCode className="h-8 w-8 text-cyan-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{currentLabels.secure}</h3>
              <p className="text-gray-600">Your data is encrypted and automatically deleted after 24 hours.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border-0">
              <Languages className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{currentLabels.breakingBarriers}</h3>
              <p className="text-gray-600">Speak in your own language. We support 12+ Indian languages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 p-12 rounded-2xl text-white text-center shadow-lg">
          <h2 className="text-4xl font-bold mb-4">{currentLabels.readyStarted}</h2>
          <Button onClick={handleGetStartedClick} size="lg" className={`h-14 px-10 rounded-full text-lg font-bold border-0 ${selectedLanguage ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-yellow-400 text-black animate-pulse'}`}>
            {isPlayingInstruction ? '🔊 Listen...' : currentLabels.startNow}
          </Button>
        </div>
      </section>
    </div>
  );
}
