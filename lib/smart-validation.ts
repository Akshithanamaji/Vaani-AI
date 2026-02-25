/**
 * smart-validation.ts
 * Rule-based instant validation for Vaani AI government forms.
 * Covers: phone, Aadhaar, PAN, PIN, email, age/DOB consistency,
 *         missing required fields, and cross-field mismatches.
 */

export type IssueSeverity = 'error' | 'warning';

export interface ValidationIssue {
    fieldId: string;
    fieldLabel: string;
    severity: IssueSeverity;
    code: string;           // machine-readable code, e.g. 'INVALID_PHONE'
    message: string;        // in the user's language
    messageEn: string;      // always English (for logging / AI prompt)
    suggestion?: string;    // optional fix hint
}

export interface ValidationResult {
    isValid: boolean;
    issues: ValidationIssue[];
}

// ─── helpers ───────────────────────────────────────────────────────────────

function digits(v: string) { return v.replace(/\D/g, ''); }

function calcAge(dobStr: string): number | null {
    // Accepts YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
    let d: Date | null = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
        d = new Date(dobStr);
    } else if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(dobStr)) {
        const [day, month, year] = dobStr.split(/[\/\-]/).map(Number);
        d = new Date(year, month - 1, day);
    }
    if (!d || isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    if (age < 0 || age > 150) return null;
    return age;
}

// ─── per-language messages ──────────────────────────────────────────────────

type LangMap = Record<string, string>;

