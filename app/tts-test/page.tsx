'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TTSProxyTest() {
    const [testResults, setTestResults] = useState<Record<string, string>>({});
    const [proxyStatus, setProxyStatus] = useState<string>('Not tested');

    const testProxyEndpoint = async () => {
        setProxyStatus('Testing...');
        try {
            const response = await fetch('/api/tts-proxy?text=Hello&lang=en');
            if (response.ok) {
                setProxyStatus('✅ Proxy endpoint is working!');
            } else {
                setProxyStatus(`❌ Proxy returned status: ${response.status}`);
            }
        } catch (error: any) {
            setProxyStatus(`❌ Error: ${error.message}`);
        }
    };

    const testLanguageAudio = async (langCode: string, langName: string, text: string) => {
        setTestResults(prev => ({ ...prev, [langCode]: 'Testing...' }));

        try {
            const encodedText = encodeURIComponent(text);
            const url = `/api/tts-proxy?text=${encodedText}&lang=${langCode}`;

            const audio = new Audio(url);

            audio.onended = () => {
                setTestResults(prev => ({ ...prev, [langCode]: '✅ Success' }));
            };

            audio.onerror = (error) => {
                console.error(`Error playing ${langName}:`, error);
                setTestResults(prev => ({ ...prev, [langCode]: '❌ Failed to play' }));
            };

            await audio.play();
        } catch (error: any) {
            setTestResults(prev => ({ ...prev, [langCode]: `❌ Error: ${error.message}` }));
        }
    };

    const languages = [
        { code: 'en', name: 'English', text: 'Hello, this is a test' },
        { code: 'hi', name: 'Hindi', text: 'नमस्ते, यह एक परीक्षण है' },
        { code: 'te', name: 'Telugu', text: 'హలో, ఇది ఒక పరీక్ష' },
        { code: 'ta', name: 'Tamil', text: 'வணக்கம், இது ஒரு சோதனை' },
        { code: 'ml', name: 'Malayalam', text: 'ഹലോ, ഇത് ഒരു പരീക്ഷണമാണ്' },
        { code: 'kn', name: 'Kannada', text: 'ಹಲೋ, ಇದು ಒಂದು ಪರೀಕ್ಷೆ' },
        { code: 'mr', name: 'Marathi', text: 'नमस्कार, ही एक चाचणी आहे' },
        { code: 'bn', name: 'Bengali', text: 'হ্যালো, এটি একটি পরীক্ষা' },
        { code: 'gu', name: 'Gujarati', text: 'હેલો, આ એક પરીક્ષણ છે' },
        { code: 'or', name: 'Odia', text: 'ହେଲୋ, ଏହା ଏକ ପରୀକ୍ଷା' },
        { code: 'pa', name: 'Punjabi', text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਇੱਕ ਟੈਸਟ ਹੈ' },
        { code: 'ur', name: 'Urdu', text: 'ہیلو، یہ ایک ٹیسٹ ہے' },
    ];

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Card className="p-8 bg-white">
                    <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">TTS Proxy Test Page</h1>

                    <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Proxy Endpoint Status</h2>
                        <Button onClick={testProxyEndpoint} className="mb-3">
                            Test Proxy Endpoint
                        </Button>
                        <p className="text-lg font-medium">{proxyStatus}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Test All Languages</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Click "Test" to hear each language. This uses the server proxy to fetch audio from Google Translate.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {languages.map(lang => (
                                <Card key={lang.code} className="p-4">
                                    <h3 className="font-semibold mb-2">{lang.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2">Code: {lang.code}</p>
                                    <p className="text-sm mb-3 break-words">{lang.text}</p>
                                    <Button
                                        onClick={() => testLanguageAudio(lang.code, lang.name, lang.text)}
                                        className="w-full"
                                        size="sm"
                                    >
                                        Test {lang.name}
                                    </Button>
                                    {testResults[lang.code] && (
                                        <p className="mt-2 text-sm font-medium">{testResults[lang.code]}</p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold mb-2">How It Works:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Click "Test" button for a language</li>
                            <li>Browser requests: <code>/api/tts-proxy?text=...&lang=...</code></li>
                            <li>Server fetches audio from Google Translate</li>
                            <li>Server returns audio to browser</li>
                            <li>Browser plays audio</li>
                            <li>You hear the language! ✅</li>
                        </ol>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Expected Behavior:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>All languages should show "✅ Success" after playing</li>
                            <li>You should hear audio in each language</li>
                            <li>Check browser console for detailed logs</li>
                            <li>Check server terminal for proxy logs</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}
