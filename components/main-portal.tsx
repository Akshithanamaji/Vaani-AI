'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ServiceSelector } from '@/components/service-selector';
import { VoiceForm } from '@/components/voice-form';
import { QRDisplay } from '@/components/qr-display';
import { AdminDashboard } from '@/components/admin-dashboard';
import { UserProfileDropdown } from '@/components/user-profile-dropdown';
import { LocationSelector } from '@/components/location-selector';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

interface MainPortalProps {
  userEmail: string;
  onLogout: () => void;
  onGoToProfile: () => void;
  language?: any;
  onLanguageChange?: (code: string) => void;
}

type View = 'home' | 'location-select' | 'form' | 'admin' | 'qr-display';

export function MainPortal({ userEmail, onLogout, onGoToProfile, language, onLanguageChange }: MainPortalProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ state: string; district: string } | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const t = translations[selectedLanguage?.code || 'en'];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentView('location-select');
  };

  const handleLocationSelected = (state: string, district: string) => {
    setSelectedLocation({ state, district });
    setCurrentView('form');
  };

  const handleFormSubmit = (data: any) => {
    setSubmittedData(data);
    setCurrentView('qr-display');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedService(null);
    setSelectedLocation(null);
    setSubmittedData(null);
  };

  const handleBackToLocationSelect = () => {
    setCurrentView('location-select');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToHome}>
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-xl transition-transform hover:scale-105 active:scale-95">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 4.5C11 6.5 7 11.5 3 13C6 13 8 13.5 10 16C11 18.5 10 21 10 21C12 19 13 18 14 19C15 21 14 21 14 21C14 21 13 18.5 14 16C16 13.5 18 13 21 13C17 11.5 13 6.5 12 4.5Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {t.portalTitle}
              </span>
            </div>

            {/* Desktop Menu - Unified Profile Dropdown */}
            <div className="hidden md:flex items-center gap-6">
              <div className="relative group">
                <Button variant="ghost" className="h-11 px-4 bg-white/10 rounded-xl border border-white/20 text-white font-bold transition-all hover:bg-white/20 flex items-center gap-2">
                  <span className="text-xl">{selectedLanguage?.flag || '🇮🇳'}</span>
                  {selectedLanguage?.name || 'Select Language'}
                </Button>
                <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-[60] origin-top-right">
                  <div className="px-4 py-2 mb-2 border-b border-white/10">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.languageSelection}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto px-2 space-y-1">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${selectedLanguage?.code === lang.code ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          {lang.name}
                        </span>
                        {selectedLanguage?.code === lang.code && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <UserProfileDropdown
                userEmail={userEmail}
                onLogout={onLogout}
                onGoToProfile={onGoToProfile}
                onViewForm={(sub) => {
                  setSubmittedData(sub);
                  setCurrentView('qr-display');
                }}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 bg-white/10 border border-white/20 rounded-xl text-white active:scale-90 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-slate-100 mt-6 pt-6 md:hidden space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="px-2">
                <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.2em] mb-3 block px-1">{t.languageSelection}</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedLanguage?.code || 'en'}
                    onChange={(e) => {
                      const lang = AVAILABLE_LANGUAGES.find(l => l.code === e.target.value);
                      if (lang) setSelectedLanguage(lang);
                    }}
                    className="col-span-2 w-full h-12 rounded-xl border-2 border-slate-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600/30 transition-all appearance-none cursor-pointer"
                  >
                    {AVAILABLE_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-2 pt-4 border-t border-slate-50">
                <UserProfileDropdown
                  userEmail={userEmail}
                  onLogout={onLogout}
                  onGoToProfile={onGoToProfile}
                  onViewForm={(sub) => {
                    setSubmittedData(sub);
                    setCurrentView('qr-display');
                    setMobileMenuOpen(false);
                  }}
                  language={language}
                />
              </div>

              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full h-14 rounded-2xl text-red-600 font-black flex items-center justify-center gap-3 bg-red-50/50 border border-red-100 hover:bg-red-50 active:scale-95 transition-all mt-4"
              >
                <LogOut size={20} />
                {t.logout}
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {currentView === 'home' && (
          <ServiceSelector
            onSelectService={handleServiceSelect}
            language={selectedLanguage?.voiceCode || 'en-IN'}
          />
        )}

        {currentView === 'location-select' && selectedService && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LocationSelector
              serviceName={selectedService.name}
              onLocationSelected={handleLocationSelected}
              onCancel={handleBackToHome}
            />
          </div>
        )}

        {currentView === 'form' && selectedService && selectedLocation && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VoiceForm
              service={selectedService}
              language={selectedLanguage?.voiceCode || 'en-IN'}
              selectedLocation={selectedLocation}
              onSubmit={handleFormSubmit}
              onBack={handleBackToLocationSelect}
            />
          </div>
        )}

        {currentView === 'qr-display' && submittedData && (
          <div className="animate-in zoom-in-95 duration-500">
            <QRDisplay
              submission={submittedData}
              language={selectedLanguage?.voiceCode || 'en-IN'}
              onNewApplication={handleBackToHome}
            />
          </div>
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}
