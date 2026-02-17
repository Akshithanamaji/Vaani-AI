"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { INDIAN_STATES, State, District } from '@/lib/indian-locations';
import { MapPin, Search, ChevronRight, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationSelectorProps {
  serviceName: string;
  onLocationSelected: (state: string, district: string) => void;
  onCancel: () => void;
}

export function LocationSelector({ serviceName, onLocationSelected, onCancel }: LocationSelectorProps) {
  const { selectedLanguage } = useLanguage();
  const language = selectedLanguage?.code || 'en';
  const [step, setStep] = useState<'state' | 'district'>('state');
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Translations
  const translations = {
    en: {
      selectState: 'Select Your State',
      selectDistrict: 'Select Your District',
      searchState: 'Search state...',
      searchDistrict: 'Search district...',
      statesUnion: 'States & Union Territories',
      districtsIn: 'Districts in',
      applying: 'Applying for',
      back: 'Back',
      cancel: 'Cancel',
      noResults: 'No results found',
      selectLocation: 'Select your location to continue',
    },
    hi: {
      selectState: 'अपना राज्य चुनें',
      selectDistrict: 'अपना जिला चुनें',
      searchState: 'राज्य खोजें...',
      searchDistrict: 'जिला खोजें...',
      statesUnion: 'राज्य और केंद्र शासित प्रदेश',
      districtsIn: 'जिले',
      applying: 'आवेदन',
      back: 'वापस',
      cancel: 'रद्द करें',
      noResults: 'कोई परिणाम नहीं मिला',
      selectLocation: 'जारी रखने के लिए अपना स्थान चुनें',
    },
    te: {
      selectState: 'మీ రాష్ట్రాన్ని ఎంచుకోండి',
      selectDistrict: 'మీ జిల్లాను ఎంచుకోండి',
      searchState: 'రాష్ట్రం శోధించండి...',
      searchDistrict: 'జిల్లా శోధించండి...',
      statesUnion: 'రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు',
      districtsIn: 'జిల్లాలు',
      applying: 'దరఖాస్తు',
      back: 'వెనుకకు',
      cancel: 'రద్దు చేయండి',
      noResults: 'ఫలితాలు కనుగొనబడలేదు',
      selectLocation: 'కొనసాగించడానికి మీ స్థానాన్ని ఎంచుకోండి',
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Filter states based on search
  const filteredStates = useMemo(() => {
    if (!searchQuery) return INDIAN_STATES;
    const query = searchQuery.toLowerCase();
    return INDIAN_STATES.filter(state => 
      state.name.toLowerCase().includes(query) ||
      state.nameHi.includes(searchQuery) ||
      state.nameTe.includes(searchQuery) ||
      state.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!selectedState) return [];
    if (!searchQuery) return selectedState.districts;
    const query = searchQuery.toLowerCase();
    return selectedState.districts.filter(district => 
      district.name.toLowerCase().includes(query) ||
      district.nameHi?.includes(searchQuery) ||
      district.nameTe?.includes(searchQuery)
    );
  }, [selectedState, searchQuery]);

  const handleStateSelect = (state: State) => {
    setSelectedState(state);
    setSearchQuery('');
    setStep('district');
  };

  const handleDistrictSelect = (district: District) => {
    if (selectedState) {
      onLocationSelected(selectedState.name, district.name);
    }
  };

  const handleBack = () => {
    if (step === 'district') {
      setStep('state');
      setSelectedState(null);
      setSearchQuery('');
    } else {
      onCancel();
    }
  };

  const getStateName = (state: State) => {
    switch (language) {
      case 'hi': return state.nameHi || state.name;
      case 'te': return state.nameTe || state.name;
      default: return state.name;
    }
  };

  const getDistrictName = (district: District) => {
    switch (language) {
      case 'hi': return district.nameHi || district.name;
      case 'te': return district.nameTe || district.name;
      default: return district.name;
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{step === 'state' ? t.cancel : t.back}</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-semibold uppercase tracking-wider">{t.applying}</p>
              <h1 className="text-2xl font-black text-white">{serviceName}</h1>
            </div>
          </div>
          <p className="text-gray-400 mt-2">{t.selectLocation}</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 'state' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-green-500/20 text-green-400'}`}>
            {step === 'district' ? <CheckCircle2 className="w-5 h-5" /> : <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">1</span>}
            <span className="font-semibold text-sm">{t.selectState}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 'district' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/10 text-gray-500'}`}>
            <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">2</span>
            <span className="font-semibold text-sm">{t.selectDistrict}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={step === 'state' ? t.searchState : t.searchDistrict}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg border-2 border-white/20 bg-white/10 text-white placeholder-gray-500 focus:border-purple-500 rounded-2xl"
          />
        </div>

        {/* Content */}
        <Card className="bg-black shadow-xl rounded-3xl border border-neutral-800 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              {step === 'state' ? t.statesUnion : `${t.districtsIn} ${selectedState ? getStateName(selectedState) : ''}`}
            </h2>

            {step === 'state' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredStates.length === 0 ? (
                  <p className="col-span-full text-center py-8 text-neutral-500">{t.noResults}</p>
                ) : (
                  filteredStates.map((state) => (
                    <button
                      key={state.code}
                      onClick={() => handleStateSelect(state)}
                      className="group flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl border-2 border-neutral-800 hover:border-cyan-500/50 transition-all text-left"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-cyan-400">{getStateName(state)}</p>
                        {language !== 'en' && (
                          <p className="text-xs text-neutral-500 mt-0.5">{state.name}</p>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">{state.districts.length} districts</p>
                      </div>
                      <div className="w-8 h-8 bg-neutral-800 group-hover:bg-cyan-500/20 rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredDistricts.length === 0 ? (
                  <p className="col-span-full text-center py-8 text-neutral-500">{t.noResults}</p>
                ) : (
                  filteredDistricts.map((district, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDistrictSelect(district)}
                      className="group flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl border-2 border-neutral-800 hover:border-green-500/50 transition-all text-left"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-green-400">{getDistrictName(district)}</p>
                        {language !== 'en' && district.nameHi && (
                          <p className="text-xs text-neutral-500 mt-0.5">{district.name}</p>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-neutral-800 group-hover:bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-neutral-500 group-hover:text-green-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Selected State Badge (in district step) */}
        {step === 'district' && selectedState && (
          <div className="mt-6 flex items-center gap-2 justify-center">
            <span className="text-sm text-neutral-400">Selected State:</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-semibold text-sm">
              {getStateName(selectedState)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