const MSG: Record<string, Record<string, LangMap>> = {
    INVALID_PHONE: {
        en: { en: 'Phone number must be exactly 10 digits.', hi: 'फ़ोन नंबर 10 अंकों का होना चाहिए।', te: 'ఫోన్ నంబర్ 10 అంకెలు మాత్రమే ఉండాలి.', ta: 'தொலைபேசி 10 இலக்கமாக இருக்க வேண்டும்.', kn: 'ಫೋನ್ ಸಂಖ್ಯೆ ಕ್ಕೆ ಹ 10 ಅಂಕಿ ಇರಬೇಕು.', ml: 'ഫോൺ നംബർ 10 അക്കമായിരിക്കണം.', mr: 'फोन नंबर 10 अंकांचा असावा.', bn: 'ফোন নম্বর ১০ সংখ্যার হতে হবে।', gu: 'ફોન નંબર 10 અંકનો હોવો જોઈએ.', or: 'ଫୋନ ନମ୍ବର 10 ଅଙ୍କ ହୋଇଥିବ।', pa: 'ਫ਼ੋਨ ਨੰਬਰ 10 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।', ur: 'فون نمبر بالکل 10 ہندسوں کا ہونا چاہیے۔' }
    },
    INVALID_PHONE_START: {
        en: { en: 'Indian mobile numbers must start with 6, 7, 8, or 9.', hi: 'भारतीय मोबाइल नंबर 6, 7, 8 या 9 से शुरू होने चाहिए।', te: 'భారతీయ మొబైల్ నంబర్లు 6, 7, 8 లేదా 9 తో మొదలవ్వాలి.', ta: 'இந்திய மொபைல் 6, 7, 8, 9 இல் தொடங்கியிருக்கும்.', kn: 'ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 6, 7, 8 ಅಥವಾ 9 ರಿಂದ ಪ್ರಾರಂಭವಾಗಬೇಕು.', ml: 'ഇന്ത്യൻ മൊബൈൽ 6, 7, 8 അല്ലെങ്കിൽ 9 ൽ ആരംഭിക്കുക.', mr: 'भारतीय मोबाइल 6, 7, 8 किंवा 9 ने सुरू व्हायला हवे.', bn: 'ভারতীয় মোবাইল 6, 7, 8, বা 9 দিয়ে শুরু হতে হবে।', gu: 'ભારતીય મોબાઇલ 6, 7, 8 અથવા 9 થી શરૂ થવો જોઈએ.', or: 'ଭାରତୀୟ ମୋବାଇଲ 6, 7, 8 ବା 9 ରୁ ଆରଂଭ ହୋଇଥିବ।', pa: 'ਭਾਰਤੀ ਮੋਬਾਈਲ 6, 7, 8 ਜਾਂ 9 ਤੋਂ ਸ਼ੁਰੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।', ur: 'بھارتی موبائل 6، 7، 8 یا 9 سے شروع ہونا چاہیے۔' }
    },
    INVALID_AADHAAR: {
        en: { en: 'Aadhaar number must be exactly 12 digits.', hi: 'आधार नंबर 12 अंकों का होना चाहिए।', te: 'ఆధార్ నంబర్ 12 అంకెలు మాత్రమే ఉండాలి.', ta: 'ஆதார் 12 இலக்கமாக இருக்க வேண்டும்.', kn: 'ಆಧಾರ್ ಸಂಖ್ಯೆ 12 ಅಂಕಿ ಇರಬೇಕು.', ml: 'ആധാർ 12 അക്കമായിരിക്കണം.', mr: 'आधार 12 अंकांचा असावा.', bn: 'আধার 12 সংখ্যার হতে হবে।', gu: 'આધાર 12 અંકનો હોવો જોઈએ.', or: 'ଆଧାର 12 ଅଙ୍କ ହୋଇଥିବ।', pa: 'ਆਧਾਰ 12 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।', ur: 'آدھار 12 ہندسوں کا ہونا چاہیے۔' }
    },
    INVALID_PAN: {
        en: { en: 'PAN must be in format AAAAA9999A (5 letters, 4 numbers, 1 letter).', hi: 'PAN का प्रारूप AAAAA9999A होना चाहिए।', te: 'PAN ఫార్మాట్ AAAAA9999A ఉండాలి.', ta: 'PAN வடிவம் AAAAA9999A ஆக இருக்க வேண்டும்.', kn: 'PAN ಫಾರ್ಮ್ಯಾಟ್ AAAAA9999A ಆಗಿರಬೇಕು.', ml: 'PAN AAAAA9999A ഫോർമാറ്റിൽ ഉണ്ടായിരിക്കണം.', mr: 'PAN चे स्वरूप AAAAA9999A असायला हवे.', bn: 'PAN ফরম্যাট AAAAA9999A হতে হবে।', gu: 'PAN ફોર્મેટ AAAAA9999A હોવો જોઈએ.', or: 'PAN ଫର୍ମ୍ୟାଟ AAAAA9999A ହୋଇଥିବ।', pa: 'PAN ਦਾ ਫਾਰਮੈਟ AAAAA9999A ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।', ur: 'PAN فارمیٹ AAAAA9999A ہونا چاہیے۔' }
    },
    INVALID_PIN: {
        en: { en: 'PIN code must be exactly 6 digits.', hi: 'पिन कोड 6 अंकों का होना चाहिए।', te: 'పిన్ కోడ్ 6 అంకెలు మాత్రమే ఉండాలి.', ta: 'PIN 6 இலக்கமாக இருக்க வேண்டும்.', kn: 'PIN ಕೋಡ್ 6 ಅಂಕಿ ಇರಬೇಕು.', ml: 'PIN 6 അക്കമായിരിക്കണം.', mr: 'पिन 6 अंकांचा असावा.', bn: 'পিন 6 সংখ্যার হতে হবে।', gu: 'PIN 6 અંકનો હોવો જોઈએ.', or: 'ପିନ 6 ଅଙ୍କ ହୋଇଥିବ।', pa: 'ਪਿਨ 6 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।', ur: 'پن کوڈ 6 ہندسوں کا ہونا چاہیے۔' }
    },
    INVALID_EMAIL: {
        en: { en: 'Email address is not valid.', hi: 'ईमेल पता मान्य नहीं है।', te: 'ఇమెయిల్ చిరునామా చెల్లుబాటుకాదు.', ta: 'மின்னஞ்சல் செல்லுபடியாகவில்லை.', kn: 'ಇಮೇಲ್ ವಿಳಾಸ ಅಮಾನ್ಯ.', ml: 'ഇമെയിൽ വിലാസം അസാധുവാണ്.', mr: 'ईमेल पत्ता अवैध आहे.', bn: 'ইমেল ঠিকানা বৈধ নয়।', gu: 'ઇ-મેઇલ સરનામું અمان্ধ.', or: 'ଇମେଲ ଠିକଣ ଅବୈଧ।', pa: 'ਈਮੇਲ ਪਤਾ ਗਲਤ ਹੈ।', ur: 'ای میل پتہ درست نہیں ہے۔' }
    },
    AGE_TOO_YOUNG: {
        en: { en: 'Age derived from date of birth is below the minimum required for this service (18 years).', hi: 'जन्म तिथि से उम्र 18 साल से कम है, जो इस सेवा के लिए अनिवार्य है।', te: 'పుట్టిన తేదీ నుండి వయస్సు 18 సంవత్సరాల కంటే తక్కువగా ఉంది.', ta: 'வயது 18 ஆண்டுகளுக்கு குறைவாக இருக்கிறது.', kn: 'ವಯಸ್ಸು 18 ವರ್ಷಗಳಿಗಿಂತ ಕಡಿಮೆ ಇದೆ.', ml: 'പ്രായം 18 വർഷത്തിൽ ﻛ്കുറവാണ്.', mr: 'वय 18 वर्षापेक्षा कमी आहे.', bn: 'বয়স 18 বছরের কম।', gu: 'ઉંમર 18 વર્ષ ﻛ ઓCHI.', or: 'ବୟସ 18 ବର୍ଷଠୁ କମ।', pa: 'ਉਮਰ 18 ਸਾਲ ਤੋਂ ਘੱਟ ਹੈ।', ur: 'عمر 18 سال سے کم ہے۔' }
    },
    AGE_FUTURE_DOB: {
        en: { en: 'Date of birth cannot be in the future.', hi: 'जन्म तिथि भविष्य में नहीं हो सकती।', te: 'పుట్టిన తేదీ భవిష్యత్తులో ఉండకూడదు.', ta: 'பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது.', kn: 'ಜನ್ಮ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿ ಇರಬಾರದು.', ml: 'ജനനത്തീയതി ഭാവിയിൽ ആകരുത്.', mr: 'जन्मतारीख भविष्यात असू शकत नाही.', bn: 'জন্ম তারিখ ভবিষ্যতে হতে পারে না।', gu: 'જન્મ તારીখ ভবিষ্যতমাं ন হতে পারে না.', or: 'ଜନ୍ମ ତିଥି ଭବିଷ୍ୟତ ହୋଇ ପ୍ ਨ ।', pa: 'ਜਨਮ ਤਾਰੀਖ ਭਵਿੱਖ ਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕਦੀ।', ur: 'تاریخِ پیدائش مستقبل میں نہیں ہو سکتی۔' }
    },
    AGE_FIELD_MISMATCH: {
        en: { en: 'The age you entered does not match the date of birth provided.', hi: 'आपने जो उम्र दर्ज की वह जन्म तिथि से मेल नहीं खाती।', te: 'మీరు నమోదు చేసిన వయస్సు పుట్టిన తేదీకి సరిపోవడం లేదు.', ta: 'உங்கள் பிறந்த தேதியுடன் வயது பொருந்தவில்லை.', kn: 'ನीವು ನಮೂದಿಸಿದ ವಯಸ್ಸು ಜನ್ಮ ದಿನಾಂಕದ ⁠ ನ.', ml: 'ന ℹ ൽ നൽകിয ﻭ.', mr: 'तुم्ही दर्ज केलेले वय जन्मतारखेशी जुळत नाही.', bn: 'আপনার বয়স জন্ম তারিখের সাথে মেলে না।', gu: 'ઉਮਰ ਜਨ੍ﻢ ਤਾਰੀਖ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਨਹੀਂ।', or: 'ਉਮਰ ਜਨਮ ਦਿਨ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।', pa: 'ਉਮਰ ਜਨਮ ਤਾਰੀਖ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।', ur: 'درج کردہ عمر تاریخِ پیدائش سے مطابقت نہیں رکھتی۔' }
    },
    MISSING_REQUIRED: {
        en: { en: 'This field is required and cannot be empty.', hi: 'यह फ़ील्ड आवश्यक है और खाली नहीं हो सकती।', te: 'ఈ ఫీల్డ్ అవసరమైనది, ఖాళీగా ఉండకూడదు.', ta: 'இந்த புலம் தேவையானது.', kn: 'ఈ ఫీల్డ్ అవసరమైనది.', ml: 'ഈ ഫീൽഡ് ആവശ്യമാണ്.', mr: 'हे फील्ड आवश्यक आहे.', bn: 'এই ক্ষেত্র আবশ্যিক।', gu: 'આ ﻓ ﺻ ı ﺧ .', or: 'ﺍ ﺍ ﻫ .', pa: 'ਇਹ ਖੇਤਰ ਜ਼ਰੂਰੀ ਹੈ।', ur: 'یہ فیلڈ ضروری ہے۔' }
    },
};

