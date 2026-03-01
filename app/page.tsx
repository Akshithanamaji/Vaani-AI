'use client';

import { useState, useEffect } from 'react';
import { LandingPage } from '@/components/landing-page';
import { EmailAuth } from '@/components/email-auth';
import { MainPortal } from '@/components/main-portal';
import { ProfilePage } from '@/components/profile-page';
import { LanguageSelector } from '@/components/language-selector';
import { AiChatbot } from '@/components/ai-chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { SplashScreen } from '@/components/splash-screen';
import { AnimatePresence, motion } from 'framer-motion';

type View = 'landing' | 'language-select' | 'auth' | 'portal' | 'profile';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  // Initialize voices on component mount
  useEffect(() => {
    const initVoices = async () => {
      const { initializeVoices } = await import('@/lib/voice-utils');
      await initializeVoices();
    };
    initVoices();
  }, []);

  // Check for persisted session on mount
  useEffect(() => {
    // CLEAR OLD CACHED LANGUAGE - Forces users to select language on landing page
    // This ensures the new language gate feature works for existing users
    const needsLanguageReset = !sessionStorage.getItem('language_reset_done');
    if (needsLanguageReset) {
      localStorage.removeItem('vaani_language');
      sessionStorage.setItem('language_reset_done', 'true');
    }

    // Check for user session - normalize email
    const storedEmail = localStorage.getItem('vaani_user_email');
    if (storedEmail) {
      const normalizedEmail = storedEmail.trim().toLowerCase();
      setUserEmail(normalizedEmail);
      localStorage.setItem('vaani_user_email', normalizedEmail);
      setCurrentView('portal');
    }
  }, []);

  const handleStartSpeaking = () => {
    setShowLanguageSelector(true);
  };

  const handleLanguageSelect = (language: any) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
    // Stay on landing page but now with selected language
  };

  const handleGetStarted = () => {
    // If already authenticated (recovered from session), go straight to portal
    if (userEmail) {
      setCurrentView('portal');
    } else {
      setCurrentView('auth');
    }
  };

  const handleAuthSuccess = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    setUserEmail(normalizedEmail);
    localStorage.setItem('vaani_user_email', normalizedEmail);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('vaani_user_email');
    // Keep language preference after logout
    setCurrentView('landing');
  };

  const handleGoToProfile = () => {
    setCurrentView('profile');
  };

  const handleBackToPortal = () => {
    setCurrentView('portal');
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentView === 'landing' && !userEmail && (
            <>
              <LandingPage
                onGetStarted={handleGetStarted}
                onStartSpeaking={handleStartSpeaking}
                selectedLanguage={selectedLanguage}
              />
              {showLanguageSelector && (
                <LanguageSelector
                  isOpen={showLanguageSelector}
                  onClose={() => setShowLanguageSelector(false)}
                  onLanguageSelect={handleLanguageSelect}
                />
              )}
            </>
          )}

          {currentView === 'auth' && (
            <>
              <EmailAuth onAuthSuccess={handleAuthSuccess} language={selectedLanguage} />
              <AiChatbot userEmail={userEmail} />
            </>
          )}

          {currentView === 'profile' && userEmail && (
            <div className="relative">
              <button
                onClick={handleBackToPortal}
                className="absolute top-8 left-8 p-2 text-gray-600 hover:text-gray-900 font-medium z-10 flex items-center gap-2"
              >
                ← Back to Portal
              </button>
              <ProfilePage email={userEmail} onLogout={handleLogout} language={selectedLanguage} />
              <AiChatbot userEmail={userEmail} />
            </div>
          )}

          {userEmail && currentView !== 'profile' && currentView !== 'auth' && (
            <>
              <MainPortal
                userEmail={userEmail}
                onLogout={handleLogout}
                onGoToProfile={handleGoToProfile}
                language={selectedLanguage}
              />
              <AiChatbot userEmail={userEmail} />
            </>
          )}

          {!userEmail && currentView !== 'landing' && currentView !== 'auth' && (
            <LandingPage
              onGetStarted={handleGetStarted}
              onStartSpeaking={handleStartSpeaking}
              selectedLanguage={selectedLanguage}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

