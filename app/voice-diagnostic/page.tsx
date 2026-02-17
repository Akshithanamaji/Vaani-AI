'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { speakText, initializeVoices } from '@/lib/voice-utils';

export default function VoiceDiagnosticPage() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [testResults, setTestResults] = useState<Record<string, string>>({});

    useEffect(() => {
        loadVoices();
    }, []);

    const loadVoices = async () => {
        await initializeVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            console.log('Available voices:', availableVoices);
        }
    };

    const testLanguage = async (langCode: string, langName: string, testText: string) => {
        setTestResults(prev => ({ ...prev, [langCode]: 'Testing...' }));
        try {
            await speakText(testText, langCode);
            setTestResults(prev => ({ ...prev, [langCode]: '✅ Success' }));
        } catch (error) {
            setTestResults(prev => ({ ...prev, [langCode]: '❌ Failed' }));
        }
    };

    const languages = [
        { code: 'en-IN', name: 'English', text: 'Hello, this is a test' },
        { code: 'hi-IN', name: 'Hindi', text: 'नमस्ते, यह एक परीक्षण है' },
        { code: 'te-IN', name: 'Telugu', text: 'హలో, ఇది ఒక పరీక్ష' },
        { code: 'ta-IN', name: 'Tamil', text: 'வணக்கம், இது ஒரு சோதனை' },
        { code: 'ml-IN', name: 'Malayalam', text: 'ഹലോ, ഇത് ഒരു പരീക്ഷണമാണ്' },
        { code: 'kn-IN', name: 'Kannada', text: 'ಹಲೋ, ಇದು ಒಂದು ಪರೀಕ್ಷೆ' },
        { code: 'mr-IN', name: 'Marathi', text: 'नमस्कार, ही एक चाचणी आहे' },
        { code: 'bn-IN', name: 'Bengali', text: 'হ্যালো, এটি একটি পরীক্ষা' },
        { code: 'gu-IN', name: 'Gujarati', text: 'હેલો, આ એક પરીક્ષણ છે' },
        { code: 'or-IN', name: 'Odia', text: 'ହେଲୋ, ଏହା ଏକ ପରୀକ୍ଷା' },
        { code: 'pa-IN', name: 'Punjabi', text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਇੱਕ ਟੈਸਟ ਹੈ' },
        { code: 'ur-IN', name: 'Urdu', text: 'ہیلو، یہ ایک ٹیسٹ ہے' },
    ];

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Card className="p-8 bg-white">
                    <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Voice Synthesis Diagnostic Tool</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Available Voices ({voices.length})</h2>
                        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                            {voices.length === 0 ? (
                                <p className="text-gray-500">No voices loaded. Click "Reload Voices" button.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Name</th>
                                            <th className="text-left py-2">Language</th>
                                            <th className="text-left py-2">Local</th>
                                            <th className="text-left py-2">Default</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voices.map((voice, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2">{voice.name}</td>
                                                <td className="py-2">{voice.lang}</td>
                                                <td className="py-2">{voice.localService ? '✅' : '❌'}</td>
                                                <td className="py-2">{voice.default ? '✅' : '❌'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <Button onClick={loadVoices} className="mt-4">Reload Voices</Button>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Test Languages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {languages.map(lang => (
                                <Card key={lang.code} className="p-4">
                                    <h3 className="font-semibold mb-2">{lang.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Code: {lang.code}</p>
                                    <p className="text-sm mb-3 break-words">{lang.text}</p>
                                    <Button
                                        onClick={() => testLanguage(lang.code, lang.name, lang.text)}
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

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Check if voices are loaded (should see a list above)</li>
                            <li>Click "Test" button for each language to hear it speak</li>
                            <li>Check browser console for detailed voice selection logs</li>
                            <li>If a language doesn't work, check if a voice for that language is available</li>
                            <li>Some browsers may need to download language packs for certain languages</li>
                        </ol>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Common Issues:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><strong>No voices available:</strong> Browser may not have loaded voices yet. Try reloading the page.</li>
                            <li><strong>Language not speaking:</strong> Browser may not have that language installed. Check browser settings.</li>
                            <li><strong>Wrong language speaking:</strong> Browser may be using fallback voice. Check console logs.</li>
                            <li><strong>Chrome:</strong> Usually has good support for Indian languages</li>
                            <li><strong>Edge:</strong> Has excellent support with natural voices</li>
                            <li><strong>Firefox:</strong> May have limited language support</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}