function msg(code: string, lang: string): string {
    const entry = MSG[code]?.['en'];
    return entry?.[lang] || entry?.['en'] || 'Invalid input';
}

// ─── phone validation ────────────────────────────────────────────────────────

// Covers all 45 services — any field whose id contains one of these substrings
const PHONE_FIELD_IDS = [
    'phone', 'mobile', 'telephone', 'contact_no', 'contact_number',
    'informant_mobile', 'emergency_contact', 'whatsapp', 'helpline',
    'applicant_phone', 'guardian_phone', 'father_phone', 'mother_phone',
    'spouse_phone', 'nominee_phone', 'employer_phone', 'reference_phone',
];

function validatePhone(fieldId: string, label: string, value: string, lang: string): ValidationIssue[] {
    const d = digits(value);
    const issues: ValidationIssue[] = [];
    if (!d) return issues; // empty handled by required check
    if (d.length !== 10) {
        issues.push({ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_PHONE', message: msg('INVALID_PHONE', lang), messageEn: MSG['INVALID_PHONE']['en']['en'], suggestion: 'Enter exactly 10 digits without spaces or country code.' });
    } else if (!/^[6-9]/.test(d)) {
        issues.push({ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_PHONE_START', message: msg('INVALID_PHONE_START', lang), messageEn: MSG['INVALID_PHONE_START']['en']['en'], suggestion: 'Indian mobile numbers start with 6, 7, 8, or 9.' });
    }
    return issues;
}

// ─── Aadhaar validation ─────────────────────────────────────────────────────

const AADHAAR_FIELD_IDS = [
    'aadhaar', 'aadhar', 'aadhar_no', 'aadhaar_no',
    'father_aadhaar', 'mother_aadhaar', 'spouse_aadhaar',
    'guardian_aadhaar', 'nominee_aadhaar', 'applicant_aadhaar',
];

function validateAadhaar(fieldId: string, label: string, value: string, lang: string): ValidationIssue[] {
    const d = digits(value);
    if (!d) return [];
    if (d.length !== 12) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_AADHAAR', message: msg('INVALID_AADHAAR', lang), messageEn: MSG['INVALID_AADHAAR']['en']['en'], suggestion: 'Aadhaar is a 12-digit number.' }];
    }
    return [];
}

// ─── PAN validation ─────────────────────────────────────────────────────────

const PAN_FIELD_IDS = [
    'pan', 'pan_no', 'pan_number', 'pan_card', 'pan_card_no',
    'applicant_pan', 'owner_pan', 'employer_pan',
];
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function validatePAN(fieldId: string, label: string, value: string, lang: string): ValidationIssue[] {
    const v = value.trim().toUpperCase();
    if (!v) return [];
    if (!PAN_REGEX.test(v)) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_PAN', message: msg('INVALID_PAN', lang), messageEn: MSG['INVALID_PAN']['en']['en'], suggestion: 'Example: ABCDE1234F' }];
    }
    return [];
}

// ─── PIN code validation ────────────────────────────────────────────────────

const PIN_FIELD_IDS = [
    'pincode', 'pin_code', 'address_pincode', 'pin',
    'postal_code', 'zip_code', 'present_pincode', 'permanent_pincode',
    'delivery_pincode', 'farm_pincode',
];

function validatePIN(fieldId: string, label: string, value: string, lang: string): ValidationIssue[] {
    const d = digits(value);
    if (!d) return [];
    if (d.length !== 6) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_PIN', message: msg('INVALID_PIN', lang), messageEn: MSG['INVALID_PIN']['en']['en'], suggestion: 'PIN code is always 6 digits.' }];
    }
    return [];
}

// ─── Email validation ───────────────────────────────────────────────────────

const EMAIL_FIELD_IDS = [
    'email', 'email_id', 'email_address', 'applicant_email',
    'contact_email', 'official_email', 'registered_email',
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(fieldId: string, label: string, value: string, lang: string): ValidationIssue[] {
    const v = value.trim();
    if (!v || v.toLowerCase() === 'skip') return [];
    if (!EMAIL_REGEX.test(v)) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'INVALID_EMAIL', message: msg('INVALID_EMAIL', lang), messageEn: MSG['INVALID_EMAIL']['en']['en'], suggestion: 'Example: name@example.com' }];
    }
    return [];
}

