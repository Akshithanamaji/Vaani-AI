import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for Google Translate TTS
 * This bypasses CORS restrictions
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const text = searchParams.get('text');
        const language = searchParams.get('lang') || 'en';

        console.log('[TTS Proxy] Request received - text:', text?.substring(0, 50), 'lang:', language);

        if (!text || text.trim().length === 0) {
            console.error('[TTS Proxy] Missing or empty text parameter');
            return NextResponse.json({ error: 'Text parameter is required and cannot be empty' }, { status: 400 });
        }

        // Extract language code (e.g., 'hi' from 'hi-IN')
        const langCode = language.split('-')[0];

        // Create Google Translate TTS URL
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${langCode}&client=tw-ob`;

        console.log(`[TTS Proxy] Fetching audio for language: ${langCode}, text length: ${text.length}`);

        // Fetch audio from Google
        const response = await fetch(ttsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://translate.google.com/',
            },
        });

        if (!response.ok) {
            console.error(`[TTS Proxy] Google TTS returned status: ${response.status} for language: ${langCode}`);
            
            // Language not supported by Google TTS
            if (response.status === 400 || response.status === 404) {
                console.error(`[TTS Proxy] Language ${langCode} may not be supported by Google TTS`);
                return NextResponse.json({
                    error: 'Language not supported',
                    language: langCode,
                    status: response.status,
                    message: `Google TTS does not support language code: ${langCode}`
                }, { status: 400 });
            }
            
            return NextResponse.json({
                error: 'Failed to fetch audio from Google',
                status: response.status,
                statusText: response.statusText
            }, { status: response.status });
        }

        // Get audio data
        const audioBuffer = await response.arrayBuffer();
        console.log(`[TTS Proxy] Successfully fetched audio, size: ${audioBuffer.byteLength} bytes`);

        // Return audio with proper headers
        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error: any) {
        console.error('[TTS Proxy] Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
