import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Language name to native script map for stronger enforcement
const languageNativeMap: Record<string, string> = {
    'Hindi': 'हिंदी',
    'Telugu': 'తెలుగు',
    'Kannada': 'ಕನ್ನಡ',
    'Tamil': 'தமிழ்',
    'Malayalam': 'മലയാളം',
    'Marathi': 'मराठी',
    'Bengali': 'বাংলা',
    'Gujarati': 'ગુજરાતી',
    'Punjabi': 'ਪੰਜਾਬੀ',
    'Odia': 'ଓଡ଼ିଆ',
    'Urdu': 'اردو',
    'English': 'English',
};

export async function POST(req: NextRequest) {
    try {
        const { message, language, languageCode, serviceName } = await req.json();

        const nativeScript = languageNativeMap[language] || language;
        const isEnglish = language === 'English' || !language;

        const serviceContext = serviceName
            ? `The user is asking about the "${serviceName}" government service/application.`
            : 'The user is asking about a government service or application.';

        const systemPrompt = isEnglish
            ? `You are Vaani AI Assistant, a helpful and polite Indian government service AI assistant.
You help people understand government applications, schemes, and certificates (like Passport, Driving License, Income Certificate, Caste Certificate, Post-Matric Scholarship, Birth Certificate, Voter ID, Aadhaar Update, PAN Card, etc.).
You explain how each service is useful, where it can be used, and how it benefits people.
Keep your answers highly informative, concise, and easy to understand.
${serviceContext}
IMPORTANT: You MUST respond ONLY in English. Do not use any other language.`
            : `You are Vaani AI Assistant, a helpful and polite Indian government service AI assistant.
You help people understand government applications, schemes, and certificates (like Passport, Driving License, Income Certificate, Caste Certificate, Post-Matric Scholarship, Birth Certificate, Voter ID, Aadhaar Update, PAN Card, etc.).
You explain how each service is useful, where it can be used, and how it benefits people.
Keep your answers highly informative, concise, and easy to understand.
${serviceContext}

CRITICAL LANGUAGE INSTRUCTION: You MUST respond ONLY in ${language} (${nativeScript} script). 
- Do NOT write even a single word in English unless it is a proper noun like "PAN Card", "Aadhaar", "OTP".
- Write ALL explanations, ALL sentences, and ALL words in ${language} using ${nativeScript} script.
- If the user asks in any language, always reply in ${language} (${nativeScript}).
- Your entire response must be in ${language}. This is mandatory and non-negotiable.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 1024,
        });

        const text = completion.choices[0]?.message?.content || "I am sorry, I am unable to process your request at this moment.";

        return NextResponse.json({ success: true, text });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error in chat API:", errorMessage);
        return NextResponse.json({ success: false, error: "Failed to generate response", details: errorMessage }, { status: 500 });
    }
}
