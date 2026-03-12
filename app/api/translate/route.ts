import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for Google Translate text translation.
 * Translates each text item individually to avoid delimiter-splitting issues.
 * Accepts POST { texts: string[], target: string }
 * Returns { translations: string[] } in the same order.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { texts, target } = body as { texts: string[]; target: string };

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return NextResponse.json({ error: 'texts array is required' }, { status: 400 });
        }
        if (!target) {
            return NextResponse.json({ error: 'target language is required' }, { status: 400 });
        }

        const langCode = target.split('-')[0];

        // English — return as-is
        if (langCode === 'en') {
            return NextResponse.json({ translations: texts });
        }

        /**
         * Translate a single piece of text using Google Translate's free endpoint.
         */
        async function translateOne(text: string): Promise<string> {
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`;
                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://translate.google.com/',
                    },
                });
                if (!res.ok) return text;

                const data = await res.json();
                // Response: [ [ ["translated", "original", ...], ... ], ... ]
                let translated = '';
                if (data?.[0] && Array.isArray(data[0])) {
                    for (const seg of data[0]) {
                        if (seg?.[0]) translated += seg[0];
                    }
                }
                return translated.trim() || text;
            } catch {
                return text; // fallback to original on error
            }
        }

        // Translate all texts in parallel (fast, no delimiter fragility)
        const translations = await Promise.all(texts.map(translateOne));

        return NextResponse.json(
            { translations },
            {
                headers: {
                    'Cache-Control': 'public, max-age=86400',
                },
            }
        );
    } catch (error: any) {
        console.error('[Translate] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