// ─── DOB / age validation ───────────────────────────────────────────────────

const DOB_FIELD_IDS = [
    'dob', 'date_of_birth', 'dob_age', 'birth_date',
    'applicant_dob', 'date_of_birth_age', 'birth_year',
    'dob_time',
];
const AGE_FIELD_IDS = [
    'age', 'mother_age', 'dob_age', 'applicant_age',
    'current_age', 'age_years',
];

function validateDOB(fieldId: string, label: string, value: string, lang: string, minAge = 0): ValidationIssue[] {
    const v = value.trim();
    if (!v) return [];
    const age = calcAge(v);
    if (age === null) return []; // can't parse → leave to AI
    if (age < 0) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'AGE_FUTURE_DOB', message: msg('AGE_FUTURE_DOB', lang), messageEn: MSG['AGE_FUTURE_DOB']['en']['en'] }];
    }
    if (minAge > 0 && age < minAge) {
        return [{ fieldId, fieldLabel: label, severity: 'error', code: 'AGE_TOO_YOUNG', message: msg('AGE_TOO_YOUNG', lang), messageEn: MSG['AGE_TOO_YOUNG']['en']['en'] }];
    }
    return [];
}

// ─── Cross-field: age vs DOB ─────────────────────────────────────────────────

function crossValidateAgeVsDOB(formData: Record<string, string>, lang: string): ValidationIssue[] {
    const dobValue = formData['dob'] || formData['date_of_birth'];
    const ageValue = formData['age'] || formData['mother_age'];
    if (!dobValue || !ageValue) return [];
    const ageFromDOB = calcAge(dobValue);
    const statedAge = parseInt(ageValue.replace(/\D/g, ''), 10);
    if (ageFromDOB === null || isNaN(statedAge)) return [];
    if (Math.abs(ageFromDOB - statedAge) > 1) { // allow 1 year tolerance for birthdays
        return [{
            fieldId: 'age',
            fieldLabel: 'Age',
            severity: 'warning',
            code: 'AGE_FIELD_MISMATCH',
            message: msg('AGE_FIELD_MISMATCH', lang),
            messageEn: `DOB gives age ${ageFromDOB} but stated age is ${statedAge}. Please reconcile.`,
        }];
    }
    return [];
}

