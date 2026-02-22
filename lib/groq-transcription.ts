/**
 * Groq Speech-to-Text Utility
 * Uses Groq's Whisper Large v3 model for fast audio transcription
 */

export interface TranscriptionResult {
  success: boolean;
  text: string;
  language?: string;
  error?: string;
}

/**
 * Transcribe audio using Groq Whisper API
 * @param audioBlob - Audio blob from recording
 * @param language - Language code (default: 'hi' for Hindi)
 * @returns Transcription result with text
 */
export async function transcribeAudioWithGroq(
  audioBlob: Blob,
  language: string = 'hi'
): Promise<TranscriptionResult> {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];

          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64Audio,
              mimeType: audioBlob.type || 'audio/wav',
              language,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            reject({
              success: false,
              text: '',
              error: data.error || 'Transcription failed',
            });
            return;
          }

          resolve({
            success: true,
            text: data.text,
            language: data.language,
          });
        } catch (error) {
          reject({
            success: false,
            text: '',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      };

      reader.onerror = () => {
        reject({
          success: false,
          text: '',
          error: 'Failed to read audio blob',
        });
      };

      reader.readAsDataURL(audioBlob);
    });
  } catch (error) {
    console.error('[GroqTranscription] Error:', error);
    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Groq API is configured
 */
export async function isGroqConfigured(): Promise<boolean> {
  try {
    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: Buffer.alloc(0).toString('base64'),
      }),
    });

    // If we get a 400 error about missing audio, the API is configured
    // If we get a 500 error about missing API key, it's not configured
    return response.status !== 500;
  } catch {
    return false;
  }
}
