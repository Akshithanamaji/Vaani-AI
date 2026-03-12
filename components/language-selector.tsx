'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mic, Globe, Volume2, VolumeX, Square } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voiceCode: string;
  /** Short announcement text in that language */
  announcement: string;
  /** Language code for Google TTS ('or' not supported, falls back to 'en') */
  ttsLang: string;
}

const LANGUAGES: Language[] = [
  {
    code: 'en', name: 'English',   nativeName: 'English',  flag: '🇺🇸', voiceCode: 'en-IN', ttsLang: 'en',
    announcement: 'In this website we have 12 languages. Number 1, English.',
  },
  {
    code: 'hi', name: 'Hindi',     nativeName: 'हिन्दी',    flag: '🇮🇳', voiceCode: 'hi-IN', ttsLang: 'hi',
    announcement: 'इस वेबसाइट में 12 भाषाएं हैं। नंबर 2, हिन्दी।',
  },
  {
    code: 'te', name: 'Telugu',    nativeName: 'తెలుగు',   flag: '🇮🇳', voiceCode: 'te-IN', ttsLang: 'te',
    announcement: 'ఈ వెబ్‌సైట్‌లో 12 భాషలు ఉన్నాయి. నంబర్ 3, తెలుగు.',
  },
  {
    code: 'kn', name: 'Kannada',   nativeName: 'ಕನ್ನಡ',    flag: '🇮🇳', voiceCode: 'kn-IN', ttsLang: 'kn',
    announcement: 'ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ 12 ಭಾಷೆಗಳಿವೆ. ಸಂಖ್ಯೆ 4, ಕನ್ನಡ.',
  },
  {
    code: 'ta', name: 'Tamil',     nativeName: 'தமிழ்',    flag: '🇮🇳', voiceCode: 'ta-IN', ttsLang: 'ta',
    announcement: 'இந்த இணையதளத்தில் 12 மொழிகள் உள்ளன. எண் 5, தமிழ்.',
  },
  {
    code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം',   flag: '🇮🇳', voiceCode: 'ml-IN', ttsLang: 'ml',
    announcement: 'ഈ വെബ്സൈറ്റിൽ 12 ഭാഷകളുണ്ട്. നമ്പർ 6, മലയാളം.',
  },
  {
    code: 'mr', name: 'Marathi',   nativeName: 'मराठी',    flag: '🇮🇳', voiceCode: 'mr-IN', ttsLang: 'mr',
    announcement: 'या वेबसाईटवर 12 भाषा आहेत. क्रमांक 7, मराठी.',
  },
  {
    code: 'bn', name: 'Bengali',   nativeName: 'বাংলা',    flag: '🇮🇳', voiceCode: 'bn-IN', ttsLang: 'bn',
    announcement: 'এই ওয়েবসাইটে 12 টি ভাষা আছে। নম্বর 8, বাংলা।',
  },
  {
    code: 'gu', name: 'Gujarati',  nativeName: 'ગુજરાતી',  flag: '🇮🇳', voiceCode: 'gu-IN', ttsLang: 'gu',
    announcement: 'આ વેબસાઈટમાં 12 ભાષાઓ છે. નંબર 9, ગુજરાતી.',
  },
  {
    code: 'or', name: 'Odia',      nativeName: 'ଓଡ଼ିଆ',    flag: '🇮🇳', voiceCode: 'or-IN', ttsLang: 'en',
    announcement: 'In this website we have 12 languages. Number 10, Odia.',
  },
  {
    code: 'pa', name: 'Punjabi',   nativeName: 'ਪੰਜਾਬੀ',   flag: '🇮🇳', voiceCode: 'pa-IN', ttsLang: 'pa',
    announcement: 'ਇਸ ਵੈੱਬਸਾਈਟ ਵਿੱਚ 12 ਭਾਸ਼ਾਵਾਂ ਹਨ। ਨੰਬਰ 11, ਪੰਜਾਬੀ।',
  },
  {
    code: 'ur', name: 'Urdu',      nativeName: 'اردو',     flag: '🇮🇳', voiceCode: 'ur-IN', ttsLang: 'ur',
    announcement: 'اس ویب سائٹ میں 12 زبانیں ہیں۔ نمبر 12، اردو۔',
  },
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: Language) => void;
}