// ─── Missing required fields ────────────────────────────────────────────────

function validateRequired(
    fields: Array<{ id: string; label: string; type?: string; requiresFile?: boolean }>,
    formData: Record<string, string>,
    lang: string,
): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const OPTIONAL_SUFFIXES = ['optional', '(optional)', 'if applicable', 'if any', 'if available'];
    for (const f of fields) {
        const labelLower = f.label.toLowerCase();
        const isOptional = OPTIONAL_SUFFIXES.some(s => labelLower.includes(s));
        if (isOptional) continue;
        const val = (formData[f.id] || '').trim();
        if (!val) {
            issues.push({
                fieldId: f.id,
                fieldLabel: f.label,
                severity: 'error',
                code: 'MISSING_REQUIRED',
                message: msg('MISSING_REQUIRED', lang),
                messageEn: `Field "${f.label}" is required but empty.`,
            });
        }
    }
    return issues;
}

// ─── Min age by service (all 45) ───────────────────────────────────────

const SERVICE_MIN_AGE: Record<number, number> = {
    2: 18, // Voter ID
    3: 18, // PAN Card
    5: 16, // Driving License (learner)
    6: 18, // Passport
    7: 18, // Vehicle Registration
    10: 18, // EPF/ESIC
    11: 18, // Labour Card
    13: 18, // EPF Withdrawal
    14: 18, // Income Tax Return
    15: 18, // GST Registration
    16: 18, // Mudra Loan
    17: 60, // Old Age Pension
    18: 18, // Widow Pension
    19: 18, // Kisan Samman Nidhi
    20: 18, // Ration Card
    21: 18, // Ayushman Bharat
    22: 18, // MGNREGA
    23: 18, // PM Awas Yojana
    25: 18, // Disability Certificate
    26: 18, // BPL Certificate
    27: 18, // Domicile Certificate
    28: 18, // Trade License
    29: 18, // Shop Registration
    31: 18, // Gas Connection Ujjwala
    33: 18, // Kisan Credit Card
    34: 18, // Pesticide License
    35: 18, // Legal Heir Certificate
    36: 18, // Marriage Registration
    37: 18, // Death Registration
    38: 18, // Digital Signature Cert
    39: 18, // Domain Registration
    40: 21, // Arms License
    41: 18, // Ex-Servicemen ID
    42: 60, // Senior Citizen Card
    43: 18, // Transgender ID Card
    44: 18, // SC/ST Fellowship
    45: 18, // Minority Scholarship
};

