'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Bot, X, Loader2, StopCircle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { speakText, stopSpeaking } from '@/lib/voice-utils';
import { useAudioRecorder } from '@/lib/audio-recorder';
import { transcribeWithGroqWhisper } from '@/lib/voice-utils';

interface Message {
    id: string;
    role: 'bot' | 'user';
    text: string;
}

interface AiChatbotProps {
    userEmail?: string | null;
    serviceName?: string;
}

// Multilingual static strings for the chatbot UI
const chatbotStrings: Record<string, {
    greeting: string;
    greetingWithService: (name: string) => string;
    thinking: string;
    askServices: string;
    listening: string;
    askPlaceholder: string;
    errorIssue: string;
    errorNetwork: string;
    errorHearing: string;
    errorMic: string;
}> = {
    'en': {
        greeting: "Hello! I am Vaani AI. I am here to explain government services, their benefits, and where they can be used.",
        greetingWithService: (name) => `Hello! I can explain everything about the ${name}. What would you like to know about its benefits or uses?`,
        thinking: "Thinking...",
        askServices: "Ask about Services",
        listening: "Listening...",
        askPlaceholder: "Ask what the application does...",
        errorIssue: "Sorry, I encountered an issue. Please try asking again.",
        errorNetwork: "Sorry, I encountered a network error. Please try again.",
        errorHearing: "Sorry, I had trouble hearing that. Please try speaking again or typing your answer.",
        errorMic: "Microphone permission denied. Please use text input.",
    },
    'hi': {
        greeting: "नमस्ते! मैं वाणी AI हूँ। मैं सरकारी सेवाओं, उनके लाभों और उनके उपयोग की जगह के बारे में बताने के लिए यहाँ हूँ।",
        greetingWithService: (name) => `नमस्ते! मैं ${name} के बारे में सब कुछ समझा सकता हूँ। आप इसके लाभ या उपयोग के बारे में क्या जानना चाहते हैं?`,
        thinking: "सोच रहे हैं...",
        askServices: "सेवाओं के बारे में पूछें",
        listening: "सुन रहे हैं...",
        askPlaceholder: "पूछें कि आवेदन क्या करता है...",
        errorIssue: "माफ़ करें, कोई समस्या आई। कृपया फिर से पूछें।",
        errorNetwork: "माफ़ करें, नेटवर्क त्रुटि हुई। कृपया फिर से प्रयास करें।",
        errorHearing: "माफ़ करें, मुझे सुनने में परेशानी हुई। कृपया फिर से बोलें या टाइप करें।",
        errorMic: "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया टेक्स्ट इनपुट का उपयोग करें।",
    },
    'te': {
        greeting: "నమస్కారం! నేను వాణి AI. సర్కారు సేవలు, వాటి ప్రయోజనాలు మరియు ఎక్కడ ఉపయోగించవచ్చో వివరించడానికి నేను ఇక్కడ ఉన్నాను.",
        greetingWithService: (name) => `నమస్కారం! నేను ${name} గురించి అన్నీ వివరించగలను. దాని ప్రయోజనాలు లేదా ఉపయోగాల గురించి మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`,
        thinking: "ఆలోచిస్తున్నాను...",
        askServices: "సేవల గురించి అడగండి",
        listening: "వింటున్నాను...",
        askPlaceholder: "దరఖాస్తు ఏమి చేస్తుందో అడగండి...",
        errorIssue: "క్షమించండి, సమస్య ఏర్పడింది. దయచేసి మళ్ళీ అడగండి.",
        errorNetwork: "క్షమించండి, నెట్‌వర్క్ లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.",
        errorHearing: "క్షమించండి, వినడంలో ఇబ్బంది ఉంది. దయచేసి మళ్ళీ మాట్లాడండి.",
        errorMic: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి టెక్స్ట్ ఉపయోగించండి.",
    },
    'kn': {
        greeting: "ನಮಸ್ಕಾರ! ನಾನು ವಾಣಿ AI. ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ಅವುಗಳ ಪ್ರಯೋಜನಗಳು ಮತ್ತು ಎಲ್ಲಿ ಬಳಸಬಹುದು ಎಂದು ವಿವರಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.",
        greetingWithService: (name) => `ನಮಸ್ಕಾರ! ನಾನು ${name} ಬಗ್ಗೆ ಎಲ್ಲವನ್ನೂ ವಿವರಿಸಬಲ್ಲೆ. ಅದರ ಪ್ರಯೋಜನಗಳು ಅಥವಾ ಉಪಯೋಗಗಳ ಬಗ್ಗೆ ನೀವು ಏನನ್ನು ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ?`,
        thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
        askServices: "ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ",
        listening: "ಆಲಿಸುತ್ತಿದ್ದೇನೆ...",
        askPlaceholder: "ಅರ್ಜಿ ಏನು ಮಾಡುತ್ತದೆ ಎಂದು ಕೇಳಿ...",
        errorIssue: "ಕ್ಷಮಿಸಿ, ಸಮಸ್ಯೆ ಎದುರಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಕೇಳಿ.",
        errorNetwork: "ಕ್ಷಮಿಸಿ, ನೆಟ್‌ವರ್ಕ್ ದೋಷ ಆಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        errorHearing: "ಕ್ಷಮಿಸಿ, ಕೇಳಲು ತೊಂದರೆ ಆಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
        errorMic: "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಟೆಕ್ಸ್ಟ್ ಇನ್‌ಪುಟ್ ಬಳಸಿ.",
    },
    'ta': {
        greeting: "வணக்கம்! நான் வாணி AI. அரசு சேவைகள், அவற்றின் நன்மைகள் மற்றும் எங்கு பயன்படுத்தலாம் என்பதை விளக்க இங்கே இருக்கிறேன்.",
        greetingWithService: (name) => `வணக்கம்! ${name} பற்றி எல்லாவற்றையும் விளக்க முடியும். அதன் நன்மைகள் அல்லது பயன்பாடுகள் பற்றி என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`,
        thinking: "யோசிக்கிறேன்...",
        askServices: "சேவைகள் பற்றி கேளுங்கள்",
        listening: "கேட்கிறேன்...",
        askPlaceholder: "விண்ணப்பம் என்ன செய்கிறது என்று கேளுங்கள்...",
        errorIssue: "மன்னிக்கவும், சிக்கல் ஏற்பட்டது. மீண்டும் கேட்கவும்.",
        errorNetwork: "மன்னிக்கவும், நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.",
        errorHearing: "மன்னிக்கவும், கேட்கவில்லை. மீண்டும் பேசவும் அல்லது டைப் செய்யவும்.",
        errorMic: "மைக்ரஃபோன் அனுமதி மறுக்கப்பட்டது. உரை உள்ளீட்டைப் பயன்படுத்தவும்.",
    },
    'ml': {
        greeting: "നമസ്കാരം! ഞാൻ വാണി AI ആണ്. ഗവൺമെന്റ് സേവനങ്ങൾ, അവയുടെ ഗുണങ്ങൾ, ഉപയോഗ സ്ഥലങ്ങൾ എന്നിവ വിശദീകരിക്കാൻ ഞാൻ ഇവിടെ ഉണ്ട്.",
        greetingWithService: (name) => `നമസ്കാരം! ${name} നെക്കുറിച്ച് എല്ലാം വിശദീകരിക്കാൻ ഞാൻ ഇവിടെ ഉണ്ട്. അതിന്റെ ഗുണങ്ങളോ ഉപയോഗങ്ങളോ കുറിച്ച് നിങ്ങൾ എന്ത് അറിയണം?`,
        thinking: "ആലോചിക്കുന്നു...",
        askServices: "സേവനങ്ങളെക്കുറിച്ച് ചോദിക്കൂ",
        listening: "കേൾക്കുന്നു...",
        askPlaceholder: "അപേക്ഷ എന്ത് ചെയ്യുന്നുണ്ടെന്ന് ചോദിക്കൂ...",
        errorIssue: "ക്ഷമിക്കൂ, ഒരു പ്രശ്നം ഉണ്ടായി. ദയവായി വീണ്ടും ചോദിക്കൂ.",
        errorNetwork: "ക്ഷമിക്കൂ, നെറ്റ്‌വർക്ക് പിശക്. ദയവായി വീണ്ടും ശ്രമിക്കൂ.",
        errorHearing: "ക്ഷമിക്കൂ, കേൾക്കാൻ ബുദ്ധിമുട്ടി. ദയവായി വീണ്ടും പറയൂ അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യൂ.",
        errorMic: "മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ദയവായി ടെക്സ്റ്റ് ഇൻപുട്ട് ഉപയോഗിക്കൂ.",
    },
    'mr': {
        greeting: "नमस्ते! मी वाणी AI आहे. सरकारी सेवा, त्यांचे फायदे आणि ते कुठे वापरता येतात हे सांगण्यासाठी मी येथे आहे.",
        greetingWithService: (name) => `नमस्ते! मी ${name} बद्दल सर्व काही सांगू शकतो. त्याच्या फायद्यांबद्दल किंवा वापराबद्दल तुम्हाला काय जाणून घ्यायचे आहे?`,
        thinking: "विचार करत आहे...",
        askServices: "सेवांबद्दल विचारा",
        listening: "ऐकत आहे...",
        askPlaceholder: "अर्ज काय करतो ते विचारा...",
        errorIssue: "माफ करा, समस्या आली. कृपया पुन्हा विचारा.",
        errorNetwork: "माफ करा, नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.",
        errorHearing: "माफ करा, ऐकण्यात अडचण आली. कृपया पुन्हा बोला किंवा टाइप करा.",
        errorMic: "मायक्रोफोन परवानगी नाकारली. कृपया मजकूर इनपुट वापरा.",
    },
    'bn': {
        greeting: "নমস্কার! আমি বাণী AI। সরকারি সেবা, তাদের সুবিধা এবং কোথায় ব্যবহার করা যায় তা বোঝাতে আমি এখানে আছি।",
        greetingWithService: (name) => `নমস্কার! আমি ${name} সম্পর্কে সব কিছু বোঝাতে পারি। এর সুবিধা বা ব্যবহার সম্পর্কে আপনি কী জানতে চান?`,
        thinking: "ভাবছি...",
        askServices: "পরিষেবা সম্পর্কে জিজ্ঞাসা করুন",
        listening: "শুনছি...",
        askPlaceholder: "আবেদন কী করে তা জিজ্ঞাসা করুন...",
        errorIssue: "দুঃখিত, একটি সমস্যা হয়েছে। আবার জিজ্ঞাসা করুন।",
        errorNetwork: "দুঃখিত, নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।",
        errorHearing: "দুঃখিত, শুনতে সমস্যা হল। আবার বলুন বা টাইপ করুন।",
        errorMic: "মাইক্রোফোন অনুমতি প্রত্যাখ্যাত। টেক্সট ইনপুট ব্যবহার করুন।",
    },
    'gu': {
        greeting: "નમસ્ તે! હું વાણી AI છું. સરકારી સેવાઓ, તેમના ફાયદાઓ અને ક્યાં ઉપયોગ કરી શકાય છે તે સમજાવવા માટે હું અહીં છું.",
        greetingWithService: (name) => `નમસ્તે! હું ${name} વિશે સૌ કંઈ સમજાવી શકું છું. તેના ફાયદા અથવા ઉપયોગ વિશે આપ શું જાણવા ઇચ્છો છો?`,
        thinking: "વિચારી રહ્યો છું...",
        askServices: "સેવાઓ વિશે પૂછો",
        listening: "સાંભળી રહ્યો છું...",
        askPlaceholder: "અરજી શું કરે છે તે પૂછો...",
        errorIssue: "માફ કરશો, સમસ્યા આવી. ફરી પૂછો.",
        errorNetwork: "માફ કરશો, નેટવર્ક ભૂલ. ફરી પ્રયાસ કરો.",
        errorHearing: "માફ કરશો, સાંભળવામાં તકલીફ. ફરી બોલો અથવા ટાઇપ કરો.",
        errorMic: "માઇક્રોફોન પરવાનગી નકારી. ટેક્સ્ટ ઇનપુટ વાપરો.",
    },
    'pa': {
        greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਵਾਣੀ AI ਹਾਂ। ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਉਹਨਾਂ ਦੇ ਫਾਇਦਿਆਂ ਅਤੇ ਕਿੱਥੇ ਵਰਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ, ਇਹ ਦੱਸਣ ਲਈ ਮੈਂ ਇੱਥੇ ਹਾਂ।",
        greetingWithService: (name) => `ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ${name} ਬਾਰੇ ਸਭ ਕੁਝ ਦੱਸ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਇਸ ਦੇ ਫਾਇਦਿਆਂ ਜਾਂ ਵਰਤੋਂ ਬਾਰੇ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?`,
        thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ...",
        askServices: "ਸੇਵਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ",
        listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
        askPlaceholder: "ਬੇਨਤੀ ਕੀ ਕਰਦੀ ਹੈ ਪੁੱਛੋ...",
        errorIssue: "ਮਾਫ਼ ਕਰਨਾ, ਸਮੱਸਿਆ ਆਈ। ਦੁਬਾਰਾ ਪੁੱਛੋ।",
        errorNetwork: "ਮਾਫ਼ ਕਰਨਾ, ਨੈੱਟਵਰਕ ਗੜਬੜ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        errorHearing: "ਮਾਫ਼ ਕਰਨਾ, ਸੁਣਨ ਵਿੱਚ ਮੁਸ਼ਕਲ। ਦੁਬਾਰਾ ਬੋਲੋ ਜਾਂ ਟਾਈਪ ਕਰੋ।",
        errorMic: "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਆਗਿਆ ਅਸਵੀਕਾਰ। ਟੈਕਸਟ ਇਨਪੁੱਟ ਵਰਤੋ।",
    },
    'or': {
        greeting: "ନମସ୍କାର! ମୁଁ ବାଣୀ AI। ସରକାରୀ ସେବା, ସେଗୁଡ଼ିକର ଲାଭ ଏବଂ କେଉଁଠାରେ ବ୍ୟବହାର କରାଯାଇ ପାରିବ ତାହା ବୁଝାଇବା ପାଇଁ ମୁଁ ଏଠାରେ ଅଛି।",
        greetingWithService: (name) => `ନମସ୍କାର! ମୁଁ ${name} ବିଷୟରେ ସବୁ ବୁଝାଇ ପାରିବି। ଆପଣ ଏହାର ଲାଭ ବା ବ୍ୟବହାର ବିଷୟରେ କ'ଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?`,
        thinking: "ଚିନ୍ତାକରୁଛି...",
        askServices: "ସେବା ବିଷୟରେ ପଚାରନ୍ତୁ",
        listening: "ଶୁଣୁଛି...",
        askPlaceholder: "ଆବେଦନ କ'ଣ କରୁଛି ପଚାରନ୍ତୁ...",
        errorIssue: "କ୍ଷମା କରନ୍ତୁ, ଏକ ସମସ୍ୟା ହୋଇଛି। ଆଉ ଥରେ ପଚାରନ୍ତୁ।",
        errorNetwork: "କ୍ଷମା କରନ୍ତୁ, ନେଟ୍‌ୱର୍କ ତ୍ରୁଟି। ଆଉ ଥରେ ଚେଷ୍ଟା କରନ୍ତୁ।",
        errorHearing: "କ୍ଷମା କରନ୍ତୁ, ଶୁଣିବାରେ ଅସୁବିଧା। ଆଉ ଥରେ କୁହନ୍ତୁ ବା ଟାଇପ୍ କରନ୍ତୁ।",
        errorMic: "ମାଇକ୍ରୋଫୋନ୍ ଅନୁମତି ଅସ୍ୱୀକୃତ। ଟେକ୍ସ୍ଟ ଇନପୁଟ ବ୍ୟବହାର କରନ୍ତୁ।",
    },
    'ur': {
        greeting: "السلام علیکم! میں وانی AI ہوں۔ سرکاری خدمات، ان کے فوائد اور انہیں کہاں استعمال کیا جاسکتا ہے، یہ سمجھانے کے لیے میں یہاں ہوں۔",
        greetingWithService: (name) => `السلام علیکم! میں ${name} کے بارے میں سب کچھ سمجھا سکتا ہوں۔ آپ اس کے فوائد یا استعمال کے بارے میں کیا جاننا چاہتے ہیں؟`,
        thinking: "سوچ رہا ہوں...",
        askServices: "خدمات کے بارے میں پوچھیں",
        listening: "سن رہا ہوں...",
        askPlaceholder: "درخواست کیا کرتی ہے یہ پوچھیں...",
        errorIssue: "معافی کریں، مسئلہ آیا۔ دوبارہ پوچھیں۔",
        errorNetwork: "معافی کریں، نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔",
        errorHearing: "معافی کریں، سنائی نہیں دیا۔ دوبارہ بولیں یا ٹائپ کریں۔",
        errorMic: "مائیکروفون اجازت مسترد۔ ٹیکسٹ ان پٹ استعمال کریں۔",
    },
};

