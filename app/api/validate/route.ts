import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { runSmartValidation, type ValidationResult } from '@/lib/smart-validation';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ValidateRequestBody {
    fields: Array<{ id: string; label: string; type?: string; requiresFile?: boolean }>;
    formData: Record<string, string>;
    language: string;
    serviceId?: number;
    serviceName?: string;
    useAI?: boolean; // opt-in for deeper AI analysis
}

/**
 * POST /api/validate
 * Runs both rule-based and (optionally) AI-powered validation on a form.
 */
export async function POST(request: NextRequest) {
    try {
        const body: ValidateRequestBody = await request.json();
        const { fields, formData, language, serviceId, serviceName, useAI = false } = body;

        if (!fields || !formData) {
            return NextResponse.json({ success: false, error: 'fields and formData are required' }, { status: 400 });
        }

        const langCode = (language || 'en-IN').split('-')[0];

        // ── 1. Rule-based validation (instant, no cost) ──────────────────────────
        const ruleResult: ValidationResult = runSmartValidation(fields, formData, langCode, serviceId);

        // ── 2. AI-powered deep validation (opt-in, uses Gemini) ──────────────────
        let aiIssues: Array<{ fieldId: string; fieldLabel: string; severity: string; message: string; suggestion?: string }> = [];

        if (useAI && process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

                // Build a compact summary of the form for Gemini
                const fieldSummary = fields
                    .filter(f => !f.requiresFile)
                    .map(f => `${f.label} (id: ${f.id}): "${formData[f.id] || '[empty]'}"`)
                    .join('\n');

                const prompt = `You are a smart form validator for Indian government service applications.
Service: "${serviceName || 'Government Service'}"

Below is the applicant's submitted data. Identify any data quality issues, logical inconsistencies, or suspicious entries that rule-based validation might miss. Focus on:
- Obvious fake/test data (e.g., "test", "abc", "123456789", "aaaaaa")
- Names that look like garbled speech-to-text output
- Dates that are too far in the past or future to be realistic
- Addresses that seem incomplete or nonsensical
- Mismatched info between fields (e.g., child's DOB after current year, mother's age too young)
- Wrong application type for the stated age/situation

Form Data:
${fieldSummary}

Return a JSON array of issues, where each issue is:
{
  "fieldId": "field_id_here",
  "fieldLabel": "Field Label",
  "severity": "error" | "warning",
  "messageEn": "Clear explanation in English",
  "suggestion": "How to fix it"
}

Rules:
- Only flag REAL issues, not stylistic preferences.
- If everything looks fine, return an empty array [].
- Return ONLY the JSON array, nothing else.`;

                const result = await model.generateContent(prompt);
                const rawText = result.response.text().trim();

                // Parse the AI response
                const jsonMatch = rawText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (Array.isArray(parsed)) {
                        aiIssues = parsed.map((item: any) => ({
                            fieldId: item.fieldId || '',
                            fieldLabel: item.fieldLabel || item.fieldId || '',
                            severity: item.severity || 'warning',
                            message: item.messageEn || item.message || 'Potential issue detected',
                            messageEn: item.messageEn || item.message || '',
                            suggestion: item.suggestion,
                            code: 'AI_DETECTED',
                        }));
                    }
                }
            } catch (aiError) {
                console.error('[Validate API] AI validation error (non-fatal):', aiError);
                // Don't fail the whole request if AI fails
            }
        }

        // ── 3. Merge and deduplicate ─────────────────────────────────────────────
        const allIssues = [...ruleResult.issues, ...aiIssues];

        // Filter: only one issue per fieldId (prefer errors over warnings)
        const byField = new Map<string, (typeof allIssues)[0]>();
        for (const issue of allIssues) {
            const existing = byField.get(issue.fieldId);
            if (!existing || issue.severity === 'error') {
                byField.set(issue.fieldId, issue);
            }
        }

        const finalIssues = Array.from(byField.values());
        const hasErrors = finalIssues.some(i => i.severity === 'error');
        const hasWarnings = finalIssues.some(i => i.severity === 'warning');

        return NextResponse.json({
            success: true,
            isValid: !hasErrors,
            hasErrors,
            hasWarnings,
            issueCount: finalIssues.length,
            issues: finalIssues,
            ruleIssuesCount: ruleResult.issues.length,
            aiIssuesCount: aiIssues.length,
        });
    } catch (error: any) {
        console.error('[Validate API] Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Validation failed' }, { status: 500 });
    }
}
