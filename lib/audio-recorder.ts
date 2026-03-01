import { useState, useRef, useCallback } from 'react';

interface AudioRecorderState {
    isRecording: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
}

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Pick the best MIME type Groq supports
            const preferredTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/ogg',
                'audio/mp4',
            ];
            const supportedMime = preferredTypes.find(t => MediaRecorder.isTypeSupported(t)) || '';
            console.log('[AudioRecorder] Using MIME type:', supportedMime || '(browser default)');

            const mediaRecorder = supportedMime
                ? new MediaRecorder(stream, { mimeType: supportedMime })
                : new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Use the actual mimeType the recorder used, not a hardcoded string
                const actualMime = mediaRecorder.mimeType || supportedMime || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: actualMime });
                console.log('[AudioRecorder] Blob created:', blob.size, 'bytes, type:', actualMime);
                setAudioBlob(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            throw error;
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const resetRecording = useCallback(() => {
        setAudioBlob(null);
        setRecordingTime(0);
    }, []);

    return {
        isRecording,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        resetRecording
    };
};