function getLangStrings(langCode: string) {
    // Try exact code first, then first two chars (e.g., 'hi' from 'hi-IN')
    return chatbotStrings[langCode] || chatbotStrings[langCode?.split('-')[0]] || chatbotStrings['en'];
}

export function AiChatbot({ userEmail, serviceName }: AiChatbotProps) {
    const { selectedLanguage } = useLanguage();
    const voiceCode = selectedLanguage?.voiceCode || 'en-IN';
    const langCode = selectedLanguage?.code || 'en';

    // Keep refs always pointing to the latest values so effects can read
    // them without adding to dependency arrays (avoids array-size changes).
    const langCodeRef = useRef(langCode);
    const voiceCodeRef = useRef(voiceCode);
    langCodeRef.current = langCode;
    voiceCodeRef.current = voiceCode;

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { isRecording, startRecording, stopRecording, audioBlob, resetRecording } = useAudioRecorder();
    const [shouldTranscribeBlob, setShouldTranscribeBlob] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Combine langCode + serviceName into one key so the dep array stays
    // size [1] — matching the original — while still reacting to both changes.
    const greetingKey = `${langCode}::${serviceName ?? ''}`;

    useEffect(() => {
        const [currentLang] = greetingKey.split('::');
        const currentService = greetingKey.split('::')[1] || undefined;
        const strings = getLangStrings(currentLang);
        const greeting = currentService
            ? strings.greetingWithService(currentService)
            : strings.greeting;

        setMessages([{
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
            role: 'bot',
            text: greeting
        }]);
    }, [greetingKey]);

    const addBotMessage = (text: string, speak: boolean = true) => {
        setMessages(prev => [...prev, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), role: 'bot', text }]);
        if (speak) {
            speakText(text, voiceCode);
        }
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), role: 'user', text }]);
    };

    const handleUserInput = async (text: string) => {
        if (!text.trim()) return;

        const strings = getLangStrings(langCode);

        addUserMessage(text);
        setInputText('');
        setIsProcessing(true);
        stopSpeaking(); // Stop any currently playing audio

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    language: selectedLanguage?.name || 'English',
                    languageCode: langCode,
                    serviceName: serviceName || null,
                })
            });

            const data = await response.json();

            if (data.success && data.text) {
                addBotMessage(data.text);
            } else {
                addBotMessage(strings.errorIssue);
            }
        } catch (e) {
            console.error(e);
            addBotMessage(strings.errorNetwork);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUserInput(inputText);
        }
    };

    // Handle Groq Whisper audio
    useEffect(() => {
        if (shouldTranscribeBlob && audioBlob) {
            setShouldTranscribeBlob(false);

            const transcribe = async () => {
                // Read latest values from refs — keeps dep array size stable
                const strings = getLangStrings(langCodeRef.current);
                setIsProcessing(true);
                const langCodeParam = voiceCodeRef.current.split('-')[0];
                const contextPrompt = "Government services and applications India";

                const result = await transcribeWithGroqWhisper(audioBlob, langCodeParam, contextPrompt);
                resetRecording();

                if (result.success && result.text) {
                    handleUserInput(result.text.trim());
                } else {
                    setIsProcessing(false);
                    addBotMessage(strings.errorHearing);
                }
            };

            transcribe();
        }
    }, [shouldTranscribeBlob, audioBlob]);

    const handleMicClick = async () => {
        const strings = getLangStrings(langCode);
        if (isRecording) {
            stopRecording();
            setShouldTranscribeBlob(true);
        } else {
            stopSpeaking(); // stop bot speaking if doing voice
            try {
                await startRecording();
            } catch (e) {
                addBotMessage(strings.errorMic);
            }
        }
    };

    const strings = getLangStrings(langCode);

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-2xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all outline-none ring-4 ring-cyan-500/30"
                >
                    <span className="font-bold font-serif text-2xl text-white flex items-center justify-center -mt-1">v</span>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col h-[500px] max-h-[85vh] w-[380px] max-w-[calc(100vw-32px)] bg-black border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-neutral-900 border-b border-white/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                                <span className="font-bold font-serif text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">v</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-white leading-tight">Vaani AI</h2>
                                <p className="text-xs bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{strings.askServices}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { stopSpeaking(); setIsOpen(false); }} className="text-white/70 hover:text-white rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 shadow-md leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-tr-sm'
                                    : 'bg-neutral-800 text-gray-200 border border-white/10 rounded-tl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-800 text-white border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> {strings.thinking}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-neutral-900 border-t border-white/10 p-4">
                        <div className="flex items-center gap-2 relative">
                            <Input
                                disabled={isProcessing}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={isRecording ? strings.listening : strings.askPlaceholder}
                                className={`flex-1 h-14 bg-black border-white/20 text-white pl-4 pr-32 focus-visible:ring-cyan-500 rounded-xl transition-all ${isRecording ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
                            />

                            <div className="absolute right-2 flex items-center gap-2">
                                {!inputText && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleMicClick}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 ${isRecording
                                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg scale-110'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                    >
                                        {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </Button>
                                )}
                                {inputText && (
                                    <Button
                                        onClick={() => handleUserInput(inputText)}
                                        disabled={isProcessing}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
                                        size="icon"
                                    >
                                        <Send className="w-4 h-4 -ml-1 mt-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
