'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml' | 'mr' | 'bn' | 'gu' | 'or' | 'pa' | 'ur';
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
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

interface LanguageContextType {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language | null>(null);

  // Load saved language on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('vaani_language');
    if (storedLanguage) {
      try {
        const parsed = JSON.parse(storedLanguage);
        const found = AVAILABLE_LANGUAGES.find(lang => lang.code === parsed.code);
        if (found) {
          setSelectedLanguageState(found);
        }
      } catch (e) {
        console.error('Error parsing stored language:', e);
      }
    }
  }, []);

  // Save language when it changes
  const setSelectedLanguage = (language: Language) => {
    setSelectedLanguageState(language);
    localStorage.setItem('vaani_language', JSON.stringify(language));
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