// ─── Service-specific business rule engine ───────────────────────────────

interface ServiceRule {
    fieldId: string;
    label: string;
    check: (value: string, formData: Record<string, string>) => boolean;
    severity: 'error' | 'warning';
    messageEn: string;
    suggestion?: string;
}

const SERVICE_SPECIFIC_RULES: Record<number, ServiceRule[]> = {
    // 8 — Birth Certificate: birth date not in future
    8: [{
        fieldId: 'dob_time', label: 'Date & Time of Birth',
        check: (v) => { if (!v) return true; const d = new Date(v); return isNaN(d.getTime()) || d <= new Date(); },
        severity: 'error', messageEn: 'Date of birth cannot be in the future.'
    }],

    // 9 — Income Certificate: realistic income amount
    9: [{
        fieldId: 'annual_income', label: 'Annual Income',
        check: (v) => { if (!v) return true; const n = parseInt(v.replace(/[^0-9]/g, '')); return n > 0 && n < 100000000; },
        severity: 'warning', messageEn: 'Annual income should be a realistic amount in Indian Rupees.',
        suggestion: 'Enter yearly income amount e.g. 120000'
    }],

    // 13 — EPF Withdrawal: UAN must be 12 digits
    13: [{
        fieldId: 'uan_no', label: 'UAN Number',
        check: (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, '')),
        severity: 'error', messageEn: 'UAN (Universal Account Number) must be exactly 12 digits.',
        suggestion: 'Find your UAN on your payslip or EPFO portal.'
    }],

    // 15 — GST Registration: GSTIN format
    15: [{
        fieldId: 'gstin', label: 'GSTIN',
        check: (v) => !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.toUpperCase()),
        severity: 'error', messageEn: 'GSTIN must be 15 characters e.g. 22AAAAA0000A1Z5.',
        suggestion: 'Example: 22AAAAA0000A1Z5'
    }],

    // 17 — Old Age Pension: age 60+
    17: [{
        fieldId: 'dob_age', label: 'Date of Birth / Age',
        check: (v) => { const m = v.match(/\d+/); return !m || parseInt(m[0]) >= 60; },
        severity: 'error', messageEn: 'Old Age Pension requires the applicant to be at least 60 years old.'
    }],

    // 32 — Soil Health Card: survey number warning
    32: [{
        fieldId: 'survey_no', label: 'Survey/Khasra Number',
        check: (v) => !v || v.trim().length >= 1,
        severity: 'warning', messageEn: 'Survey/Khasra number is required for processing.'
    }],

    // 33 — Kisan Credit Card: positive land area
    33: [{
        fieldId: 'land_area', label: 'Land Area',
        check: (v) => { if (!v) return true; const n = parseFloat(v); return !isNaN(n) && n > 0; },
        severity: 'error', messageEn: 'Land area must be a positive number.',
        suggestion: 'Example: 2.5 (in acres or hectares)'
    }],

    // 36 — Marriage Registration: date not in future
    36: [{
        fieldId: 'marriage_date', label: 'Date of Marriage',
        check: (v) => { if (!v) return true; const d = new Date(v); return isNaN(d.getTime()) || d <= new Date(); },
        severity: 'error', messageEn: 'Marriage date cannot be in the future.'
    }],

    // 37 — Death Registration: date not in future
    37: [{
        fieldId: 'date_of_death', label: 'Date of Death',
        check: (v) => { if (!v) return true; const d = new Date(v); return isNaN(d.getTime()) || d <= new Date(); },
        severity: 'error', messageEn: 'Date of death cannot be in the future.'
    }],

    // 40 — Arms License: must be 21+
    40: [{
        fieldId: 'dob', label: 'Date of Birth',
        check: (v) => {
            if (!v) return true;
            const d = new Date(v);
            if (isNaN(d.getTime())) return true;
            return Math.floor((Date.now() - d.getTime()) / 31557600000) >= 21;
        },
        severity: 'error', messageEn: 'Arms Licence applicant must be at least 21 years old.'
    }],

    // 42 — Senior Citizen Card: must be 60+
    42: [{
        fieldId: 'dob_age', label: 'Date of Birth / Age',
        check: (v) => { const m = v.match(/\d+/); return !m || parseInt(m[0]) >= 60; },
        severity: 'error', messageEn: 'Senior Citizen Card requires the applicant to be at least 60 years old.'
    }],
};

