import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/speech-to-text
 * Transcribe audio using Groq's Whisper Large v3 model
 * 
 * Expected request:
 * {
 *   audio: base64 encoded audio data,
 *   mimeType: "audio/wav" | "audio/mp3" | "audio/ogg" | etc.
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audio, mimeType = 'audio/wav' } = body;

    if (!audio) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[SpeechToText] GROQ_API_KEY is not set');
      return NextResponse.json(
        { error: 'Speech-to-text service not configured' },
        { status: 500 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');

    // Create FormData for Groq API
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: mimeType });
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'hi'); // Default to Hindi - can be made dynamic

    console.log('[SpeechToText] Sending audio to Groq Whisper API...');

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error('[SpeechToText] Groq API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to transcribe audio', details: errorData },
        { status: groqResponse.status }
      );
    }

    const result = await groqResponse.json();
    console.log('[SpeechToText] Transcription successful:', result.text);

    return NextResponse.json({
      success: true,
      text: result.text,
      language: 'hi',
      raw: result,
    });

  } catch (error) {
    console.error('[SpeechToText] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process speech-to-text',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
