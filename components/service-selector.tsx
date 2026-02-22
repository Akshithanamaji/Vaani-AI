'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GOVERNMENT_SERVICES, SERVICE_CATEGORIES, getTranslatedService } from '@/lib/government-services';
import { speakText, stopSpeaking } from '@/lib/voice-utils';
import { Search, Mic, Shield, Languages, Lock, Mic2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Falling animation keyframes
const FALLING_ANIMATION = `
  @keyframes fallDown {
    0% {
      opacity: 0;
      transform: translateY(-100vh) rotate(10deg) scale(0.5);
    }
    60% {
      opacity: 1;
      transform: translateY(10px) rotate(-2deg) scale(1.05);
    }
    80% {
      transform: translateY(-5px) rotate(1deg) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotate(0) scale(1);
    }
  }

  .card-fall {
    animation: fallDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }
`;

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string;
}

interface ServiceSelectorProps {
  onSelectService?: (service: any) => void;
  language?: Language | string;
  onServiceSelected?: (serviceName: string) => void;
  onLanguageChange?: (language: string) => void;
}

const ServiceSelectorComponent = ({ onSelectService, language, onServiceSelected, onLanguageChange }: ServiceSelectorProps) => {
  const { selectedLanguage } = useLanguage();
  const langCode = selectedLanguage?.code || 'en';
  const voiceCode = selectedLanguage?.voiceCode || 'en-IN';

  const handleClick = (service: any) => {
    if (onSelectService) {
      onSelectService(service);
    } else if (onServiceSelected) {
      onServiceSelected(service.name);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredServices, setFilteredServices] = useState(GOVERNMENT_SERVICES);
  const [isListening, setIsListening] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());

  // Reduced categories for cleaner UI
  const MAIN_CATEGORIES = ['Identity', 'Finance', 'Health', 'Education', 'Employment', 'Transport'];

  useEffect(() => {
    let filtered = GOVERNMENT_SERVICES;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory]);

  // Trigger falling animation for each card one by one
  useEffect(() => {
    setAnimatedCards(new Set()); // Reset animation
    
    filteredServices.forEach((service, index) => {
      setTimeout(() => {
        setAnimatedCards(prev => new Set(prev).add(service.id));
      }, 800 + (index * 80)); // Start cards after hero section (800ms) with 80ms delay between each
    });
  }, [filteredServices]);

  const handleServiceClick = (service: any) => {
    // Speak service selection
    const messages: Record<string, string> = {
      'en': `You selected ${service.name}. Please fill in your details.`,
      'hi': `आपने ${service.name} को चुना है। कृपया अपने विवरण भरें।`,
      'te': `మీరు ${service.name}ను ఎంచుకున్నారు. దయచేసి మీ వివరాలను పూరించండి.`,
      'kn': `ನೀವು ${service.name} ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ತುಂಬಿಸಿ.`,
      'ta': `நீங்கள் ${service.name}ஐத் தேர்ந்தெடுத்துள்ளீர்கள். தயவுசெய்து உங்கள் விவரங்களை நிரப்பவும்.`,
      'ml': `നിങ്ങൾ ${service.name} തിരഞ്ഞെടുത്തു. ദയവായി നിങ്ങളുടെ വിവരങ്ങൾ പൂരിപ്പിക്കുക.`,
      'mr': `आपण ${service.name} निवडले आहे. कृपया आपली माहिती भरा.`,
      'bn': `আপনি ${service.name} নির্বাচন করেছেন। অনুগ্রহ করে আপনার বিস্তারিত তথ্য পূরণ করুন.`,
      'gu': `તમે ${service.name} પસંદ કર્યું છે. કૃપા કરીને તમારી વિગતો ભરો.`,
      'or': `ଆପଣ ${service.name} ଚୟନ କରିଛନ୍ତି। ଦୟାକରି ଆପଣଙ୍କର ବିବରଣୀ ପୂରଣ କରନ୍ତୁ।`,
      'pa': `ਤੁਸੀਂ ${service.name} ਚੁਣਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਵੇਰਵੇ ਭਰੋ।`,
      'ur': `آپ نے ${service.name} منتخب کیا ہے۔ براہ کرم اپنی تفصیلات بھریں۔`,
    };

    const message = messages[langCode] || messages['en'];
    speakText(message, voiceCode);

    setTimeout(() => {
      if (onSelectService) {
        // Pass the original, untranslated service object back
        const originalService = GOVERNMENT_SERVICES.find(s => s.id === service.id);
        onSelectService(originalService);
      } else if (onServiceSelected) {
        onServiceSelected(service.name);
      }
    }, 1500);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search implementation would go here
  };

  const categoryLabels: Record<string, Record<string, string>> = {
    en: {
      title: 'Voice-Powered Government Forms',
      subtitle: 'Fill government forms using your voice in your local language. No typing required.',
      All: 'All Services',
      Identity: 'Identity',
      Finance: 'Finance',
      Health: 'Health',
      Education: 'Education',
      Employment: 'Employment',
      Transport: 'Transport',
      searchPlaceholder: '🎤 Speak to fill forms – Aadhaar, PAN, Passport…',
      availableForms: 'Available Forms',
      servicesFound: 'Services Found',
      noFormsFound: 'No forms found matching your search.',
      trustMessage: '🔒 No data stored permanently • 🎙️ Supports 12+ Indian languages • 🏛️ Designed for Government Services'
    },
    hi: {
      title: 'वॉयस-पावर्ड सरकारी फॉर्म',
      subtitle: 'अपनी स्थानीय भाषा में अपनी आवाज का उपयोग करके सरकारी फॉर्म भरें। टाइप करने की आवश्यकता नहीं है।',
      All: 'सभी सेवाएं',
      Identity: 'पहचान',
      Finance: 'वित्त',
      Health: 'स्वास्थ्य',
      Education: 'शिक्षा',
      Employment: 'रोजगार',
      Transport: 'परिवहन',
      searchPlaceholder: '🎤 फॉर्म भरने के लिए बोलें – आधार, पैन, पासपोर्ट…',
      availableForms: 'उपलब्ध फॉर्म',
      servicesFound: 'सेवाएं मिलीं',
      noFormsFound: 'आपकी खोज से मेल खाने वाला कोई फॉर्म नहीं मिला।',
      trustMessage: '🔒 कोई डेटा स्थायी रूप से संग्रहीत नहीं • 🎙️ 12+ भारतीय भाषाओं का समर्थन • 🏛️ सरकारी सेवाओं के लिए डिज़ाइन'
    },
    te: {
      title: 'వాయిస్-ఆధారిత ప్రభుత్వ ఫారమ్‌లు',
      subtitle: 'మీ స్థానిక భాషలో మీ వాయిస్ ఉపయోగించి ప్రభుత్వ ఫారమ్‌లను పూరించండి. టైపింగ్ అవసరం లేదు.',
      All: 'అన్ని సేవలు',
      Identity: 'గుర్తింపు',
      Finance: 'ఆర్థిక',
      Health: 'ఆరోగ్యం',
      Education: 'విద్య',
      Employment: 'ఉద్యోగం',
      Transport: 'రవాణా',
      searchPlaceholder: '🎤 ఫారమ్‌లను పూరించడానికి మాట్లాడండి – ఆధార్, ప్యాన్, పాస్‌పోర్ట్…',
      availableForms: 'అందుబాటులో ఉన్న ఫారమ్‌లు',
      servicesFound: 'సేవలు కనుగొనబడ్డాయి',
      noFormsFound: 'మీ శోధతో సరిపోలే ఫారమ్‌లు ఏవీ కనుగొనబడలేదు.',
      trustMessage: '🔒 డేటా శాశ్వతంగా నిల్వ చేయబడదు • 🎙️ 12+ భారతీయ భాషల మద్దతు • 🏛️ ప్రభుత్వ సేవల కోసం రూపొందించబడింది'
    },
    kn: {
      title: 'ವಾಯಿಸ್-ಆಧಾರಿತ ಸರ್ಕಾರಿ ಫಾರ್ಮ್‌ಗಳು',
      subtitle: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಧ್ವನಿ ಬಳಸಿ ಸರ್ಕಾರಿ ಫಾರ್ಮ್‌ಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ಟೈಪಿಂಗ್ ಅಗತ್ಯವಿಲ್ಲ.',
      All: 'ಎಲ್ಲಾ ಸೇವೆಗಳು',
      Identity: 'ಗುರುತಿನ ಚೀಟಿ',
      Finance: 'ಹಣಕಾಸು',
      Health: 'ಆರೋಗ್ಯ',
      Education: 'ಶಿಕ್ಷಣ',
      Employment: 'ಉದ್ಯೋಗ',
      Transport: 'ಸಾರಿಗೆ',
      searchPlaceholder: '🎤 ಫಾರ್ಮ್‌ಗಳನ್ನು ತುಂಬಿಸಲು ಮಾತನಾಡಿ – ಆಧಾರ್, ಪ್ಯಾನ್, ಪಾಸ್‌ಪೋರ್ಟ್…',
      availableForms: 'ಲಭ್ಯವಿರುವ ಫಾರ್ಮ್‌ಗಳು',
      servicesFound: 'ಸೇವೆಗಳು ಕಂಡುಬಂದವು',
      noFormsFound: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಫಾರ್ಮ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      trustMessage: '🔒 ಡೇಟಾ ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ • 🎙️ 12+ ಭಾರತೀಯ ಭಾಷೆಗಳ ಬೆಂಬಲ • 🏛️ ಸರ್ಕಾರಿ ಸೇವೆಗಳಿಗೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ'
    },
    ta: {
      title: 'குரல்-இயங்கும் அரசாங்க படிவங்கள்',
      subtitle: 'உங்கள் உள்ளூர் மொழியில் உங்கள் குரலைப் பயன்படுத்தி அரசாங்க படிவங்களை நிரப்பவும். தட்டச்சு செய்ய வேண்டிய அவசியமில்லை.',
      All: 'அனைத்து சேவைகளும்',
      Identity: 'அடையாளம்',
      Finance: 'நிதி',
      Health: 'உடல்நலம்',
      Education: 'கல்வி',
      Employment: 'வேலைவாய்ப்பு',
      Transport: 'போக்குவரத்து',
      searchPlaceholder: '🎤 படிவங்களை நிரப்ப பேசுங்கள் – ஆதார், பான், பாஸ்போர்ட்…',
      availableForms: 'கிடைக்கும் படிவங்கள்',
      servicesFound: 'சேவைகள் கிடைத்தன',
      noFormsFound: 'உங்கள் தேடலுடன் பொருந்தும் படிவங்கள் எதுவும் கிடைக்கவில்லை.',
      trustMessage: '🔒 தரவு நிரந்தரமாக சேமிக்கப்படாது • 🎙️ 12+ இந்திய மொழிகள் ஆதரவு • 🏛️ அரசு சேவைகளுக்கு வடிவமைக்கப்பட்டது'
    },
    ml: {
      title: 'വോയ്സ്-പവേർഡ് ഗവൺമെന്റ് ഫോമുകൾ',
      subtitle: 'നിങ്ങളുടെ പ്രാദേശിക ഭാഷയിൽ നിങ്ങളുടെ ശബ്ദം ഉപയോഗിച്ച് സർക്കാർ ഫോമുകൾ പൂരിപ്പിക്കുക. ടൈപ്പിംഗ് ആവശ്യമില്ല.',
      All: 'എല്ലാ സേവനങ്ങളും',
      Identity: 'തിരിച്ചറിയൽ',
      Finance: 'സാമ്പത്തികം',
      Health: 'ആരോഗ്യം',
      Education: 'വിദ്യാഭ്യാസം',
      Employment: 'തൊഴിൽ',
      Transport: 'ഗതാഗതം',
      searchPlaceholder: '🎤 ഫോംകൾ പൂരിപ്പിക്കാൻ സംസാരിക്കുക – ആധാർ, പാൻ, പാസ്പോർട്ട്…',
      availableForms: 'ലഭ്യമായ ഫോമുകൾ',
      servicesFound: 'സേവനങ്ങൾ കണ്ടെത്തി',
      noFormsFound: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന ഫോമുകൾ ഒന്നും കണ്ടെത്തിയില്ല.',
      trustMessage: '🔒 ഡാറ്റ നിരന്തരമായി സംഭരിക്കപ്പെടുന്നില്ല • 🎙️ 12+ ഇന്ത്യൻ ഭാഷകൾ പിന്തുണ • 🏛️ സർക്കാർ സേവനങ്ങൾക്കായി രൂപകൽപ്പന ചെയ്തത്'
    },
    mr: {
      title: 'व्हॉइस-पॉवर्ड सरकारी फॉर्म',
      subtitle: 'आपल्या स्थानिक भाषेत आपला आवाज वापरून सरकारी फॉर्म भरा. टायपिंगची गरज नाही.',
      All: 'सर्व सेवा',
      Identity: 'ओळख',
      Finance: 'वित्त',
      Health: 'आरोग्य',
      Education: 'शिक्षण',
      Employment: 'रोजगार',
      Transport: 'वाहतूक',
      searchPlaceholder: '🎤 फॉर्म भरण्यासाठी बोला – आधार, पॅन, पासपोर्ट…',
      availableForms: 'उपलब्ध फॉर्म',
      servicesFound: 'सेवा सापडल्या',
      noFormsFound: 'तुमच्या शोधाशी जुळणारे कोणतेही फॉर्म आढळले नाहीत.',
      trustMessage: '🔒 डेटा कायमस्वरूपी संग्रहित केला जात नाही • 🎙️ 12+ भारतीय भाषा समर्थन • 🏛️ सरकारी सेवांसाठी डिझाइन केले'
    },
    bn: {
      title: 'ভয়েস-চালিত সরকারি ফর্ম',
      subtitle: 'আপনার স্থানীয় ভাষায় আপনার ভয়েস ব্যবহার করে সরকারি ফর্ম পূরণ করুন। টাইপ করার প্রয়োজন নেই।',
      All: 'সমস্ত পরিষেবা',
      Identity: 'পরিচয়',
      Finance: 'অর্থ',
      Health: 'স্বাস্থ্য',
      Education: 'শিক্ষা',
      Employment: 'কর্মসংস্থান',
      Transport: 'পরিবহন',
      searchPlaceholder: '🎤 ফর্ম পূরণ করতে বলুন – আধার, প্যান, পাসপোর্ট…',
      availableForms: 'উপলব্ধ ফর্ম',
      servicesFound: 'পরিষেবা পাওয়া গেছে',
      noFormsFound: 'আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনও ফর্ম পাওয়া যায়নি।',
      trustMessage: '🔒 ডেটা স্থায়ীভাবে সংরক্ষণ করা হয় না • 🎙️ 12+ ভারতীয় ভাষা সমর্থন • 🏛️ সরকারী পরিষেবার জন্য ডিজাইন করা হয়েছে'
    },
    gu: {
      title: 'અવાજ-સંચાલિત સરકારી ફોર્મ્સ',
      subtitle: 'તમારી સ્થાનિક ભાષામાં તમારા અવાજનો ઉપયોગ કરીને સરકારી ફોર્મ્સ ભરો. ટાઈપ કરવાની જરૂર નથી.',
      All: 'બધી સેવાઓ',
      Identity: 'ઓળખ',
      Finance: 'નાણાકીય',
      Health: 'સ્વાસ્થ્ય',
      Education: 'શિક્ષણ',
      Employment: 'રોજગાર',
      Transport: 'પરિવહન',
      searchPlaceholder: '🎤 ફોર્મ ભરવા માટે બોલો – આધાર, પૅન, પાસપોર્ટ…',
      availableForms: 'ઉપલબ્ધ ફોર્મ',
      servicesFound: 'સેવાઓ મળી',
      noFormsFound: 'તમારી શોધ સાથે મેળ ખાતી કોઈ ફોર્મ મળી નથી.',
      trustMessage: '🔒 ડેટા કાયમી રૂપે સંગ્રહિત નથી • 🎙️ 12+ ભારતીય ભાષાઓ સમર્થન • 🏛️ સરકારી સેવાઓ માટે ડિઝાઇન કરેલું'
    },
    or: {
      title: 'ଭଏସ-ପାୱାର୍ଡ ସରକାରୀ ଫର୍ମ',
      subtitle: 'ଆପଣଙ୍କ ସ୍ଥାନୀୟ ଭାଷାରେ ଆପଣଙ୍କ ସ୍ୱର ବ୍ୟବହାର କରି ସରକାରୀ ଫର୍ମ ପୂରଣ କରନ୍ତୁ | ଟାଇପ୍ କରିବାର ଆବଶ୍ୟକତା ନାହିଁ |',
      All: 'ସମସ୍ତ ସେବା',
      Identity: 'ପରିଚୟ',
      Finance: 'ଅର୍ଥ',
      Health: 'ସ୍ୱାସ୍ଥ୍ୟ',
      Education: 'ଶିକ୍ଷା',
      Employment: 'ରୋଜଗାର',
      Transport: 'ପରିବହନ',
      searchPlaceholder: '🎤 ଫର୍ମ ପୂରଣ କରିବାକୁ କୁହନ୍ତୁ – ଆଧାର, ପ୍ୟାନ, ପାସପୋର୍ଟ…',
      availableForms: 'ଉପଲବ୍ଧ ଫର୍ମ',
      servicesFound: 'ସେବା ମିଳିଲା',
      noFormsFound: 'ଆପଣଙ୍କର ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ଫର୍ମ ମିଳିଲା ନାହିଁ।',
      trustMessage: '🔒 ଡାଟା ସ୍ଥାୟୀ ଭାବରେ ସଂରକ୍ଷିତ ହୋଇନାହିଁ • 🎙️ 12+ ଭାରତୀୟ ଭାଷା ସମର୍ଥନ • 🏛️ ସରକାରୀ ସେବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି'
    },
    pa: {
      title: 'ਵਾਇਸ-ਪਾਵਰਡ ਸਰਕਾਰੀ ਫਾਰਮ',
      subtitle: 'ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਆਪਣੀ ਆਵਾਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਰਕਾਰੀ ਫਾਰਮ ਭਰੋ। ਟਾਈਪ ਕਰਨ ਦੀ ਕੋਈ ਲੋੜ ਨਹੀਂ।',
      All: 'ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ',
      Identity: 'ਪਛਾਣ',
      Finance: 'ਵਿੱਤ',
      Health: 'ਸਿਹਤ',
      Education: 'ਸਿੱਖਿਆ',
      Employment: 'ਰੁਜ਼ਗਾਰ',
      Transport: 'ਆਵਾਜਾਈ',
      searchPlaceholder: '🎤 ਫਾਰਮ ਭਰਨ ਲਈ ਬੋਲੋ – ਆਧਾਰ, ਪੈਨ, ਪਾਸਪੋਰਟ…',
      availableForms: 'ਉਪਲਬਧ ਫਾਰਮ',
      servicesFound: 'ਸੇਵਾਵਾਂ ਮਿਲੀਆਂ',
      noFormsFound: 'ਤੁਹਾਡੀ ਖੋਜ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਫਾਰਮ ਨਹੀਂ ਮਿਲਿਆ।',
      trustMessage: '🔒 ਡਾਟਾ ਸਥਾਈ ਤੌਰ ਤੇ ਸਟੋਰ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ • 🎙️ 12+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਦਾ ਸਮਰਥਨ • 🏛️ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ'
    },
    ur: {
      title: 'وائس سے چلنے والے حکومتی فارمز',
      subtitle: 'اپنی مقامی زبان میں اپنی آواز کا استعمال کرتے ہوئے حکومتی فارمز بھریں۔ ٹائپ کرنے کی ضرورت نہیں ہے۔',
      All: 'تمام خدمات',
      Identity: 'شناخت',
      Finance: 'مالیات',
      Health: 'صحت',
      Education: 'تعلیم',
      Employment: 'روزگار',
      Transport: 'نقل و حمل',
      searchPlaceholder: '🎤 فارم بھرنے کے لیے بولیں – آدھار، پن، پاسپورٹ…',
      availableForms: 'دستیاب فارم',
      servicesFound: 'خدمات ملیں',
      noFormsFound: 'آپ کی تلاش سے ملنے والا کوئی فارم نہیں ملا۔',
      trustMessage: '🔒 ڈیٹا مستقل طور پر محفوظ نہیں کیا جاتا • 🎙️ 12+ ہندوستانی زبانیں سپورٹ • 🏛️ سرکاری خدمات کے لیے ڈیزائن کیا گیا'
    }
  };

  const currentLabels = categoryLabels[langCode] || categoryLabels['en'];

  return (
    <div className="min-h-screen bg-black">
      {/* Inject falling animation styles */}
      <style dangerouslySetInnerHTML={{ __html: FALLING_ANIMATION }} />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        {/* Small Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 border border-white/20 card-fall" style={{ animationDelay: '0s' }}>
            <span className="text-cyan-400">✦</span>
            {currentLabels.subtitle}
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight card-fall" style={{ animationDelay: '0.08s' }}>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              {currentLabels.title}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto card-fall" style={{ animationDelay: '0.16s' }}>
            Fill government forms using your voice in your local language
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 card-fall" style={{ animationDelay: '0.24s' }}>
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={currentLabels.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-16 text-base bg-transparent text-white placeholder-gray-500 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleVoiceSearch}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl transition-all ${isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                }`}
            >
              <Mic className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory('All')}
            className={`h-9 px-4 rounded-full text-sm font-medium transition-all card-fall ${selectedCategory === 'All'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
            style={{ animationDelay: '0.32s' }}
          >
            {currentLabels.All}
          </Button>
          {MAIN_CATEGORIES.map((category, index) => {
            const icons: Record<string, string> = {
              Identity: '🆔',
              Finance: '💰',
              Health: '🏥',
              Education: '📚',
              Employment: '💼',
              Transport: '🚗'
            };
            return (
              <Button
                key={category}
                variant="ghost"
                onClick={() => setSelectedCategory(category)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-all card-fall ${selectedCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                style={{ animationDelay: `${0.32 + ((index + 1) * 0.06)}s` }}
              >
                {icons[category]} {currentLabels[category] || category}
              </Button>
            );
          })}
        </div>

        {/* Services Count */}
        <p className="text-center text-gray-500 text-sm mb-6 card-fall" style={{ animationDelay: '0.74s' }}>
          {filteredServices.length} {currentLabels.servicesFound}
        </p>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredServices.map((service, index) => {
            const translatedService = getTranslatedService(service, langCode);
            const isAnimated = animatedCards.has(service.id);
            
            return (
              <Card
                key={service.id}
                className={`p-4 bg-neutral-900 hover:bg-neutral-800 hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300 rounded-2xl group border border-neutral-800 ${
                  isAnimated ? 'card-fall' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${0.8 + (index * 0.08)}s`
                }}
                onClick={() => handleServiceClick(translatedService)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {translatedService.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm leading-tight group-hover:text-cyan-400 transition-colors">
                      {translatedService.name}
                    </h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-neutral-400 text-lg">{currentLabels.noFormsFound}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ServiceSelector = ServiceSelectorComponent;
export default ServiceSelectorComponent;