/** Fetch TTS audio as a blob URL, then play it. Resolves when done. */
async function playClip(text: string, lang: string, isCancelled: () => boolean): Promise<void> {
  if (isCancelled()) return;
  try {
    const res = await fetch(
      `/api/tts-proxy?text=${encodeURIComponent(text)}&lang=${lang}`
    );
    if (!res.ok || isCancelled()) return;

    const blob = await res.blob();
    if (isCancelled()) return;

    const blobUrl = URL.createObjectURL(blob);
    const audio   = new Audio(blobUrl);

    await new Promise<void>((resolve) => {
      const cleanup = () => { URL.revokeObjectURL(blobUrl); resolve(); };
      const timer = setTimeout(cleanup, 9000);
      audio.onended  = () => { clearTimeout(timer); cleanup(); };
      audio.onerror  = () => { clearTimeout(timer); cleanup(); };
      audio.play().catch(() => { clearTimeout(timer); cleanup(); });
    });
  } catch {
    /* skip on network or decode error */
  }
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function LanguageSelector({ isOpen, onClose, onLanguageSelect }: LanguageSelectorProps) {
  const [selected, setSelected]           = useState<Language | null>(null);
  /** -1 = intro, 0-11 = language index, null = idle */
  const [speaking, setSpeaking]           = useState<number | null>(null);
  const [muted, setMuted]                 = useState(false);

  const cancelRef = useRef(false);
  const mutedRef  = useRef(muted);
  const running   = useRef(false);

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  /* ── stop everything ─────────────────────────────────────────── */
  const stopAll = useCallback(() => {
    cancelRef.current = true;
    running.current   = false;
    setSpeaking(null);
  }, []);

  /* ── main tour ───────────────────────────────────────────────── */
  const runTour = useCallback(async () => {
    if (running.current) return;
    running.current   = true;
    cancelRef.current = false;
    const isCancelled = () => cancelRef.current || mutedRef.current;

    // Each language announces itself fully in its own language
    // (intro sentence + language number/name — all in that language)
    for (let i = 0; i < LANGUAGES.length; i++) {
      if (isCancelled()) break;
      setSpeaking(i);
      const lang = LANGUAGES[i];
      await playClip(lang.announcement, lang.ttsLang, isCancelled);
      if (isCancelled()) break;
      await wait(300);
    }

    setSpeaking(null);
    running.current = false;
  }, []);

  /* ── open / close ────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      stopAll();
      return () => {};
    }
    setSelected(null);
    setSpeaking(null);
    cancelRef.current = false;
    runTour();
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  /* ── mute toggle ─────────────────────────────────────────────── */
  const handleMuteToggle = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) { stopAll(); }
    else      { runTour(); }
  };

  /* ── card click ──────────────────────────────────────────────── */
  const handleSelect = (lang: Language) => {
    stopAll();
    setSelected(lang);
    // Confirm in selected language
    if (!mutedRef.current) {
      cancelRef.current = false;
      playClip(lang.nativeName, lang.ttsLang, () => false);
    }
  };

  /* ── confirm ─────────────────────────────────────────────────── */
  const handleConfirm = () => {
    if (!selected) return;
    stopAll();
    onLanguageSelect(selected);
    onClose();
    setSelected(null);
  };

  /* ── derived ─────────────────────────────────────────────────── */
  const isActive   = speaking !== null;
  const activeName = isActive && speaking! >= 0 ? LANGUAGES[speaking!]?.name : null;
  const progress   = isActive && speaking! >= 0
    ? Math.round(((speaking! + 1) / LANGUAGES.length) * 100)
    : 0;

  return (
    <>
      <style>{`
        @keyframes ls-glow {
          0%   { box-shadow: 0 0 0 0   rgba(99,102,241,.7); }
          55%  { box-shadow: 0 0 0 10px rgba(99,102,241,.1); }
          100% { box-shadow: 0 0 0 0   rgba(99,102,241,0); }
        }
        @keyframes ls-bar {
          0%,100% { transform: scaleY(1);   }
          50%     { transform: scaleY(2.6); }
        }
        .ls-card-on {
          border-color: #6366f1 !important;
          background: linear-gradient(135deg,#eef2ff,#dde4ff) !important;
          animation: ls-glow 1s ease-in-out infinite;
        }
        .ls-wave span {
          display: inline-block;
          width: 3px; border-radius: 2px;
          background: #6366f1;
          animation: ls-bar .6s ease-in-out infinite;
        }
        .ls-wave span:nth-child(1){ animation-delay:0s;   height:7px; }
        .ls-wave span:nth-child(2){ animation-delay:.1s;  height:13px; }
        .ls-wave span:nth-child(3){ animation-delay:.2s;  height:9px;  }
        .ls-wave span:nth-child(4){ animation-delay:.3s;  height:15px; }
        .ls-wave span:nth-child(5){ animation-delay:.4s;  height:10px; }
      `}</style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

          {/* ── HEADER ── */}
          <DialogHeader>
            <div className="flex items-center justify-between">
              <span className="flex-1" />
              <DialogTitle className="flex-1 text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Globe className="w-6 h-6 text-indigo-600" />
                Choose Your Language
              </DialogTitle>
              <span className="flex-1 flex justify-end gap-1">
                {/* Stop button — only while tour is running */}
                {isActive && (
                  <button
                    onClick={stopAll}
                    title="Stop announcement"
                    className="p-2 rounded-full hover:bg-red-50 transition"
                  >
                    <Square className="w-4 h-4 text-red-400 fill-current" />
                  </button>
                )}
                <button
                  onClick={handleMuteToggle}
                  title={muted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  {muted
                    ? <VolumeX className="w-5 h-5 text-gray-400" />
                    : <Volume2 className="w-5 h-5 text-indigo-500" />}
                </button>
              </span>
            </div>


            {/* ── LIVE STATUS BAR ── */}
            {isActive && !muted && (
              <div className="mt-3 px-4 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
                {/* wave + label */}
                <div className="flex items-center justify-center gap-3">
                  <div className="ls-wave flex items-end gap-[3px]">
                    <span/><span/><span/><span/><span/>
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">
                    {`Now announcing: ${activeName}`}
                  </span>
                  <div className="ls-wave flex items-end gap-[3px]">
                    <span/><span/><span/><span/><span/>
                  </div>
                </div>

                {/* progress bar */}
                {speaking !== null && speaking >= 0 && (
                  <div>
                    <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-indigo-400 mt-1">
                      Language {speaking! + 1} of {LANGUAGES.length}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogHeader>

          {/* ── LANGUAGE GRID ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {LANGUAGES.map((lang, idx) => {
              const isOn  = speaking === idx && !muted;
              const isSel = selected?.code === lang.code;

              return (
                <button
                  key={lang.code}
                  id={`lang-${lang.code}`}
                  onClick={() => handleSelect(lang)}
                  className={[
                    'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg text-center',
                    isOn  ? 'ls-card-on'
                    : isSel ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300 bg-white',
                  ].join(' ')}
                >
                  <div className="text-xs font-bold text-indigo-400 mb-1">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className="font-semibold text-gray-900">{lang.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{lang.nativeName}</div>

                  {isSel && (
                    <div className="mt-2 flex justify-center items-center gap-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <span className="text-xs text-indigo-600 font-semibold">Selected</span>
                    </div>
                  )}
                  {isOn && (
                    <div className="mt-2 ls-wave flex justify-center items-end gap-[3px]" style={{ height: 18 }}>
                      <span/><span/><span/><span/><span/>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── INFO ── */}
          <div className="flex items-center justify-center gap-3 mt-5 p-3 bg-indigo-50 rounded-xl">
            <Mic className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-sm text-indigo-700 font-medium">
              Voice recognition and text-to-speech will use your selected language
            </span>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              id="lang-confirm"
              onClick={handleConfirm}
              disabled={!selected}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            >
              Continue with {selected?.name ?? '…'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}