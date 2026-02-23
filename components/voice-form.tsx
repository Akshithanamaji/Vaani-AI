'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/file-upload';
import {
  initVoiceRecognition,
  startVoiceRecording,
  stopVoiceRecording,
  abortVoiceRecording,
  speakText,
  stopSpeaking,
  getFieldDescription,
  setRecognitionLanguage,
  transcribeWithGroqWhisper,
  type VoiceRecognitionResult,
} from '@/lib/voice-utils';
import { createQRSubmission, generateQRImageUrl } from '@/lib/qr-utils';
import { GOVERNMENT_SERVICES, getTranslatedService } from '@/lib/government-services';
import { translations } from '@/lib/translations';
import { FIELD_TRANSLATIONS } from '@/lib/field-translations';
import { useAudioRecorder } from '@/lib/audio-recorder';
import QRDisplay from './qr-display';

interface VoiceFormProps {
  serviceName?: string;
  service?: any;
  userEmail?: string;
  language?: string;
  selectedLocation?: { state: string; district: string };
  onSubmitSuccess?: () => void;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
}

interface BackendResponse {
  success: boolean;
  response: string;
  isConfirmed: boolean;
  action?: 'confirm' | 'retry' | 'proceed';
  nextField?: string;
  error?: string;
}

const VoiceFormComponent = ({ service, userEmail, language = 'en-IN', selectedLocation, onSubmitSuccess, onSubmit, onBack }: VoiceFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [interim, setInterim] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [submittedQR, setSubmittedQR] = useState<any>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendResponse, setBackendResponse] = useState<string | null>(null);
  const [useGroqWhisper] = useState(true); // Use Groq Whisper by default
  const [shouldTranscribeBlob, setShouldTranscribeBlob] = useState(false);

  // Audio recording with Groq Whisper
  const { isRecording, recordingTime, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder();

  // Fallback to Web Speech API
  const recognitionRef = useRef<any | null>(null);

  const fields = service?.fields || [];
  const currentField = fields[currentFieldIndex];

  // Get translation strings for current language
  const langCode = (typeof language === 'string' ? language.split('-')[0] : 'en');
  const t = translations[langCode] || translations['en'];

  // Get translated service name and description
  const translatedService = service ? getTranslatedService(service, langCode) : service;

  // Helper function to get translated field label
  const getFieldLabel = (fieldId: string, fallbackLabel: string) => {
    const translation = FIELD_TRANSLATIONS[fieldId]?.[langCode];
    return translation || fallbackLabel;
  };

  useEffect(() => {
    // Initialize form data with empty strings
    const initialData: Record<string, string> = {};
    fields.forEach((f: any) => initialData[f.id] = '');
    setFormData(initialData);
  }, [service]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { abortVoiceRecording(recognitionRef.current); } catch (e) { }
      }
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!isReviewing && !submittedQR && currentField) {
      const fetchAndSpeakPrompt = async () => {
        try {
          // Fetch voice prompt from backend using the user's selected language
          const response = await fetch(`/api/voice-process?fieldName=${encodeURIComponent(currentField.id)}&language=${encodeURIComponent(language)}`);
          const result = await response.json();

          // Use the voice prompt from backend if available, otherwise fall back to voiceLabel
          const langCode = (typeof language === 'string' ? language : 'en-IN').split('-')[0];
          const prompt = result.voicePrompt ||
            currentField.voiceLabel?.[langCode] ||
            currentField.voiceLabel?.['en'] ||
            (t.pleaseEnterYour + ' ' + currentField.label);

          const timer = setTimeout(() => {
            // speakText will handle language fallback automatically if needed
            speakText(prompt, language);
          }, 500);

          return () => clearTimeout(timer);
        } catch (error) {
          console.error('[VoiceForm] Error fetching voice prompt:', error);

          // Fallback to voiceLabel if API fails
          const langCode = (typeof language === 'string' ? language : 'en-IN').split('-')[0];
          const voiceLabels = currentField.voiceLabel || {};
          const prompt = voiceLabels[langCode] || voiceLabels['en'] || (t.pleaseEnterYour + ' ' + currentField.label);

          const timer = setTimeout(() => {
            speakText(prompt, language);
          }, 500);

          return () => clearTimeout(timer);
        }
      };

      fetchAndSpeakPrompt();
    }
  }, [currentFieldIndex, language, isReviewing, submittedQR]);

  // Cleanup audio recording when changing fields or language
  useEffect(() => {
    if (isRecording) {
      stopRecording();
    }
    resetRecording();
    setInterim('');
    setVoiceError(null);
  }, [currentFieldIndex, language]);

  // Handle transcription when audio blob is ready
  useEffect(() => {
    if (shouldTranscribeBlob && audioBlob) {
      setShouldTranscribeBlob(false);

      const transcribeNow = async () => {
        console.log('[VoiceForm] Transcribing with Groq Whisper, blob size:', audioBlob.size);
        const langCode = (language || 'en-IN').split('-')[0];
        const result = await transcribeWithGroqWhisper(audioBlob, langCode);

        resetRecording();

        if (result.success && result.text) {
          console.log('[VoiceForm] Groq transcription result:', result.text);
          sendToBackend(result.text.trim(), currentField.id);
        } else {
          console.error('[VoiceForm] Groq transcription failed:', result.error);
          setVoiceError(result.error || t.failedToProcess);
          setIsProcessing(false);
        }
      };

      transcribeNow();
    }
  }, [shouldTranscribeBlob, audioBlob]);

  // Send transcription to backend for processing
  const sendToBackend = async (transcript: string, fieldId: string) => {
    console.log('[VoiceForm] sendToBackend called with transcript:', transcript, 'fieldId:', fieldId);
    try {
      setIsProcessing(true);

      const payload = {
        transcript,
        language,
        fieldName: currentField?.id || fieldId,
        context: formData,
      };

      console.log('[VoiceForm] Sending to backend:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/voice-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[VoiceForm] Backend response status:', response.status);

      const result: BackendResponse = await response.json();

      console.log('[VoiceForm] Backend response received:', JSON.stringify(result, null, 2));

      if (result.success) {
        // Use the Gemini-formatted transcription from the backend if available
        let transcriptToSave = (result as any).transcript || transcript;

        // CLIENT SIDE VALIDATION OVERRIDE
        if (currentField?.validation) {
          const { pattern, message } = currentField.validation;
          const lang = (language || 'en-IN').split('-')[0];

          // Clean transcript (remove spaces if it should be numeric)
          if (pattern && pattern.includes('0-9')) {
            transcriptToSave = transcriptToSave.replace(/\s+/g, '');
          }

          if (pattern && !new RegExp(pattern).test(transcriptToSave)) {
            const errorMsg = message?.[lang] || message?.['en'] || t.invalidInput;
            setVoiceError(errorMsg);
            speakText(errorMsg, language);
            setIsProcessing(false);
            return;
          }
        }

        // Save the data to form
        setFormData((prev) => ({
          ...prev,
          [fieldId]: transcriptToSave,
        }));

        // Store backend response for display
        setBackendResponse(result.response);
        console.log('[VoiceForm] Backend response stored:', result.response);

        // Speak the backend response in the user's selected language
        await speakText(result.response, language);

        // Determine next action based on backend response
        if (result.action === 'proceed' || result.isConfirmed) {
          // Field is valid - move to next field
          console.log('[VoiceForm] Valid input - moving to next field');
          setTimeout(() => {
            if (currentFieldIndex < fields.length - 1) {
              setCurrentFieldIndex(currentFieldIndex + 1);
              setBackendResponse(null);
              setIsProcessing(false);
            } else {
              setIsReviewing(true);
              setIsProcessing(false);
            }
          }, 2000);
        } else if (result.action === 'retry') {
          // Field is invalid or empty - ask user to try again
          console.log('[VoiceForm] Invalid input - user needs to retry');
          setVoiceError(result.response || t.pleaseTryAgain);
          setTimeout(() => {
            setIsProcessing(false);
          }, 2000);
        } else {
          // Default: confirm action
          setTimeout(() => {
            setIsProcessing(false);
          }, 2000);
        }
      } else {
        console.error('[VoiceForm] Backend returned error:', result.error);
        setVoiceError(result.error || t.failedToProcess);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('[Voice Form] Backend error:', error);
      setVoiceError(t.networkError);
      setIsProcessing(false);
    }
  };

  const handleStartListening = async () => {
    console.log('[VoiceForm] Start recording clicked');

    if (isRecording || isProcessing) {
      console.log('[VoiceForm] Skipping - already in progress');
      return;
    }

    setVoiceError(null);
    setInterim('');

    // Removed isSecureContext check to allow LAN IP testing.

    // For Groq Whisper, we need to record audio first
    if (useGroqWhisper) {
      try {
        console.log('[VoiceForm] Starting Groq Whisper audio recording');
        await startRecording();
      } catch (err: any) {
        console.error('Error starting recording:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setVoiceError(t.micAccessDenied);
        } else {
          setVoiceError(t.couldNotStartMic);
        }
      }
    } else {
      // Fallback to Web Speech API
      if (!recognitionRef.current) {
        const recognition = initVoiceRecognition(
          language,
          (result: VoiceRecognitionResult) => {
            if (result.transcript) {
              if (result.isFinal) {
                setInterim('');
                stopVoiceRecording(recognition);

                // Send transcription to backend
                sendToBackend(result.transcript, currentField.id);
              } else {
                setInterim(result.transcript);
                // Only set form data on interim if it isn't a date field (which strict-requires yyyy-mm-dd format in React)
                if (currentField?.type !== 'date' && currentField?.type !== 'file' && currentField?.type !== 'email') {
                  setFormData((prev) => ({
                    ...prev,
                    [currentField.id]: result.transcript,
                  }));
                }
              }
            }
          },
          (error: string) => {
            if (error.includes('aborted')) return;
            console.error('[Voice] Recognition error:', error);

            if (error.includes('Network Error')) {
              recognitionRef.current = null;
              setVoiceError(
                'Network Connection Lost: The voice service lost connection to the internet.\n\n' +
                'This happens when Chrome\'s voice recognition server cannot be reached.\n\n' +
                'Quick fixes:\n' +
                '1. Check your internet connection\n' +
                '2. Wait a moment and try again\n' +
                '3. Refresh the page if the issue persists\n' +
                '4. Or use Manual Input below instead'
              );
            } else if (error.includes('not-allowed')) {
              setVoiceError(t.micAccessDenied);
            } else if (error.includes('no-speech')) {
              // Silence this error
            } else {
              setVoiceError(t.failedToProcess + ': ' + error);
            }
          },
          () => { },
          () => { }
        );

        if (!recognition) {
          setVoiceError(t.microphoneNotSupported);
          return;
        }
        recognitionRef.current = recognition;
      } else {
        setRecognitionLanguage(recognitionRef.current, language);
      }

      try {
        startVoiceRecording(recognitionRef.current);
      } catch (err) {
        console.error('Error starting voice recording:', err);
        setVoiceError(t.couldNotStartMic);
      }
    }
  };

  const handleStopListening = async () => {
    if (useGroqWhisper) {
      if (isRecording) {
        console.log('[VoiceForm] Stopping Groq Whisper recording');
        stopRecording();
        setIsProcessing(true);
        setShouldTranscribeBlob(true); // Flag to transcribe when blob is ready
      }
    } else {
      // Stop Web Speech API
      if (recognitionRef.current) {
        try {
          stopVoiceRecording(recognitionRef.current);
        } catch (e) { }
      }
      setInterim('');
    }
  };

  const handleNext = () => {
    // Check if current field is filled
    const currentFieldValue = formData[currentField?.id] || '';
    const trimmedValue = currentFieldValue.trim();

    // For file fields, check if any file is selected
    if (currentField?.type === 'file' || currentField?.requiresFile) {
      if (!trimmedValue || trimmedValue.length === 0) {
        console.log('[VoiceForm] Cannot proceed - file not uploaded:', currentField?.id);
        setVoiceError(t.pleaseUploadFile);
        speakText(t.pleaseUploadFile, language);
        return;
      }
    } else {
      // For text fields, check if text is filled
      if (!trimmedValue || trimmedValue.length === 0) {
        console.log('[VoiceForm] Cannot proceed - current field is empty:', currentField?.id);
        setVoiceError(t.pleaseFillField);
        return;
      }

      // Check validation pattern if it exists
      if (currentField?.validation) {
        const { pattern, message } = currentField.validation;
        const langCode = (language || 'en-IN').split('-')[0];

        if (pattern && !new RegExp(pattern).test(trimmedValue)) {
          const errorMsg = message?.[langCode] || message?.['en'] || t.invalidInput;
          console.log('[VoiceForm] Validation failed for field:', currentField.id, errorMsg);
          setVoiceError(errorMsg);
          speakText(errorMsg, language);
          return;
        }
      }
    }

    // Clear any error messages
    setVoiceError(null);

    // Move to next field or review
    if (currentFieldIndex < fields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevious = () => {
    // Clear error when going back
    setVoiceError(null);
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  const handleEditField = (index: number) => {
    setCurrentFieldIndex(index);
    setIsReviewing(false);
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      // Include location and user email in user details
      const submissionDetails = {
        ...formData,
        ...(userEmail && { email: userEmail.trim().toLowerCase(), userEmail: userEmail.trim().toLowerCase() }),
        ...(selectedLocation && {
          _state: selectedLocation.state,
          _district: selectedLocation.district,
        }),
      };

      // Call backend to create submission
      const response = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: service.name,
          serviceId: service.id,
          userDetails: submissionDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[VoiceForm] Error creating submission:', data);
        setVoiceError(t.failedToCreate);
        return;
      }

      // Format submission for display
      const submission = {
        id: data.submission.id,
        serviceId: data.submission.serviceId,
        serviceName: data.submission.serviceName,
        qrCode: data.submission.qrCode,
        qrUrl: data.submission.qrUrl,
        status: data.submission.status || 'submitted',
        statusLabel: data.submission.statusLabel,
        submittedAt: data.submission.submittedAt,
        userDetails: submissionDetails,
      };

      console.log('[VoiceForm] Submission created:', submission.id);

      if (onSubmit) {
        onSubmit(submission);
      } else {
        setSubmittedQR(submission);
      }
    } catch (error) {
      console.error('[VoiceForm] Error:', error);
      setVoiceError(t.networkError);
    } finally {
      setIsProcessing(false);
    }
  };

  if (submittedQR && !onSubmit) {
    return (
      <QRDisplay submission={submittedQR} language={language} onNewApplication={() => {
        setSubmittedQR(null);
        setCurrentFieldIndex(0);
        setIsReviewing(false);
        onSubmitSuccess?.();
      }} />
    );
  }

  if (isReviewing) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-2xl border border-neutral-800 bg-black overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <Button onClick={onBack} variant="ghost" size="sm" className="mb-6 text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto font-medium">
                ← {t.back}
              </Button>

              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-3 leading-tight">{t.reviewApplication}</h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{t.verifyInfo}</p>
              </div>
            </div>

            <div className="p-8 bg-black">
              <div className="grid gap-6 mb-8">
                {fields.map((field: any, index: number) => (
                  <div key={field.id} className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 hover:shadow-md group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                          {getFieldLabel(field.id, field.label)}
                        </label>
                        <p className="text-lg text-white font-medium leading-relaxed">
                          {formData[field.id] || <span className="text-neutral-500 italic font-normal">{t.notSpecified}</span>}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditField(index)}
                        className="ml-4 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        {t.edit}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6 border-t border-neutral-800">
                <Button
                  onClick={() => setIsReviewing(false)}
                  variant="outline"
                  className="flex-1 h-14 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold rounded-xl"
                >
                  ← {t.backToForm}
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t.submitApplication}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentFieldIndex + 1) / fields.length) * 100;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border border-neutral-800 bg-black overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

            <Button onClick={onBack} variant="ghost" size="sm" className="mb-6 text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto font-medium">
              ← {t.back}
            </Button>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-3 leading-tight">{translatedService.name}</h2>
              <p className="text-white/80 text-lg mb-4 leading-relaxed max-w-2xl">{translatedService.description}</p>

              {/* Selected Location Badge */}
              {selectedLocation && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedLocation.district}, {selectedLocation.state}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-white/80">{t.progress}</span>
                  <span className="text-white">{Math.round(progress)}% {t.complete}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-white/60">
                  <span>{t.question} {currentFieldIndex + 1} {t.of} {fields.length}</span>
                  <span>{fields.length - currentFieldIndex - 1} {t.remaining}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 lg:p-12 bg-black">
            <div className="max-w-2xl mx-auto">
              {/* Current Field */}
              <div className="mb-10">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    {getFieldLabel(currentField?.id, currentField?.label)}
                  </label>
                  <div className="text-sm text-neutral-400 mb-4 leading-relaxed">
                    {currentField?.description || `${t.pleaseProvide} ${getFieldLabel(currentField?.id, currentField?.label).toLowerCase()}`}
                  </div>
                </div>

                <div className="relative group">
                  {currentField?.type === 'file' || currentField?.requiresFile ? (
                    <FileUpload
                      label={getFieldLabel(currentField?.id, currentField?.label)}
                      fileId={`file-${currentField?.id}`}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      maxSize={5}
                      currentFile={formData[currentField?.id]}
                      onFileChange={(fileName, file) => {
                        setFormData(prev => ({
                          ...prev,
                          [currentField?.id]: fileName
                        }));
                        console.log('[VoiceForm] File selected:', fileName);
                      }}
                      error={voiceError}
                      isListening={isRecording}
                      onStartRecording={handleStartListening}
                      onStopRecording={handleStopListening}
                      voicePrompt={
                        currentField?.voiceLabel?.[langCode] ||
                        currentField?.voiceLabel?.en ||
                        `${t.pleaseProvide} ${getFieldLabel(currentField?.id, currentField?.label).toLowerCase()}`
                      }
                      language={langCode}
                    />
                  ) : currentField?.type === 'textarea' ? (
                    <div className="relative">
                      <Textarea
                        value={formData[currentField?.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [currentField.id]: e.target.value }))}
                        placeholder={t.clickToSpeak ? `${t.clickToSpeak} 🎙️ or Type` : 'Speak or Type...'}
                        className="text-lg min-h-[140px] border-2 border-neutral-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl px-6 py-5 transition-all duration-200 bg-neutral-900 text-white placeholder:text-neutral-500 shadow-sm hover:shadow-md resize-none"
                      />
                      {/* Voice Icon for Textarea */}
                      <button
                        onClick={isRecording ? handleStopListening : handleStartListening}
                        disabled={isProcessing}
                        className="absolute bottom-4 right-4 text-2xl hover:scale-110 transition-transform duration-200 active:scale-95 opacity-70 hover:opacity-100"
                        title={isRecording ? t.stopRecording : t.startVoiceInput}
                      >
                        {isRecording ? '⏹️' : '🎙️'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Input
                          type={currentField?.type || 'text'}
                          value={formData[currentField?.id] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [currentField.id]: e.target.value }))}
                          placeholder={t.clickToSpeak ? `${t.clickToSpeak} 🎙️ or Type` : 'Speak or Type...'}
                          style={{ colorScheme: 'dark' }}
                          className={
                            `text-lg h-16 border-2 rounded-xl px-6 pr-16 transition-all duration-200 shadow-sm hover:shadow-md text-white placeholder:text-neutral-500 ` +
                            (currentField?.type === 'date'
                              ? 'border-neutral-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-neutral-900 cursor-pointer'
                              : 'border-neutral-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-neutral-900')
                          }
                        />
                        {/* Voice Icon for Input */}
                        <button
                          onClick={isRecording ? handleStopListening : handleStartListening}
                          disabled={isProcessing}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform duration-200 active:scale-95 opacity-70 hover:opacity-100"
                          title={isRecording ? t.stopRecording : t.startVoiceInput}
                        >
                          {isRecording ? '⏹️' : '🎙️'}
                        </button>
                      </div>

                      {/* Display Options if available (e.g., Gender) */}
                      {currentField?.options && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {currentField.options.map((opt: { label: string; value: string }) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, [currentField.id]: opt.label }));
                                setVoiceError(null);
                              }}
                              className={`px-4 py-2 rounded-full border-2 transition-all font-bold text-sm ${formData[currentField.id] === opt.label
                                ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg scale-105'
                                : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white bg-neutral-900'
                                }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Voice Input Indicator */}
                  {(interim || isRecording || isProcessing) && (
                    <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center gap-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                      <div className="flex-1">
                        {isRecording && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-cyan-400 font-medium">{t.listening}... 🎙️ {recordingTime}s</p>
                          </div>
                        )}
                        {isProcessing && !isRecording && (
                          <p className="text-sm text-purple-400 font-medium">Transcribing with Groq Whisper Large v3... ✨</p>
                        )}
                        {interim && !isRecording && (
                          <p className="text-sm text-white font-medium">"{interim}"</p>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">{useGroqWhisper ? 'Groq Whisper' : 'Voice Input'}</div>
                    </div>
                  )}
                </div>
              </div>




              {/* Error Display - Simplified */}
              {voiceError && (
                <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-300 font-medium">{voiceError}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 pt-8 border-t border-neutral-800">
                <Button
                  onClick={handlePrevious}
                  disabled={currentFieldIndex === 0}
                  variant="outline"
                  className="flex-1 h-14 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← {t.previous}
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {currentFieldIndex === fields.length - 1 ? t.reviewApplication : `${t.nextQuestion} →`}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const VoiceForm = VoiceFormComponent;
export default VoiceFormComponent;
