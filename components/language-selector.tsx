'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mic, Languages, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', voiceCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', voiceCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', voiceCode: 'kn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', voiceCode: 'ta-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', voiceCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', voiceCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', voiceCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', voiceCode: 'gu-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', voiceCode: 'or-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voiceCode: 'pa-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', voiceCode: 'ur-IN' },
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: Language) => void;
}

export function LanguageSelector({ isOpen, onClose, onLanguageSelect }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
      onClose();
      setSelectedLanguage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            Choose Your Language
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Select your preferred language for voice interaction and interface
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {AVAILABLE_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                selectedLanguage?.code === language.code
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{language.flag}</div>
                <div className="font-semibold text-gray-900">{language.name}</div>
                <div className="text-sm text-gray-600 mt-1">{language.nativeName}</div>
                {selectedLanguage?.code === language.code && (
                  <div className="mt-2 flex justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8 p-4 bg-indigo-50 rounded-xl">
          <Mic className="w-5 h-5 text-indigo-600" />
          <span className="text-sm text-indigo-700 font-medium">
            Voice recognition and text-to-speech will be in your selected language
          </span>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedLanguage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            Continue with {selectedLanguage?.name}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