function runServiceRules(
    serviceId: number,
    formData: Record<string, string>,
    lang: string,
): ValidationIssue[] {
    const rules = SERVICE_SPECIFIC_RULES[serviceId];
    if (!rules) return [];
    const issues: ValidationIssue[] = [];
    for (const rule of rules) {
        const value = formData[rule.fieldId] || '';
        if (!rule.check(value, formData)) {
            issues.push({
                fieldId: rule.fieldId,
                fieldLabel: rule.label,
                severity: rule.severity,
                code: `SVC_${serviceId}_${rule.fieldId.toUpperCase()}`,
                message: rule.messageEn,
                messageEn: rule.messageEn,
                suggestion: rule.suggestion,
            });
        }
    }
    return issues;
}

// ─── PUBLIC ENTRY POINT ──────────────────────────────────────────────────────

/**
 * Run all rule-based validations on a completed form synchronously.
 * Works for all 45 government services.
 * @param fields    The service field definitions
 * @param formData  The current form values keyed by field id
 * @param lang      2-letter language code (e.g. 'en', 'hi')
 * @param serviceId The government service id (1-45)
 */
export function runSmartValidation(
    fields: Array<{ id: string; label: string; type?: string; requiresFile?: boolean }>,
    formData: Record<string, string>,
    lang: string = 'en',
    serviceId?: number,
): ValidationResult {
    const issues: ValidationIssue[] = [];
    const minAge = serviceId !== undefined ? (SERVICE_MIN_AGE[serviceId] ?? 0) : 0;

    // 1. Required fields (skip file fields — handled by upload UI)
    issues.push(...validateRequired(
        fields.filter(f => !f.requiresFile && f.type !== 'file'),
        formData,
        lang,
    ));

    // 2. Per-field format checks (keyword matching — covers ALL 45 services)
    for (const field of fields) {
        const value = formData[field.id] || '';
        if (!value.trim()) continue; // empty → already covered by required check

        const id = field.id.toLowerCase();
        const label = field.label;

        if (PHONE_FIELD_IDS.some(k => id.includes(k))) {
            issues.push(...validatePhone(field.id, label, value, lang));
        } else if (AADHAAR_FIELD_IDS.some(k => id.includes(k))) {
            issues.push(...validateAadhaar(field.id, label, value, lang));
        } else if (PAN_FIELD_IDS.some(k => id.includes(k))) {
            issues.push(...validatePAN(field.id, label, value, lang));
        } else if (PIN_FIELD_IDS.some(k => id.includes(k))) {
            issues.push(...validatePIN(field.id, label, value, lang));
        } else if (EMAIL_FIELD_IDS.some(k => id.includes(k))) {
            issues.push(...validateEmail(field.id, label, value, lang));
        } else if (DOB_FIELD_IDS.some(k => id === k || id.includes(k))) {
            issues.push(...validateDOB(field.id, label, value, lang, minAge));
        }
    }

    // 3. Universal cross-field checks
    issues.push(...crossValidateAgeVsDOB(formData, lang));

    // 4. Service-specific business rules
    if (serviceId !== undefined) {
        issues.push(...runServiceRules(serviceId, formData, lang));
    }

    // 5. Deduplicate by fieldId + code, prefer errors over warnings
    const byKey = new Map<string, ValidationIssue>();
    for (const issue of issues) {
        const key = `${issue.fieldId}:${issue.code}`;
        const existing = byKey.get(key);
        if (!existing || issue.severity === 'error') {
            byKey.set(key, issue);
        }
    }

    const unique = Array.from(byKey.values());
    return {
        isValid: unique.filter(i => i.severity === 'error').length === 0,
        issues: unique,
    };
}
