'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isValidEmail } from '@/lib/auth-utils';
import { Mail, User, Phone } from 'lucide-react';

import { translations } from '@/lib/translations';

interface EmailAuthProps {
  onAuthSuccess: (email: string) => void;
  language?: any;
}

export function EmailAuth({ onAuthSuccess, language }: EmailAuthProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language?.code || 'en'] || translations['en'];

  const handleGetStarted = async () => {
    setError('');

    if (!name.trim()) {
      setError(t.enterName);
      return;
    }

    if (!phone.trim()) {
      setError(t.enterPhone);
      return;
    }

    if (!email.trim()) {
      setError(t.enterEmail);
      return;
    }

    if (!isValidEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      // Save name and phone to localStorage
      localStorage.setItem(`profile_name_${email}`, name);
      localStorage.setItem(`profile_phone_${email}`, phone);
      
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      onAuthSuccess(email);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-xl transition-transform hover:scale-105">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 4.5C11 6.5 7 11.5 3 13C6 13 8 13.5 10 16C11 18.5 10 21 10 21C12 19 13 18 14 19C15 21 14 21 14 21C14 21 13 18.5 14 16C16 13.5 18 13 21 13C17 11.5 13 6.5 12 4.5Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Vaani Ai</h1>
          <p className="text-neutral-400 font-bold uppercase tracking-[0.2em] text-[10px]">Digital India Voice Portal</p>
        </div>

        <Card className="p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-neutral-800 rounded-[40px] bg-black">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-2 text-center">
                {t.title}
              </h2>
              <p className="text-center text-sm text-neutral-400 font-medium">{t.subtitle}</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <User size={12} className="text-cyan-400" />
                  {t.nameLabel}
                </label>
                <Input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="bg-neutral-900 h-12 text-white border-2 border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl transition-all placeholder:text-neutral-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Phone size={12} className="text-cyan-400" />
                  {t.phoneLabel}
                </label>
                <Input
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="bg-neutral-900 h-12 text-white border-2 border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl transition-all placeholder:text-neutral-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Mail size={12} className="text-cyan-400" />
                  {t.emailLabel}
                </label>
                <Input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="bg-neutral-900 h-12 text-white border-2 border-neutral-800 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl transition-all placeholder:text-neutral-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-2xl text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button
              onClick={handleGetStarted}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-95 h-14 rounded-2xl text-lg font-black shadow-xl transition-all active:scale-95"
            >
              {loading ? t.sending : t.getStarted}
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-10">
          Secure & Privacy Protected | AI Powered
        </p>
      </div>
    </div>
  );
}
