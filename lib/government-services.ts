export interface ServiceField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'file' | 'date';
  voiceLabel?: Record<string, string>; // Multi-language voice prompts
  requiresFile?: boolean; // Mark fields that need file upload
  description?: string; // Guidance for the user
  validation?: {
    pattern?: string;
    message?: Record<string, string>;
    minLength?: number;
    maxLength?: number;
  };
  options?: Array<{ label: string; value: string }>;
}

export interface GovernmentService {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  fields: ServiceField[];
}

const APPLICANT_PHOTO_FIELD: ServiceField = {
  id: 'applicant_photo',
  label: 'Applicant Photograph',
  type: 'file',
  requiresFile: true,
  description: 'Please upload a clear, front-facing passport size photo of the applicant.',
  voiceLabel: {
    en: 'Please upload a clear, front-facing passport size photo of yourself.',
    hi: 'कृपया अपनी एक स्पष्ट, सामने की ओर मुख वाली पासपोर्ट आकार की फोटो अपलोड करें।',
    te: 'దయచేసి మీ స్పష్టమైన, పాస్‌పోర్ట్ సైజు ఫోటోను అప్‌లోడ్ చేయండి.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಪಷ್ಟವಾದ ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    ta: 'தயவுசெய்து உங்கள் தெளிவான பாஸ்போர்ட் அளவு புகைப்படத்தைப் பதிவேற்றவும்.',
    ml: 'ദയവായി നിങ്ങളുടെ വ്യക്തമായ പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.',
    mr: 'कृपया आपला स्पष्ट पासपोर्ट आकाराचा फोटो अपलोड करा.',
    bn: 'দয়া করে আপনার একটি পরিষ্কার পাসপোর্ট সাইজের ছবি আপলোড করুন।',
    gu: 'કૃપા કરીને તમારો સ્પષ્ટ પાસપોર્ટ સાઈઝનો ફોટો અપલોડ કરો.',
    pa: 'ਕਿਰਪಾ ਕਰਕੇ ਆਪਣੀ ਇੱਕ ਸਾਫ਼ ਪਾਸਪੋਰಟ್ ਸਾਈਜ਼ ਫੋટો ਅਪਲੋಡ್ ਕਰੋ।',
    or: 'ଦୟାକରି ଆପଣଙ୍କର ଏକ ସ୍ପଷ୍ଟ ପାସପୋର୍ଟ ସାଇଜ୍ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ |',
    ur: 'براہ کرم اپنی ایک واضح پاسپورٹ سائز تصویر اپ لوڈ کریں۔'
  }
};

const COMMON_FIELDS: ServiceField[] = [
  APPLICANT_PHOTO_FIELD,
  {
    id: 'name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' },
    validation: {
      pattern: '^[0-9]{10}$',
      message: {
        en: 'Please enter exactly 10 digits for your phone number.',
        hi: 'कृपया अपने फ़ोन नंबर के लिए ठीक 10 अंक दर्ज करें।',
        te: 'దయచేసి మీ ఫోన్ నంబర్ కోసం సరిగ్గా 10 అంకెలను నమోదు చేయండి.'
      }
    }
  },
];

const AADHAAR_UPDATE_FIELDS: ServiceField[] = [
  {
    id: 'name', label: 'Name Correction', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as it should appear after correction', hi: 'सुधार के बाद आपका पूरा नाम जैसा होना चाहिए वैसा बताएं', te: 'సవరణ తర్వాత మీ పూర్తి పేరు ఎలా ఉండాలో చెప్పండి' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender? Male, Female, or Other?', hi: 'आपका लिंग क्या है? पुरुष, महिला या अन्य?', te: 'మీ లింగం ఏమిటి? పురుషుడు, స్త్రీ లేదా ఇతర?' },
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' }
    ]
  },
  {
    id: 'house_name', label: 'House / Flat / Building Name', type: 'text',
    voiceLabel: { en: 'Tell me your House, Flat or Building name', hi: 'अपने घर, फ्लैट या इमारत का नाम बताएं', te: 'మీ ఇల్లు, ఫ్లాట్ లేదా భవనం పేరు చెప్పండి' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your Street, Area or Locality', hi: 'अपनी गली, इलाका या क्षेत्र बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_city', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your Village, Town or City', hi: 'अपने गांव, कस्बे या शहर का नाम बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం పేరు చెప్పండి' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' },
    validation: {
      pattern: '^[0-9]{6}$',
      message: {
        en: 'Please enter exactly 6 digits for your PIN code.',
        hi: 'कृपया अपने पिन कोड के लिए ठीक 6 अंक दर्ज करें।',
        te: 'దయచేసి మీ పిన్ కోడ్ కోసం సరిగ్గా 6 అంకెలను నమోదు చేయండి.'
      }
    }
  },
  {
    id: 'mobile', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' },
    validation: {
      pattern: '^[0-9]{10}$',
      message: {
        en: 'Please enter exactly 10 digits for your mobile number.',
        hi: 'कृपया अपने मोबाइल नंबर के लिए ठीक 10 अंक दर्ज करें।',
        te: 'దయచేసి మీ మొబైల్ సంఖ్య కోసం సరిగ్గా 10 అంకెలను నమోదు చేయండి.'
      }
    }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address? You can say skip if you dont want to provide it.', hi: 'आपका ईमेल पता क्या है? यदि आप नहीं देना चाहते तो छोड़ सकते हैं।', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి? మీకు ఇష్టం లేకపోతే వదిలేయవచ్చు.' },
    validation: {
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      message: {
        en: 'Please enter a valid email address.',
        hi: 'कृपया एक वैध ईमेल पता दर्ज करें।',
        te: 'దయచేసి సరైన ఈమెయిల్ అడ్రస్‌ను నమోదు చేయండి.'
      }
    }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'Please tell me your 12 digit Aadhaar number', hi: 'कृपया अपना 12 अंकों का आधार नंबर बताएं', te: 'దయచేసి మీ 12 అంకెల ఆధార్ సంఖ్యను చెప్పండి' },
    validation: {
      pattern: '^[0-9]{12}$',
      message: {
        en: 'Please enter exactly 12 digits for Aadhaar number.',
        hi: 'कृपया आधार नंबर के लिए ठीक 12 अंक दर्ज करें।',
        te: 'దయచేసి ఆధార్ సంఖ్య కోసం సరిగ్గా 12 అంకెలను నమోదు చేయండి.'
      }
    }
  },
  {
    id: 'doc_type', label: 'Document Proof (Upload File)', type: 'file',
    requiresFile: true,
    description: 'Upload a clear proof of the specific detail you are updating (e.g., for name change, upload Gazette notification or Marriage certificate).',
    voiceLabel: {
      en: 'Please upload a clear proof of the specific detail you are updating. For example, for a name change, upload a Gazette notification or Marriage certificate.',
      hi: 'कृपया आपके द्वारा अपडेट किए जा रहे विवरण का स्पष्ट प्रमाण अपलोड करें। उदाहरण के लिए, नाम बदलने के लिए, राजपत्र अधिसूचना या विवाह प्रमाणपत्र अपलोड करें।',
      te: 'దయచేసి మీరు అప్‌డేట్ చేస్తున్న నిర్దిష్ట వివరాల యొక్క స్పష్టమైన సాక్ష్యాన్ని అప్‌లోడ్ చేయండి. ఉదాహరణకు, పేరు మార్పు కోసం, గెజిట్ నోటిఫికేషన్ లేదా వివాహ ధృవీకరణ పత్రాన్ని అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'update_desc', label: 'Update Description', type: 'textarea',
    voiceLabel: { en: 'Briefly describe what you want to update', hi: 'संक्षेप में बताएं कि आप क्या अपडेट करना चाहते हैं', te: 'మీరు ఏమి అప్‌డేట్ చేయాలనుకుంటున్నారో క్లుప్తంగా చెప్పండి' }
  }
];

const PAN_CARD_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name (Surname, First, Middle)', type: 'text',
    voiceLabel: { en: 'Please tell me your full name starting with your surname', hi: 'कृपया अपना पूरा नाम बताएं, सरनेम से शुरू करते हुए', te: 'దయచేసి మీ ఇంటి పేరుతో మొదలయ్యే మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'printed_name', label: 'Name on PAN Card', type: 'text',
    voiceLabel: { en: 'How would you like your name printed on the PAN card?', hi: 'आप पैन कार्ड पर अपना नाम कैसा छपा हुआ चाहते हैं?', te: 'మీ పేరు పాన్ కార్డ్‌పై ఎలా ముద్రించబడాలని మీరు కోరుకుంటున్నారు?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender? Male, Female, or Transgender?', hi: 'आपका लिंग क्या है? पुरुष, महिला, या ट्रांसजेंडर?', te: 'మీ లింగం ఏమిటి? పురుషుడు, స్త్రీ, లేదా ట్రాన్స్‌జెండర్?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'house_door_no', label: 'House / Flat / Door No', type: 'text',
    voiceLabel: { en: 'Tell me your House, Flat or Door number', hi: 'अपने घर, फ्लैट या डोर नंबर बताएं', te: 'మీ ఇల్లు, ఫ్లాట్ లేదా డోర్ నంబర్ చెప్పండి' }
  },
  {
    id: 'street_area', label: 'Street / Area', type: 'text',
    voiceLabel: { en: 'Tell me your Street or Area', hi: 'अपनी गली या क्षेत्र बताएं', te: 'మీ వీధి లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'city_town_village', label: 'City / Town / Village', type: 'text',
    voiceLabel: { en: 'Tell me your City, Town or Village', hi: 'अपने शहर, कस्बे या गांव का नाम बताएं', te: 'మీ నగరం, పట్టణం లేదా గ్రామం పేరు చెప్పండి' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'telephone', label: 'Telephone Number', type: 'tel',
    voiceLabel: { en: 'What is your telephone or mobile number?', hi: 'अपना टेलीफोन या मोबाइल नंबर बताएं', te: 'మీ టెలిఫోన్ లేదా మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'email', label: 'Email Id', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'applicant_status', label: 'Status of Applicant', type: 'text',
    voiceLabel: { en: 'What is your status? Individual, Company, or Firm?', hi: 'आपकी स्थिति क्या है? व्यक्ति, कंपनी, या फर्म?', te: 'మీ హోదా ఏమిటి? వ్యక్తిగత, కంపెనీ, లేదా సంస్థ?' }
  },

  {
    id: 'poi_file', label: 'Upload Proof of Identity', type: 'file',
    requiresFile: true,
    description: 'Upload a clear photo of your Aadhaar Card, Voter ID, or Indian Passport to verify your identity.',
    voiceLabel: {
      en: 'Please upload a clear photo of your Aadhaar Card, Voter ID, or Indian Passport to verify your identity.',
      hi: 'कृपया अपनी पहचान सत्यापित करने के लिए अपने आधार कार्ड, वोटर आईडी या भारतीय पासपोर्ट की एक स्पष्ट फोटो अपलोड करें।',
      te: 'మీ గుర్తింపును ధృవీకరించడానికి దయచేసి మీ ఆధార్ కార్డ్, ఓటర్ ఐడి లేదా భారతీయ పాస్‌పోర్ట్ యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.'
    }
  },

  {
    id: 'poa_file', label: 'Upload Proof of Address', type: 'file',
    requiresFile: true,
    description: 'Upload an electricity bill, water bill, gas bill, or Aadhaar card showing your current address.',
    voiceLabel: {
      en: 'Please upload an electricity bill, water bill, gas bill, or Aadhaar card showing your current address.',
      hi: 'कृपया बिजली का बिल, पानी का बिल, गैस बिल या आपका वर्तमान पता दिखाने वाला आधार कार्ड अपलोड करें।',
      te: 'దయచేసి మీ ప్రస్తుత చిరునామాను చూపే విద్యుత్ బిల్లు, నీటి బిల్లు, గ్యాస్ బిల్లు లేదా ఆధార్ కార్డ్‌ని అప్‌లోడ్ చేయండి.'
    }
  },

  {
    id: 'dob_file', label: 'Upload Proof of Date of Birth', type: 'file',
    requiresFile: true,
    description: 'Upload your Birth Certificate, 10th marksheet, or Passport showing your date of birth.',
    voiceLabel: {
      en: 'Please upload your Birth Certificate, 10th marksheet, or Passport showing your date of birth.',
      hi: 'कृपया अपना जन्म प्रमाण पत्र, 10वीं की मार्कशीट या जन्म तिथि दिखाने वाला पासपोर्ट अपलोड करें।',
      te: 'దయచేసి మీ పుట్టిన తేదీని చూపే మీ పుట్టిన సర్టిఫికేట్, 10వ మార్కుల షీట్ లేదా పాస్‌పోర్ట్‌ను అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'description', label: 'Additional Description', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to share?', hi: 'कोई और विवरण जो आप साझा करना चाहते हैं?', te: 'మీరు భాగస్వామ్యం చేయాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const VOTER_ID_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'surname', label: 'Surname (if any)', type: 'text',
    voiceLabel: { en: 'Tell me your surname or family name', hi: 'अपना उपनाम या सरनेम बताएं', te: 'మీ ఇంటిపేరు చెప్పండి' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob_age', label: 'Date of Birth / Age', type: 'text',
    voiceLabel: { en: 'What is your date of birth or current age?', hi: 'आपकी जन्म तिथि या वर्तमान आयु क्या है?', te: 'మీ పుట్టిన తేదీ లేదా ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'pob', label: 'Place of Birth (State, District)', type: 'text',
    voiceLabel: { en: 'Tell me your place of birth, including state and district', hi: 'अपना जन्म स्थान बताएं, राज्य और जिले के साथ', te: 'రాష్ట్రం మరియు జిల్లాతో సహా మీ పుట్టిన స్థలాన్ని చెప్పండి' }
  },
  {
    id: 'citizen_confirm', label: 'Indian Citizen (Yes/No)', type: 'text',
    voiceLabel: { en: 'Are you an Indian citizen?', hi: 'क्या आप भारतीय नागरिक हैं?', te: 'మీరు భారతీయ పౌరులా?' }
  },
  {
    id: 'age_confirm', label: 'Age 18+ (Yes/No)', type: 'text',
    voiceLabel: { en: 'Are you 18 years or older as of today?', hi: 'क्या आप आज की तारीख में 18 वर्ष या उससे अधिक आयु के हैं?', te: 'ఈ రోజు నాటికి మీకు 18 ఏళ్లు లేదా అంతకంటే ఎక్కువ వయస్సు ఉందా?' }
  },
  {
    id: 'house_no', label: 'House / Flat Number', type: 'text',
    voiceLabel: { en: 'Tell me your house or flat number', hi: 'अपना घर या फ्लैट नंबर बताएं', te: 'మీ ఇల్లు లేదా ఫ్లాట్ నంబర్ చెప్పండి' }
  },
  {
    id: 'street_locality', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_city', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपने गांव, कस्बे या शहर का नाम बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం పేరు చెప్పండి' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'stay_duration', label: 'Stay Duration at Current Address', type: 'text',
    voiceLabel: { en: 'How long have you been staying at this address in months or years?', hi: 'आप इस पते पर कितने समय से रह रहे हैं महीनों या वर्षों में?', te: 'మీరు ఈ చిరునామాలో నెలలు లేదా సంవత్సరాలలో ఎంతకాలం ఉంటున్నారు?' }
  },
  {
    id: 'has_disability', label: 'Any Disability (Yes/No)', type: 'text',
    voiceLabel: { en: 'Do you have any disability?', hi: 'क्या आपको कोई विकलांगता है?', te: 'మీకు ఏదైనా వైకల్యం ఉందా?' }
  },
  {
    id: 'disability_type', label: 'Type of Disability (if yes)', type: 'text',
    voiceLabel: { en: 'If yes, please specify the type of disability', hi: 'यदि हाँ, तो कृपया विकलांगता का प्रकार बताएं', te: 'అవును అయితే, దయచేసి వైకల్యం రకాన్ని పేర్కొనండి' }
  },
  {
    id: 'citizen_proof', label: 'Upload Citizenship Proof (ID Document)', type: 'file',
    requiresFile: true,
    description: 'Upload a certified copy of your birth certificate or identity proof to confirm your citizenship.',
    voiceLabel: {
      en: 'Please upload a certified copy of your birth certificate or identity proof to confirm your citizenship.',
      hi: 'कृपया अपनी नागरिकता की पुष्टि के लिए अपने जन्म प्रमाण पत्र या पहचान प्रमाण की प्रमाणित प्रति अपलोड करें।',
      te: 'దయచేసి మీ పౌరసత్వాన్ని ధృవీకరించడానికి మీ పుట్టిన సర్టిఫికేట్ లేదా గుర్తింపు నిరూపణ యొక్క ధృవీకరించబడిన కాపీని అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'address_proof', label: 'Upload Address Proof', type: 'file',
    requiresFile: true,
    description: 'Upload a clear photo of your Utility Bill or Address proof for verification.',
    voiceLabel: {
      en: 'Please upload a clear photo of your Utility Bill or Address proof for verification.',
      hi: 'कृपया सत्यापन के लिए अपने उपयोगिता बिल (बिजली/पानी) या पते के प्रमाण की स्पष्ट फोटो अपलोड करें।',
      te: 'దయచేసి ధృవీకరణ కోసం మీ యుటిలిటీ బిల్లు లేదా చిరునామా నిరూపణ యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'voter_desc', label: 'Additional Description', type: 'textarea',
    voiceLabel: { en: 'Briefly share any other details related to your voter registration', hi: 'अपने मतदाता पंजीकरण से संबंधित कोई अन्य विवरण संक्षेप में साझा करें', te: 'మీ ఓటరు నమోదుకు సంబంధించిన ఇతర వివరాలను క్లుప్తంగా పంచుకోండి' }
  }
];

const BIRTH_CERTIFICATE_FIELDS: ServiceField[] = [
  {
    id: 'child_name', label: "Child's Name (Can be blank)", type: 'text',
    voiceLabel: { en: "What is the child's name? You can leave this blank if not yet decided.", hi: 'बच्चे का नाम क्या है? यदि अभी तय नहीं हुआ है तो आप इसे खाली छोड़ सकते हैं।', te: 'పిల్లల పేరు ఏమిటి? ఇంకా నిర్ణయించకపోతే మీరు దీన్ని ఖాళీగా వదిలివేయవచ్చు.' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is the gender of the child?', hi: 'बच्चे का लिंग क्या है?', te: 'పిల్లల లింగం ఏమిటి?' }
  },
  {
    id: 'dob_time', label: 'Date and Time of Birth', type: 'text',
    voiceLabel: { en: "Please say the baby's date and time of birth", hi: 'कृपया बच्चे की जन्म तिथि और समय बताएं', te: 'దయచేసి శిశువు పుట్టిన తేదీ మరియు సమయాన్ని చెప్పండి' }
  },
  {
    id: 'birth_place_type', label: 'Place of Birth (Hospital/Home)', type: 'text',
    voiceLabel: { en: 'Was the baby born in a hospital or at home?', hi: 'क्या बच्चे का जन्म अस्पताल में हुआ था या घर पर?', te: 'పాప ఆసుపత్రిలో పుట్టిందా లేదా ఇంట్లో పుట్టిందా?' }
  },
  {
    id: 'hospital_home_name', label: 'Hospital Name / House Number', type: 'text',
    voiceLabel: { en: 'Please tell me the hospital name or your house number where the birth occurred', hi: 'कृपया उस अस्पताल का नाम या अपने घर का नंबर बताएं जहां जन्म हुआ था', te: 'దయచేసి పుట్టిన ఆసుపత్రి పేరు లేదా మీ ఇంటి నంబర్ చెప్పండి' }
  },
  {
    id: 'birth_address', label: 'Village / Town / Hospital Address', type: 'text',
    voiceLabel: { en: 'Tell me the village, town or hospital address', hi: 'गांव, कस्बे या अस्पताल का पता बताएं', te: 'గ్రామం, పట్టణం లేదా ఆసుపత్రి చిరునామాను చెప్పండి' }
  },
  {
    id: 'birth_district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is the district of birth?', hi: 'जन्म का जिला क्या है?', te: 'పుట్టిన జిల్లా ఏమిటి?' }
  },
  {
    id: 'birth_state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is the state of birth?', hi: 'जन्म का राज्य क्या है?', te: 'పుట్టిన రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Full Name", type: 'text',
    voiceLabel: { en: "What is the father's full name?", hi: 'पिता का पूरा नाम क्या है?', te: 'తండ్రి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'father_aadhaar', label: "Father's Aadhaar (Optional)", type: 'text',
    voiceLabel: { en: "What is the father's Aadhaar number?", hi: 'पिता का आधार नंबर क्या है?', te: 'తండ్రి ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'father_occupation', label: "Father's Occupation", type: 'text',
    voiceLabel: { en: "What is the father's occupation?", hi: 'पिता का व्यवसाय क्या है?', te: 'తండ్రి వృత్తి ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Full Name", type: 'text',
    voiceLabel: { en: "Please say the mother's full name", hi: 'कृपया माँ का पूरा नाम बताएं', te: 'దయచేసి తల్లి పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'mother_aadhaar', label: "Mother's Aadhaar (Optional)", type: 'text',
    voiceLabel: { en: "What is the mother's Aadhaar number?", hi: 'माता का आधार नंबर क्या है?', te: 'తల్లి ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mother_age', label: 'Mother’s Age at time of birth', type: 'number',
    voiceLabel: { en: 'How old was the mother at the time of birth?', hi: 'जन्म के समय माता की आयु क्या थी?', te: 'పుట్టిన సమయంలో తల్లి వయస్సు ఎంత?' }
  },
  {
    id: 'parent_address', label: 'Complete Home Address', type: 'text',
    voiceLabel: { en: 'Please say your complete home address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा घर का पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి ఇంటి చిరునామాను చెప్పండి' }
  },
  {
    id: 'informant_details', label: 'Informant Name & Relationship', type: 'text',
    voiceLabel: { en: 'Who is reporting this birth? Please say the name and relationship, like father, mother, or hospital staff.', hi: 'इस जन्म की सूचना कौन दे रहा है? कृपया नाम और संबंध बताएं, जैसे पिता, माता या अस्पताल के कर्मचारी।', te: 'ఈ పుట్టుక గురించి ఎవరు నివేదిస్తున్నారు? దయచేసి పేరు మరియు సంబంధాన్ని చెప్పండి, తండ్రి, తల్లి లేదా ఆసుపత్రి సిబ్బంది వంటివి.' }
  },
  {
    id: 'informant_mobile', label: 'Informant Mobile Number', type: 'tel',
    voiceLabel: { en: "What is the informant's mobile number?", hi: 'सूचना देने वाले का मोबाइल नंबर क्या है?', te: 'సమాచారకర్త మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'doc_selection', label: 'Supporting Documents Available', type: 'text',
    voiceLabel: { en: 'Do you have the hospital birth slip, discharge summary, or parent Aadhaar? Please specify which ones you have.', hi: 'क्या आपके पास अस्पताल की जन्म पर्ची, डिस्चार्ज समरी, या माता-पिता का आधार है? कृपया बताएं कि आपके पास कौन से हैं।', te: 'మీ వద్ద ఆసుపత్రి బర్త్ స్లిప్, డిశ్చార్జ్ సమ్మరీ లేదా తల్లిదండ్రుల ఆధార్ ఉందా? మీ వద్ద ఏవి ఉన్నాయో దయచేసి పేర్కొనండి.' }
  },
  {
    id: 'hospital_doc', label: 'Upload Hospital Birth Record', type: 'file',
    requiresFile: true,
    description: 'Upload the hospital birth slip or discharge summary which shows the baby birth details clearly.',
    voiceLabel: {
      en: 'Please upload the hospital birth slip or discharge summary which shows the baby birth details clearly.',
      hi: 'कृपया अस्पताल की जन्म पर्ची या डिस्चार्ज समरी अपलोड करें जो बच्चे के जन्म का विवरण स्पष्ट रूप से दिखाती हो।',
      te: 'దయచేసి శిశువు పుట్టిన వివరాలను స్పష్టంగా చూపే ఆసుపత్రి పుట్టిన స్లిప్ లేదా డిశ్చార్జ్ సమ్మరీని అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'parent_doc', label: 'Upload Parent ID/Aadhaar', type: 'file',
    requiresFile: true,
    description: 'Upload a clear copy of either parent Aadhaar Card or Voter ID to link with child records.',
    voiceLabel: {
      en: 'Please upload a clear copy of either parent Aadhaar Card or Voter ID to link with child records.',
      hi: 'बच्चे के रिकॉर्ड के साथ जोड़ने के लिए माता-पिता में से किसी एक के आधार कार्ड या वोटर आईडी की स्पष्ट प्रति अपलोड करें।',
      te: 'పిల్లల రికార్డులతో లింక్ చేయడానికి తల్లిదండ్రుల ఆధార్ కార్డ్ లేదా ఓటర్ ఐడి యొక్క స్పష్టమైన కాపీని అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'birth_desc', label: 'Additional Description', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to share about the birth registration?', hi: 'जन्म पंजीकरण के बारे में कोई और विवरण जो आप साझा करना चाहते हैं?', te: 'పుట్టిన నమోదు గురించి మీరు భాగస్వామ్యం చేయాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const CASTE_CERTIFICATE_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please say your full name as per Aadhaar', hi: 'कृपया अपना पूरा नाम आधार के अनुसार बताएं', te: 'దయచేసి ఆధార్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob_age', label: 'Date of Birth / Age', type: 'text',
    voiceLabel: { en: 'What is your date of birth or age?', hi: 'आपकी जन्म तिथि या आयु क्या है?', te: 'మీ పుట్టిన తేదీ లేదా వయస్సు ఏమిటి?' }
  },
  {
    id: 'aadhar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'caste_name', label: 'Caste Name', type: 'text',
    voiceLabel: { en: 'Please say your caste name', hi: 'कृपया अपने जाति का नाम बताएं', te: 'దయచేసి మీ కులం పేరు చెప్పండి' }
  },
  {
    id: 'caste_category', label: 'Caste Category (SC/ST/BC/OBC/General)', type: 'text',
    voiceLabel: { en: 'Is your category SC, ST, BC, OBC or General?', hi: 'आपकी श्रेणी SC, ST, BC, OBC या सामान्य है?', te: 'మీ వర్గం SC, ST, BC, OBC లేదా జనరల్?' }
  },
  {
    id: 'sub_caste', label: 'Sub-caste (if applicable)', type: 'text',
    voiceLabel: { en: 'What is your sub-caste, if any?', hi: 'आपकी उपजाति क्या है, यदि कोई हो?', te: 'మీ ఉపకులం ఏమిటి, ఏదైనా ఉంటే?' }
  },
  {
    id: 'father_details', label: "Father's Name & Caste", type: 'text',
    voiceLabel: { en: "Please say your father's name and caste", hi: 'कृपया अपने पिता का नाम और जाति बताएं', te: 'దయచేసి మీ తండ్రి పేరు మరియు కులం చెప్పండి' }
  },
  {
    id: 'father_occupation', label: "Father's Occupation", type: 'text',
    voiceLabel: { en: "What is your father's occupation?", hi: 'आपके पिता का व्यवसाय क्या है?', te: 'మీ తండ్రి వృత్తి ఏమిటి?' }
  },
  {
    id: 'mother_details', label: "Mother's Name & Caste (Optional)", type: 'text',
    voiceLabel: { en: "Please say your mother's name and caste", hi: 'कृपया अपनी माँ का नाम और जाति बताएं', te: 'దయచేసి మీ తల్లి పేరు మరియు కులం చెప్పండి' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including village, mandal, and district', hi: 'कृपया अपना पूरा आवासीय पता बताएं, जिसमें गांव, मंडल और जिला शामिल हो', te: 'దయచేసి గ్రామం, మండలం మరియు జిల్లాతో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'address_pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'purpose', label: 'Purpose (Education/Scholarship/Job/etc.)', type: 'text',
    voiceLabel: { en: 'Why do you need this certificate? For education, scholarship, or job?', hi: 'आपको इस प्रमाण पत्र की आवश्यकता क्यों है? शिक्षा, छात्रवृत्ति या नौकरी के लिए?', te: 'మీకు ఈ సర్టిఫికేట్ ఎందుకు అవసరం? విద్య, స్కాలర్‌షిప్ లేదా ఉద్యోగం కోసమా?' }
  },
  {
    id: 'caste_proof', label: 'Family Caste Proof (Caste Cert/School Cert/etc.)', type: 'text',
    voiceLabel: { en: "Do you have your father's caste certificate or any other proof?", hi: 'क्या आपके पास अपने पिता का जाति प्रमाण पत्र या कोई अन्य प्रमाण है?', te: 'మీ తండ్రి కుల ధృవీకరణ పత్రం లేదా ఇతర ఆధారాలు ఉన్నాయా?' }
  },
  {
    id: 'family_income', label: 'Annual Family Income', type: 'number',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' }
  },
  {
    id: 'income_cert_no', label: 'Income Certificate Number (if available)', type: 'text',
    voiceLabel: { en: 'If you have an income certificate, please say the number', hi: 'यदि आपके पास आय प्रमाण पत्र है, तो कृपया उसका नंबर बताएं', te: 'మీ వద్ద ఆదాయ ధృవీకరణ పత్రం ఉంటే, దయచేసి ఆ సంఖ్యను చెప్పండి' }
  },
  {
    id: 'caste_proof_file', label: 'Upload Caste Certificate', type: 'file',
    requiresFile: true,
    description: 'Upload a clear photo of your Community Certificate or your Father Caste Certificate if available.',
    voiceLabel: {
      en: 'Please upload a clear photo of your Community Certificate or your Father Caste Certificate if available.',
      hi: 'कृपया अपने सामुदायिक प्रमाणपत्र या अपने पिता के जाति प्रमाणपत्र की स्पष्ट फोटो अपलोड करें यदि उपलब्ध हो।',
      te: 'దయచేసి మీ కమ్యూనిటీ సర్టిఫికేట్ లేదా మీ తండ్రి కుల సర్టిఫికేట్ అందుబాటులో ఉంటే దాని స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'income_proof_file', label: 'Upload Income Proof', type: 'file',
    requiresFile: true,
    description: 'Upload your latest Income Certificate, Salary Slip, or Bank Statement to verify family income.',
    voiceLabel: {
      en: 'Please upload your latest Income Certificate, Salary Slip, or Bank Statement to verify family income.',
      hi: 'पारिवारिक आय सत्यापित करने के लिए अपना नवीनतम आय प्रमाण पत्र, वेतन पर्ची या बैंक विवरण अपलोड करें।',
      te: 'కుటుంబ ఆదాయాన్ని ధృవీకరించడానికి మీ తాజా ఆదాయ ధృవీకరణ పత్రం, జీతం స్లిప్ లేదా బ్యాంక్ స్టేట్‌మెంట్‌ను అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'caste_desc', label: 'Specific Request/Description', type: 'textarea',
    voiceLabel: { en: 'Any specific details you want to add?', hi: 'कोई विशिष्ट विवरण जो आप जोड़ना चाहते हैं?', te: 'మీరు జోడించాలనుకుంటున్న ఏवైనా నిర్దిష్ట వివరాలు ఉన్నాయా?' }
  }
];

const INCOME_CERTIFICATE_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please say your full name as per Aadhaar', hi: 'कृपया अपना पूरा नाम आधार के अनुसार बताएं', te: 'దయచేసి ఆధార్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'aadhar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob_age', label: 'Date of Birth / Age', type: 'text',
    voiceLabel: { en: 'What is your date of birth or age?', hi: 'आपकी जन्म तिथि या आयु क्या है?', te: 'మీ పుట్టిన తేదీ లేదా వయస్సు ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including village, mandal, and district', hi: 'कृपया अपना पूरा आवासीय पता बताएं, जिसमें गांव, मंडल और जिला शामिल हो', te: 'దయచేసి గ్రామం, మండలం మరియు జిల్లాతో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'address_pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माँ का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'family_type', label: 'Family Type (Nuclear / Joint)', type: 'text',
    voiceLabel: { en: 'Is your family type Nuclear or Joint?', hi: 'आपका परिवार एकल है या संयुक्त?', te: 'మీ కుటుంబ రకం అణువా లేదా ఉమ్మడిదా?' }
  },
  {
    id: 'family_count', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many people are there in your family?', hi: 'आपके परिवार में कितने लोग हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'annual_income', label: 'Total Annual Family Income (₹)', type: 'number',
    voiceLabel: { en: 'Please say your total yearly family income', hi: 'कृपया अपने परिवार की कुल वार्षिक आय बताएं', te: 'దయచేసి మీ మొత్తం వార్షిక కుటుంబ ఆదాయాన్ని చెప్పండి' }
  },
  {
    id: 'income_breakdown', label: 'Income Sources (Agriculture/Salary/Business/Pension/Other)', type: 'text',
    voiceLabel: { en: 'What are your main sources of income? Please specify like agriculture, salary, business, or pension.', hi: 'आपके आय के मुख्य स्रोत क्या हैं? कृपया कृषि, वेतन, व्यवसाय या पेंशन जैसे बताएं।', te: 'మీ ప్రధాన ఆదాయ వనరులు ఏమిటి? వ్యవసాయం, జీతం, వ్యాపారం లేదా పెన్షన్ వంటివి పేర్కొనండి.' }
  },
  {
    id: 'applicant_occupation', label: "Applicant's Occupation", type: 'text',
    voiceLabel: { en: 'What is your occupation?', hi: 'आपका व्यवसाय क्या है?', te: 'మీ వృత్తి ఏమిటి?' }
  },
  {
    id: 'head_occupation', label: 'Head of Family Occupation', type: 'text',
    voiceLabel: { en: 'What is the occupation of the head of your family?', hi: 'आपके परिवार के मुखिया का व्यवसाय क्या है?', te: 'మీ కుటుంబ యజమాని వృత్తి ఏమిటి?' }
  },
  {
    id: 'purpose', label: 'Purpose of Certificate (Scholarship/Education/Job/etc.)', type: 'text',
    voiceLabel: { en: 'Why do you need this income certificate? For scholarship, education, or a job?', hi: 'आपको इस आय प्रमाण पत्र की आवश्यकता क्यों है? छात्रवृत्ति, शिक्षा या नौकरी के लिए?', te: 'మీకు ఈ ఆదాయ ధృవీకరణ పత్రం ఎందుకు అవసరం? స్కాలర్‌షిప్, విద్య లేదా ఉద్యోగం కోసమా?' }
  },
  {
    id: 'income_proof_doc', label: 'Upload Income Proof Document', type: 'file',
    requiresFile: true,
    description: 'Upload your latest Income certificate or salary details to process the application.',
    voiceLabel: {
      en: 'Please upload your latest Income certificate or salary details to process the application.',
      hi: 'कृपया आवेदन की प्रक्रिया के लिए अपना नवीनतम आय प्रमाण पत्र या वेतन विवरण अपलोड करें।',
      te: 'దయచేసి దరఖాస్తును ప్రాసెస్ చేయడానికి మీ తాజా ఆదాయ ధృవీకరణ పత్రం లేదా జీతం వివరాలను అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'family_id_doc', label: 'Upload Family ID/Aadhaar', type: 'file',
    requiresFile: true,
    description: 'Upload your Ration Card, Family ID card, or family head Aadhaar card for record verification.',
    voiceLabel: {
      en: 'Please upload your Ration Card, Family ID card, or family head Aadhaar card for record verification.',
      hi: 'रिकॉर्ड सत्यापन के लिए अपना राशन कार्ड, फैमिली आईडी कार्ड या परिवार के मुखिया का आधार कार्ड अपलोड करें।',
      te: 'రికార్డ్ వెరిఫికేషన్ కోసం మీ రేషన్ కార్డ్, ఫ్యామిలీ ఐడి కార్డ్ లేదా కుటుంబ యజమాని ఆధార్ కార్డ్‌ని అప్‌లోడ్ చేయండి.'
    }
  },
  {
    id: 'income_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to share about your family income?', hi: 'अपने परिवार की आय के बारे में कोई और विवरण जो आप साझा करना चाहते हैं?', te: 'మీ కుటుంబ ఆదాయం గురించి మీరు భాగస్వామ్యం చేయాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const PASSPORT_APPLICATION_FIELDS: ServiceField[] = [
  {
    id: 'passport_type', label: 'Service Type (Fresh / Re-issue)', type: 'text',
    voiceLabel: { en: 'Are you applying for a fresh passport or a re-issue?', hi: 'क्या आप नए पासपोर्ट के लिए आवेदन कर रहे हैं या फिर से जारी करने के लिए?', te: 'మీరు కొత్త పాస్‌పోర్ట్ కోసం దరఖాస్తు చేస్తున్నారా లేదా మళ్లీ జారీ చేయడానికా?' }
  },
  {
    id: 'given_name', label: 'Given Name (First + Middle)', type: 'text',
    voiceLabel: { en: 'What is your given name, including your first and middle name?', hi: 'आपका दिया गया नाम क्या है, जिसमें आपका पहला और मध्य नाम शामिल है?', te: 'మీ మొదటి మరియు మధ్య పేరుతో సహా మీ పేరు ఏమిటి?' }
  },
  {
    id: 'surname', label: 'Surname', type: 'text',
    voiceLabel: { en: 'What is your surname or family name?', hi: 'आपका उपनाम क्या है?', te: 'మీ ఇంటి పేరు ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'place_of_birth', label: 'Place of Birth (Village/City, District, State)', type: 'text',
    voiceLabel: { en: 'Tell me your place of birth, including village or city, district, and state', hi: 'अपना जन्म स्थान बताएं, जिसमें गांव या शहर, जिला और राज्य शामिल हो', te: 'గ్రామం లేదా నగరం, జిల్లా మరియు రాష్ట్రంతో సహా మీ పుట్టిన స్థలాన్ని చెప్పండి' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వివాహ స్థితి ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Full Name", type: 'text',
    voiceLabel: { en: "What is your father's full name?", hi: 'पिता का पूरा नाम क्या है?', te: 'తండ్రి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Full Name", type: 'text',
    voiceLabel: { en: "What is your mother's full name?", hi: 'मां का पूरा नाम क्या है?', te: 'తల్లి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'educational_qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your highest educational qualification?', hi: 'आपकी उच्चतम शैक्षिक योग्यता क्या है?', te: 'మీ అత్యున్నత విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'employment_type', label: 'Employment Type', type: 'text',
    voiceLabel: { en: 'What is your employment type? For example, student, government, or private.', hi: 'आपका रोजगार प्रकार क्या है? उदाहरण के लिए, छात्र, सरकारी, या निजी।', te: 'మీ ఉపాధి రకం ఏమిటి? ఉదాహరణకు, విద్యార్థి, ప్రభుత్వం లేదా ప్రైవేట్.' }
  },
  {
    id: 'present_address', label: 'Present Residential Address (Complete)', type: 'text',
    voiceLabel: { en: 'Please say your complete present residential address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा वर्तमान आवासीय पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి ప్రస్తుత నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'email_id', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact (Name & Mobile)', type: 'text',
    voiceLabel: { en: "Please say the name and mobile number of your emergency contact person", hi: 'कृपया अपने आपातकालीन संपर्क व्यक्ति का नाम और मोबाइल नंबर बताएं', te: 'దయచేసి మీ అత్యవసర సంప్రదింపు వ్యక్తి పేరు మరియు మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'references', label: 'Two References (Name & Address)', type: 'text',
    voiceLabel: { en: 'Please provide names and addresses of two references from your residential area', hi: 'कृपया अपने आवासीय क्षेत्र के दो संदर्भों के नाम और पते प्रदान करें', te: 'దయచేసి మీ నివాస ప్రాంతం నుండి ఇద్దరు వ్యక్తుల పేర్లు మరియు చిరునామాలను అందించండి' }
  },
  {
    id: 'criminal_records', label: 'Any Criminal Proceedings? (Yes / No)', type: 'text',
    voiceLabel: { en: 'Are there any criminal proceedings pending against you?', hi: 'क्या आपके खिलाफ कोई आपराधिक कार्यवाही लंबित है?', te: 'మీపై ఏవైనా క్రిమినల్ చర్యలు పెండింగ్‌లో ఉన్నాయా?' }
  },
  {
    id: 'birth_cert_file', label: 'Upload Birth Certificate', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your birth certificate', hi: 'कृपया अपना जन्म प्रमाण पत्र अपलोड करें', te: 'దయచేసి మీ జన్మ సర్టిఫికేట్ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'id_proof_file', label: 'Upload Identity Proof', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your ID proof like Aadhaar, PAN, or Voter ID', hi: 'कृपया अपना आईडी प्रमाण जैसे आधार, पैन, या वोटर आईडी अपलोड करें', te: 'దయచేసి ఆధార్, పిఎన్, లేదా ఓటర్ ఐడి వంటి మీ ఐడି ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'address_proof_file', label: 'Upload Address Proof', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your address proof like utility bill or bank statement', hi: 'कृपया अपने पते का प्रमाण जैसे उपयोगिता बिल या बैंक स्टेटमेंट अपलोड करें', te: 'దయచేసి యూటిలిటీ బిల్లు లేదా బ్యాంక్ స్టేట్‌మెంట్ వంటి చిరునామా ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'passport_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to provide for your passport application?', hi: 'पासपोर्ट आवेदन के लिए आप कोई और विवरण देना चाहते हैं?', te: 'మీ పాస్‌పోర్ట్ దరఖాస్తు కోసం మీరు అందించాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const DRIVING_LICENSE_FIELDS: ServiceField[] = [
  {
    id: 'license_type', label: 'License Type (Learner / Permanent)', type: 'text',
    voiceLabel: { en: 'Are you applying for a Learners license or a Permanent License?', hi: 'क्या आप लर्नर्स लाइसेंस के लिए आवेदन कर रहे हैं या स्थायी लाइसेंस के लिए?', te: 'మీరు లెర్నర్స్ లైసెన్స్ కోసం దరఖాస్తు చేస్తున్నారా లేదా పర్మనెంట్ లైసెన్స్ కోసమా?' }
  },
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_husband_name', label: 'Father / Husband Name', type: 'text',
    voiceLabel: { en: "What is your father's or husband's name?", hi: 'आपके पिता या पति का नाम क्या है?', te: 'మీ తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'blood_group', label: 'Blood Group', type: 'text',
    voiceLabel: { en: 'What is your blood group?', hi: 'आपका ब्लड ग्रुप क्या है?', te: 'మీ బ్లడ్ గ్రూప్ ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your educational qualification?', hi: 'आपकी शैक्षिक योग्यता क्या है?', te: 'మీ విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'address', label: 'Present Residential Address (Complete)', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा आवासीय पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'vehicle_class', label: 'Vehicle Class (MCWG/LMV/HMV)', type: 'text',
    voiceLabel: { en: 'Which vehicle class are you applying for? For example, motorcycle or light motor vehicle.', hi: 'आप किस वाहन वर्ग के लिए आवेदन कर रहे हैं? उदाहरण के लिए, मोटरसाइकिल या हल्के मोटर वाहन।', te: 'మీరు ఏ వాహన తరగతి కోసం దరఖాస్తు చేస్తున్నారు? ఉదాహరణకు, మోటార్ సైకిల్ లేదా తేలికపాటి మోటార్ వాహనం.' }
  },
  {
    id: 'id_marks', label: 'Identification Marks (Optional)', type: 'text',
    voiceLabel: { en: 'Do you have any visible identification marks?', hi: 'क्या आपके पास कोई दृश्य पहचान चिन्ह है?', te: 'మీకు ఏవైనా కనిపించే గుర్తింపు గుర్తులు ఉన్నాయా?' }
  },
  {
    id: 'organ_donation', label: 'Donate Organs in case of Accident? (Yes/No)', type: 'text',
    voiceLabel: { en: 'Would you like to donate your organs in case of an accidental death?', hi: 'क्या आप दुर्घटना में मृत्यु की स्थिति में अपने अंग दान करना चाहेंगे?', te: 'ప్రమాదవశాత్తూ మరణిస్తే మీరు మీ అవయవాలను దానం చేయాలనుకుంటున్నారా?' }
  },
  {
    id: 'poi_doc', label: 'Proof of Identity (POI)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Identity? Aadhaar card, PAN, or License?', hi: 'पहचान के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार कार्ड, पैन, या लाइसेंस?', te: 'గుర్తింపు కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్ కార్డ్, పాన్ లేదా లైసెన్స్?' }
  },
  {
    id: 'poi_file', label: 'Upload Proof of Identity', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your identity proof like Aadhaar, PAN, or Passport', hi: 'कृपया अपने पहचान का प्रमाण जैसे आधार, पैन, या पासपोर्ट अपलोड करें', te: 'దయచేసి ఆధార్, పాన్, లేదా పాస్‌పోర్ట్ వంటి మీ గుర్తింపు ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'poa_doc', label: 'Proof of Address (POA)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Address? Aadhaar, Utility Bill, or Bank Passbook?', hi: 'पते के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, यूटिलिटी बिल, या बैंक पासबुक?', te: 'చిరునామా కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, యూటిలిటీ బిల్లు లేదా బ్యాంక్ పాస్‌బుక్?' }
  },
  {
    id: 'poa_file', label: 'Upload Proof of Address', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your address proof like utility bill, bank passbook, or Aadhaar', hi: 'कृपया अपने पते का प्रमाण जैसे यूटिलिटी बिल, बैंक पासबुक, या आधार अपलोड करें', te: 'దయచేసి యూటిలిటీ బిల్లు, బ్యాంక్ పాస్‌బుక్, లేదా ఆధార్ వంటి చిరునామా ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'dob_doc', label: 'Proof of Date of Birth (DOB)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Date of Birth? Aadhaar, Birth Certificate, or Passport?', hi: 'जन्म तिथि के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, जन्म प्रमाण पत्र, या पासपोर्ट?', te: 'పుట్టిన తేదీ కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, జన్మ సర్టిఫికేట్, లేదా పాస్‌పోర్ట్?' }
  },
  {
    id: 'dob_file', label: 'Upload Proof of Date of Birth', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your date of birth proof like birth certificate, Aadhaar, or passport', hi: 'कृपया अपने जन्म तिथि का प्रमाण जैसे जन्म प्रमाण पत्र, आधार, या पासपोर्ट अपलोड करें', te: 'దయచేసి జన్మ సర్టిఫికేట్, ఆధార్, లేదా పాస్‌పోర్ట్ వంటి జన్మ తేదీ ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'dl_desc', label: 'Additional Information / Experience', type: 'textarea',
    voiceLabel: { en: 'Any additional details or driving experience you want to mention?', hi: 'कोई और विवरण या ड्राइविंग अनुभव जो आप साझा करना चाहते हैं?', te: 'మీరు పేర్కొనాలనుకుంటున్న అదనపు వివరాలు లేదా డ్రైవింగ్ అనుభవం ఏవైనా ఉన్నాయా?' }
  }
];

const VEHICLE_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'owner_name', label: "Owner's Full Name", type: 'text',
    voiceLabel: { en: "What is the owner's full name as per Aadhaar?", hi: 'आधार के अनुसार मालिक का पूरा नाम क्या है?', te: 'ఆధార్ ప్రకారం యజమాని పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'father_husband_name', label: 'Father / Husband Name', type: 'text',
    voiceLabel: { en: "What is the father's or husband's name of the owner?", hi: 'मालिक के पिता या पति का नाम क्या है?', te: 'యజమాని తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'owner_address', label: 'Permanent Address (Complete)', type: 'text',
    voiceLabel: { en: 'Please say the complete permanent address including PIN code', hi: 'कृपया पिन कोड सहित पूरा स्थायी पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా పూర్తి శాశ్వత చిరునామాను చెప్పండి' }
  },
  {
    id: 'vehicle_class', label: 'Vehicle Class (e.g., LMV, MCWG)', type: 'text',
    voiceLabel: { en: 'What is the vehicle class? For example, light motor vehicle or motorcycle.', hi: 'वाहन वर्ग क्या है? उदाहरण के लिए, हल्का मोटर वाहन या मोटरसाइकिल।', te: 'వాహన తరగతి ఏమిటి? ఉదాహరణకు, తేలికపాటి మోటార్ వాహనం లేదా మోటార్ సైకిల్.' }
  },
  {
    id: 'chassis_no', label: 'Chassis Number', type: 'text',
    voiceLabel: { en: 'What is the chassis number of the vehicle?', hi: 'वाहन का चेसिस नंबर क्या है?', te: 'వాహనం యొక్క చట్రం సంఖ్య ఏమిటి?' }
  },
  {
    id: 'engine_no', label: 'Engine Number', type: 'text',
    voiceLabel: { en: 'What is the engine number of the vehicle?', hi: 'वाहन का इंजन नंबर क्या है?', te: 'వాహనం యొక్క ఇంజిన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'vehicle_type', label: 'Vehicle Type (New / Re-registration)', type: 'text',
    voiceLabel: { en: 'Is this a new vehicle registration or re-registration?', hi: 'क्या यह नया वाहन पंजीकरण है या पुन: पंजीकरण?', te: 'ఇది కొత్త వాహన రిజిస్ట్రేషనా లేదా రీ-రిజిస్ట్రేషనా?' }
  },
  {
    id: 'fuel_type', label: 'Fuel Type (Petrol/Diesel/EV)', type: 'text',
    voiceLabel: { en: 'What is the fuel type? Petrol, Diesel, or Electric?', hi: 'ईंधन का प्रकार क्या है? पेट्रोल, डीजल, या इलेक्ट्रिक?', te: 'ఇంధన రకం ఏమిటి? పెట్రోల్, డీజిల్ లేదా ఎలక్ట్రిక్?' }
  },
  {
    id: 'maker_name', label: 'Manufacturer / Maker Name', type: 'text',
    voiceLabel: { en: 'Who is the manufacturer of the vehicle?', hi: 'वाहन का निर्माता कौन है?', te: 'వాహన తయారీదారు ఎవరు?' }
  },
  {
    id: 'model_name', label: 'Model Name / Number', type: 'text',
    voiceLabel: { en: 'What is the model name or number?', hi: 'मॉडल का नाम या नंबर क्या है?', te: 'మోడల్ పేరు లేదా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'color', label: 'Color of Vehicle', type: 'text',
    voiceLabel: { en: 'What is the color of the vehicle?', hi: 'वाहन का रंग क्या है?', te: 'వాహనం రంగు ఏమిటి?' }
  },
  {
    id: 'seating_capacity', label: 'Seating Capacity', type: 'number',
    voiceLabel: { en: 'What is the seating capacity?', hi: 'बैठने की क्षमता क्या है?', te: 'సీటింగ్ సామర్థ్యం ఎంత?' }
  },
  {
    id: 'insurance_details', label: 'Insurance Policy Number', type: 'text',
    voiceLabel: { en: 'Please tell me your insurance policy number', hi: 'कृपया अपना बीमा पॉलिसी नंबर बताएं', te: 'దయచేసి మీ ఇన్సూరెన్స్ పాలసీ నంబర్ చెప్పండి' }
  },
  {
    id: 'poi_doc', label: 'Proof of Identity (POI)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Identity? Aadhaar, PAN, or Driving License?', hi: 'पहचान के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, पैन, या ड्राइविंग लाइसेंस?', te: 'గుర్తింపు కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, పాన్ లేదా డ్రైవింగ్ లైసెన్స్?' }
  },
  {
    id: 'poi_file', label: 'Upload Proof of Identity', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your identity proof like Aadhaar, PAN, or Driving License', hi: 'कृपया अपने पहचान का प्रमाण जैसे आधार, पैन, या ड्राइविंग लाइसेंस अपलोड करें', te: 'దయచేసి ఆధార్, పాన్ లేదా డ్రైవింగ్ లైసెన్స్ వంటి మీ గుర్తింపు ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'poa_doc', label: 'Proof of Address (POA)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Address? Aadhaar, Utility Bill, or Bank Passbook?', hi: 'पते के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, यूटिलिटी बिल, या बैंक पासबुक?', te: 'చిరునామా కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, యూటిలిటీ బిల్లు లేదా బ్యాంక్ పాస్‌బుక్?' }
  },
  {
    id: 'poa_file', label: 'Upload Proof of Address', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your address proof like utility bill, bank passbook, or Aadhaar', hi: 'कृपया अपने पते का प्रमाण जैसे यूटिलिटी बिल, बैंक पासबुक, या आधार अपलोड करें', te: 'దయచేసి యూటిలిటీ బిల్లు, బ్యాంక్ పాస్‌బుక్, లేదా ఆధార్ వంటి చిరునామా ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'rc_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to provide for vehicle registration?', hi: 'वाहन पंजीकरण के लिए आप कोई और विवरण देना चाहते हैं?', te: 'వాహన రిజిస్ట్రేషన్ కోసం మీరు అందించాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const HSRP_FIELDS: ServiceField[] = [
  {
    id: 'vehicle_reg_no', label: 'Vehicle Registration Number', type: 'text',
    voiceLabel: { en: 'Please tell me your vehicle registration number, for example, DL 1C A 1234', hi: 'कृपया अपने वाहन का पंजीकरण नंबर बताएं, जैसे कि DL 1C A 1234', te: 'దయచేసి మీ వాహన రిజిస్ట్రేషన్ నంబర్ చెప్పండి, ఉదాహరణకు DL 1C A 1234' }
  },
  {
    id: 'chassis_no', label: 'Full Chassis Number', type: 'text',
    voiceLabel: { en: 'What is the full chassis number of your vehicle?', hi: 'आपके वाहन का पूरा चेसिस नंबर क्या है?', te: 'మీ వాహనం యొక్క పూర్తి చట్రం సంఖ్య ఏమిటి?' }
  },
  {
    id: 'engine_no', label: 'Full Engine Number', type: 'text',
    voiceLabel: { en: 'What is the full engine number of your vehicle?', hi: 'आपके वाहन का पूरा इंजन नंबर क्या है?', te: 'మీ వాహనం యొక్క పూర్తి ఇంజిన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'owner_name', label: "Owner's Name", type: 'text',
    voiceLabel: { en: "What is the owner's name as per the RC?", hi: 'आरसी के अनुसार मालिक का नाम क्या है?', te: 'RC ప్రకారం యజమాని పేరు ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'email_id', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'vehicle_category', label: 'Vehicle Category (2-Wheeler/4-Wheeler/etc.)', type: 'text',
    voiceLabel: { en: 'Is it a 2-wheeler, 3-wheeler, or 4-wheeler?', hi: 'क्या यह 2-पहिया, 3-पहिया, या 4-पहिया है?', te: 'ఇది 2-వీలర్, 3-వీలర్ లేదా 4-వీలర్?' }
  },
  {
    id: 'fuel_type', label: 'Fuel Type (Petrol/Diesel/CNG/EV)', type: 'text',
    voiceLabel: { en: 'What is the fuel type of your vehicle?', hi: 'आपके वाहन का ईंधन प्रकार क्या है?', te: 'మీ వాహనం యొక్క ఇంధన రకం ఏమిటి?' }
  },
  {
    id: 'fitment_type', label: 'Fitment Type (Home Delivery / Dealer Fitment)', type: 'text',
    voiceLabel: { en: 'Would you like home delivery or fitment at a dealer?', hi: 'क्या आप होम डिलीवरी चाहते हैं या डीलर के पास फिटमेंट?', te: 'మీరు హోమ్ డెలివరీని కోరుకుంటున్నారా లేదా డీలర్ వద్ద ఫిట్‌మెంట్‌ను కోరుకుంటున్నారా?' }
  },
  {
    id: 'delivery_address', label: 'Delivery/Dealer Address', type: 'text',
    voiceLabel: { en: 'Please specify the delivery address or preferred dealer location', hi: 'कृपया डिलीवरी पता या पसंदीदा डीलर स्थान बताएं', te: 'దయచేసి డెలివరీ చిరునామా లేదా ప్రాధాన్య డీలర్ స్థానాన్ని పేర్కొనండి' }
  },
  {
    id: 'hsrp_desc', label: 'Additional Notes', type: 'textarea',
    voiceLabel: { en: 'Any additional notes for the HSRP installation?', hi: 'HSRP इंस्टॉलेशन के लिए कोई और टिप्पणी?', te: 'HSRP ఇన్‌స్టాలేషన్ కోసం అదనపు గమనికలు ఏవైనా ఉన్నాయా?' }
  }
];

const RAILWAY_SENIOR_CITIZEN_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per your ID proof', hi: 'कृपया अपना पूरा नाम बताएं जैसा कि आपके आईडी प्रमाण में है', te: 'దయచేసి మీ ఐడి ప్రూఫ్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob_age', label: 'Date of Birth / Age', type: 'text',
    voiceLabel: { en: 'What is your date of birth or current age?', hi: 'आपकी जन्म तिथि या वर्तमान आयु क्या है?', te: 'మీ పుట్టిన తేదీ లేదా ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number for verification?', hi: 'सत्यापन के लिए आपका आधार नंबर क्या है?', te: 'ధృవీకరణ కోసం మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'residential_address', label: 'Residential Address (Complete)', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा आवासीय पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'class_preference', label: 'Preferted Class of Travel (Sleeper/AC)', type: 'text',
    voiceLabel: { en: 'What is your preferred class of travel? Sleeper or AC?', hi: 'आपकी यात्रा की पसंदीदा श्रेणी क्या है? स्लीपर या एसी?', te: 'మీరు ఏ తరగతిలో ప్రయాణించడానికి ఇష్టపడతారు? స్లీపర్ లేదా ఏసీ?' }
  },
  {
    id: 'proof_of_age', label: 'Proof of Age (Aadhaar/Voter ID/etc.)', type: 'text',
    voiceLabel: { en: 'Which document are you using as proof of age? Aadhaar, Voter ID, or something else?', hi: 'आप आयु के प्रमाण के रूप में किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, वोटर आईडी, या कुछ और?', te: 'వయస్సు నిరూపణ కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, ఓటర్ ఐడి లేదా మరేదైనా?' }
  },
  {
    id: 'railway_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to provide for your concession card?', hi: 'अपने रियायती कार्ड के लिए आप कोई और विवरण देना चाहते हैं?', te: 'మీ కన్సెషన్ కార్డ్ కోసం మీరు అందించాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const BANK_KYC_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name (as per Bank Records)', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as it appears in your bank records', hi: 'कृपया अपना पूरा नाम बताएं जैसा कि आपके बैंक रिकॉर्ड में है', te: 'దయచేసి మీ బ్యాంక్ రికార్డులలో ఉన్నట్లుగా మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'branch_name', label: 'Branch Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank branch?', hi: 'आपकी बैंक शाखा का नाम क्या है?', te: 'మీ బ్యాంక్ శాఖ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your branch?', hi: 'आपकी शाखा का IFSC कोड क्या है?', te: 'మీ శాఖ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'residential_address', label: 'Current Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete current residential address', hi: 'कृपया अपना पूरा वर्तमान आवासीय पता बताएं', te: 'దయచేసి మీ పూర్తి ప్రస్తుత నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email_id', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'poi_doc', label: 'Proof of Identity (POI)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Identity? Aadhaar card, PAN, or Voter ID?', hi: 'पहचान के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार कार्ड, पैन, या वोटर आईडी?', te: 'గుర్తింపు కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్ కార్డ్, పాన్ లేదా ఓటర్ ఐడి?' }
  },
  {
    id: 'poi_file', label: 'Upload Proof of Identity', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your identity proof document like Aadhaar, PAN, or Voter ID', hi: 'कृपया अपने पहचान के प्रमाण दस्तावेज़ जैसे आधार, पैन, या वोटर आईडी अपलोड करें', te: 'దయచేసి ఆధార్, పాన్ లేదా ఓటర్ ఐడి వంటి మీ గుర్తింపు ధృవీకరణ పత్రాన్ని అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'poa_doc', label: 'Proof of Address (POA)', type: 'text',
    voiceLabel: { en: 'Which document are you using for Address Proof? Aadhaar, Utility Bill, or Bank Statement?', hi: 'पते के प्रमाण के लिए आप किस दस्तावेज़ का उपयोग कर रहे हैं? आधार, यूटिलिटी बिल, या बैंक स्टेटमेंट?', te: 'చిరునామా ధృవీకరణ కోసం మీరు ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు? ఆధార్, యూటిలిటీ బిల్లు లేదా బ్యాంక్ స్టేట్‌మెంట్?' }
  },
  {
    id: 'poa_file', label: 'Upload Proof of Address', type: 'file',
    requiresFile: true,
    voiceLabel: { en: 'Please upload your address proof like utility bill, bank statement, or Aadhaar', hi: 'कृपया अपने पते का प्रमाण जैसे यूटिलिटी बिल, बैंक स्टेटमेंट, या आधार अपलोड करें', te: 'దయచేసి యూటిలిటీ బిల్లు, బ్యాంక్ స్టేట్‌మెంట్, లేదా ఆధార్ వంటి చిరునామా ధృవీకరణ అప్‌లోడ్ చేయండి' }
  },
  {
    id: 'kyc_desc', label: 'Reason for Update / Notes', type: 'textarea',
    voiceLabel: { en: 'Any additional notes or reason for this KYC update?', hi: 'इस केवाईसी अपडेट के लिए कोई और टिप्पणी या कारण?', te: 'ఈ KYC అప్‌డేట్ కోసం అదనపు గమనికలు లేదా కారణం ఏదైనా ఉందా?' }
  }
];

const EPF_WITHDRAWAL_FIELDS: ServiceField[] = [
  {
    id: 'uan', label: 'UAN (Universal Account Number)', type: 'text',
    voiceLabel: { en: 'Please tell me your 12-digit UAN number', hi: 'कृपया अपना 12 अंकों का यूएएन नंबर बताएं', te: 'దయచేసి మీ 12 అంకెల UAN సంఖ్యను చెప్పండి' }
  },
  {
    id: 'full_name', label: 'Full Name (as per EPF records)', type: 'text',
    voiceLabel: { en: 'What is your full name as per your EPF records?', hi: 'ईपीएफ रिकॉर्ड के अनुसार आपका पूरा नाम क्या है?', te: 'మీ EPF రికార్డుల ప్రకారం మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'In which bank account should the money be credited?', hi: 'किस बैंक खाते में पैसा जमा किया जाना चाहिए?', te: 'ఏ బ్యాంక్ ఖాతాలో డబ్బు జమ చేయాలి?' }
  },
  {
    id: 'ifsc_code', label: 'IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'withdrawal_purpose', label: 'Purpose of Withdrawal (Medical/House/Marriage/etc.)', type: 'text',
    voiceLabel: { en: 'What is the purpose of this withdrawal? For example, medical, house construction, or marriage.', hi: 'इस निकासी का उद्देश्य क्या है? उदाहरण के लिए, चिकित्सा, घर का निर्माण, या विवाह।', te: 'ఈ విత్‌డ్రావల్ ఉద్దేశ్యం ఏమిటి? ఉదాహరణకు, వైద్య చికిత్స, ఇల్లు కట్టడం లేదా పెళ్లి.' }
  },
  {
    id: 'withdrawal_amount', label: 'Withdrawal Amount (₹)', type: 'number',
    voiceLabel: { en: 'How much amount would you like to withdraw?', hi: 'आप कितनी राशि निकालना चाहते हैं?', te: 'మీరు ఎంత మొత్తం విత్‌డ్రా చేయాలనుకుంటున్నారు?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'epf_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any other details you want to add to your withdrawal request?', hi: 'अपनी निकासी अनुरोध में कोई और विवरण जोड़ना चाहते हैं?', te: 'మీ విత్‌డ్రావల్ రిక్వెస్ట్‌లో మరేదైనా వివరాలు చేర్చాలనుకుంటున్నారా?' }
  }
];

const ITR_FILING_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name (as per PAN)', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per your PAN card', hi: 'कृपया अपने पैन कार्ड के अनुसार अपना पूरा नाम बताएं', te: 'దయచేసి మీ పాన్ కార్డ్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'aadhar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'assessment_year', label: 'Assessment Year (e.g., 2024-25)', type: 'text',
    voiceLabel: { en: 'Which assessment year are you filing for? For example, 2024-25', hi: 'आप किस निर्धारण वर्ष के लिए फाइल कर रहे हैं? उदाहरण के लिए, 2024-25', te: 'మీరు ఏ అసెస్‌మెంట్ ఇయర్ కోసం ఫైల్ చేస్తున్నారు? ఉదాహరణకు, 2024-25' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा आवासीय पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'salary_income', label: 'Income from Salary/Pension (₹)', type: 'number',
    voiceLabel: { en: 'What is your total income from salary or pension for the year?', hi: 'वर्ष के लिए वेतन या पेंशन से आपकी कुल आय क्या है?', te: 'సంవత్సరానికి జీతం లేదా పెన్షన్ ద్వారా మీ మొత్తం ఆదాయం ఎంత?' }
  },
  {
    id: 'house_property_income', label: 'Income from House Property (₹)', type: 'number',
    voiceLabel: { en: 'Any rental income or income from house property?', hi: 'क्या कोई किराये की आय या घर की संपत्ति से आय है?', te: 'ఏదైనా అద్దె ఆదాయం లేదా ఇంటి ఆస్తి నుండి ఆదాయం ఉందా?' }
  },
  {
    id: 'other_income', label: 'Income from Other Sources (Interest, etc.) (₹)', type: 'number',
    voiceLabel: { en: 'What is your income from other sources like bank interest?', hi: 'बैंक ब्याज जैसे अन्य स्रोतों से आपकी आय क्या है?', te: 'బ్యాంక్ వడ్డీ వంటి ఇతర వనరుల నుండి మీ ఆదాయం ఎంత?' }
  },
  {
    id: 'deductions_80c', label: 'Deductions under Section 80C (₹)', type: 'number',
    voiceLabel: { en: 'How much are your total savings or investments under Section 80C?', hi: 'धारा 80C के तहत आपकी कुल बचत या निवेश कितना है?', te: 'సెక్షన్ 80C కింద మీ మొత్తం పొదుపులు లేదా పెట్టుబడులు ఎంత?' }
  },
  {
    id: 'deductions_80d', label: 'Deductions under Section 80D (Medical) (₹)', type: 'number',
    voiceLabel: { en: 'Any medical insurance premiums paid under Section 80D?', hi: 'क्या धारा 80D के तहत कोई मेडिकल इंश्योरेंस प्रीमियम भुगतान किया गया है?', te: 'సెక్షన్ 80D కింద ఏదైనా మెడికల్ ఇన్సూరెన్స్ ప్రీమియంలు చెల్లించారా?' }
  },
  {
    id: 'tds_details', label: 'TDS (Tax Deducted at Source) Details (₹)', type: 'number',
    voiceLabel: { en: 'Was any tax deducted at source or TDS by your employer or bank?', hi: 'क्या आपके नियोक्ता या बैंक द्वारा स्रोत पर कर या टीडीएस काटा गया था?', te: 'మీ యజమాని లేదా బ్యాంక్ ద్వారా ఏదైనా టాక్స్ డిడక్టెడ్ ఎట్ సోర్స్ లేదా TDS కట్ చేయబడిందా?' }
  },
  {
    id: 'bank_account', label: 'Bank Account for Refund', type: 'text',
    voiceLabel: { en: 'Provide the bank account number for the tax refund', hi: 'टैक्स रिफंड के लिए बैंक खाता संख्या प्रदान करें', te: 'టాక్స్ రిఫండ్ కోసం బ్యాంక్ ఖాతా సంఖ్యను అందించండి' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of that bank account?', hi: 'उस बैंक खाते का IFSC कोड क्या है?', te: 'ఆ బ్యాంక్ ఖాతా యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Registered Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email_id', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'itr_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details regarding your ITR filing?', hi: 'आपके आईटीआर फाइलिंग के संबंध में कोई और विवरण?', te: 'మీ ఐటిఆర్ ఫైలింగ్ గురించి ఏవైనా అదనపు వివరాలు ఉన్నాయా?' }
  }
];

const GST_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'business_name', label: 'Legal Name of Business (as per PAN)', type: 'text',
    voiceLabel: { en: 'What is the legal name of your business as per the PAN card?', hi: 'आपके व्यवसाय का कानूनी नाम क्या है?', te: 'మీ వ్యాపార చట్టపరమైన పేరు ఏమిటి?' }
  },
  {
    id: 'trade_name', label: 'Trade Name (if different)', type: 'text',
    voiceLabel: { en: 'What is the trade name or brand name of your business?', hi: 'आपके व्यवसाय का व्यापारिक नाम या ब्रांड नाम क्या है?', te: 'మీ వ్యాపార వాణిజ్య పేరు ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'Business PAN Number', type: 'text',
    voiceLabel: { en: 'What is your business PAN number?', hi: 'आपके व्यवसाय का पैन नंबर क्या है?', te: 'మీ వ్యాపార పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'constitution', label: 'Constitution of Business (e.g., Proprietorship, Partnership)', type: 'text',
    voiceLabel: { en: 'What is the constitution of your business? For example, proprietorship or partnership.', hi: 'आपके व्यवसाय का गठन कैसा है? जैसे कि मालिकाना या साझेदारी।', te: 'మీ వ్యాపార రాజ్యాంగం ఏమిటి? ఉదాహరణకు, ప్రొప్రైటర్‌షిప్ లేదా పార్టనర్‌షిప్.' }
  },
  {
    id: 'commencement_date', label: 'Date of Commencement of Business', type: 'text',
    voiceLabel: { en: 'When did your business start?', hi: 'आपका व्यवसाय कब शुरू हुआ?', te: 'మీ వ్యాపారం ఎప్పుడు ప్రారంభమైంది?' }
  },
  {
    id: 'business_address', label: 'Principal Place of Business (Full Address)', type: 'text',
    voiceLabel: { en: 'What is the full address of your principal place of business?', hi: 'आपके व्यवसाय के मुख्य स्थान का पूरा पता क्या है?', te: 'మీ ప్రధాన వ్యాపార స్థలం పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'business_state', label: 'State where Business is Located', type: 'text',
    voiceLabel: { en: 'In which state is your business located?', hi: 'आपका व्यवसाय किस राज्य में स्थित है?', te: 'మీ వ్యాపారం ఏ రాష్ట్రంలో ఉంది?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is the PIN code of your business location?', hi: 'आपके व्यवसाय स्थान का पिन कोड क्या है?', te: 'మీ వ్యాపార స్థలం పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'reason_registration', label: 'Reason for Registration (e.g., Threshold Cross, Voluntary)', type: 'text',
    voiceLabel: { en: 'What is the reason for registration? Voluntary or crossing the threshold?', hi: 'पंजीकरण का कारण क्या है? स्वैच्छिक या सीमा को पार करना?', te: 'రిజిస్ట్రేషన్ కు కారణం ఏమిటి? స్వచ్ఛందంగానా లేదా థ్రెషోల్డ్ దాటడమా?' }
  },
  {
    id: 'signatory_name', label: 'Authorized Signatory Name', type: 'text',
    voiceLabel: { en: 'What is the name of the authorized signatory?', hi: 'अधिकृत हस्ताक्षरकर्ता का नाम क्या है?', te: 'అధీకృత సంతకం చేసిన వ్యక్తి పేరు ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Registered Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number for GST?', hi: 'जीएसटी के लिए आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'GST కోసం మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email_id', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your business email address?', hi: 'आपके व्यवसाय का ईमेल पता क्या है?', te: 'మీ వ్యాపార ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'gst_desc', label: 'Additional Business Details', type: 'textarea',
    voiceLabel: { en: 'Any additional details regarding your GST registration?', hi: 'आपके जीएसटी पंजीकरण के संबंध में कोई और विवरण?', te: 'మీ GST రిజిస్ట్రేషన్ గురించి ఏవైనా అదనపు వివరాలు ఉన్నాయా?' }
  }
];

const MUDRA_LOAN_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Applicant Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per Aadhaar', hi: 'कृपया अपना पूरा नाम आधार के अनुसार बताएं', te: 'దయచేసి ఆధార్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'business_name', label: 'Name of Business / Enterprise', type: 'text',
    voiceLabel: { en: 'What is the name of your business or enterprise?', hi: 'आपके व्यवसाय या उद्यम का नाम क्या है?', te: 'మీ వ్యాపారం లేదా సంస్థ పేరు ఏమిటి?' }
  },
  {
    id: 'loan_category', label: 'Loan Category (Shishu / Kishore / Tarun)', type: 'text',
    voiceLabel: { en: 'Which category are you applying for? Shishu, Kishore, or Tarun?', hi: 'आप किस श्रेणी के लिए आवेदन कर रहे हैं? शिशु, किशोर, या तरुण?', te: 'మీరు ఏ వర్గం కోసం దరఖాస్తు చేస్తున్నారు? శిశు, కిషోర్ లేదా తరుణ్?' }
  },
  {
    id: 'loan_amount', label: 'Requested Loan Amount (₹)', type: 'number',
    voiceLabel: { en: 'How much loan amount do you require?', hi: 'आपको कितनी ऋण राशि की आवश्यकता है?', te: 'మీకు ఎంత రుణ మొత్తం కావాలి?' }
  },
  {
    id: 'loan_purpose', label: 'Purpose of Loan (Working Capital / Assets)', type: 'text',
    voiceLabel: { en: 'What is the purpose of this loan? Working capital or buying assets?', hi: 'इस ऋण का उद्देश्य क्या है? कार्यशील पूंजी या संपत्ति खरीदना?', te: 'ఈ రుణం యొక్క ఉద్దేశ్యం ఏమిటి? వర్కింగ్ క్యాపిటల్ లేదా ఆస్తులు కొనడమా?' }
  },
  {
    id: 'business_address', label: 'Business Address (Complete)', type: 'text',
    voiceLabel: { en: 'What is the complete address of your business?', hi: 'आपके व्यवसाय का पूरा पता क्या है?', te: 'మీ వ్యాపారం యొక్క పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'Income Tax PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Card Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Registered Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'existing_loan', label: 'Details of Existing Loans (if any)', type: 'text',
    voiceLabel: { en: 'Do you have any existing loans from other banks?', hi: 'क्या आपके पास अन्य बैंकों से कोई मौजूदा ऋण है?', te: 'మీకు ఇతర బ్యాంకుల నుండి ఏవైనా రుణాలు ఉన్నాయా?' }
  },
  {
    id: 'loan_desc', label: 'Additional Business Details / Experience', type: 'textarea',
    voiceLabel: { en: 'Any other details about your business experience you want to share?', hi: 'अपने व्यावसायिक अनुभव के बारे में कोई और विवरण जो आप साझा करना चाहते हैं?', te: 'మీ వ్యాపార అనుభవం గురించి మీరు భాగస్వామ్యం చేయాలనుకుంటున్న ఇతర వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const OLD_AGE_PENSION_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per Aadhaar', hi: 'कृपया अपना पूरा नाम आधार के अनुसार बताएं', te: 'దయచేసి ఆధార్ ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including village, mandal, and district', hi: 'कृपया अपना पूरा आवासीय पता बताएं, जिसमें गांव, मंडल और जिला शामिल हो', te: 'దయచేసి గ్రామం, మండలం మరియు జిల్లాతో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number (for Pension)', type: 'text',
    voiceLabel: { en: 'In which bank account should the pension be credited?', hi: 'पेंशन किस बैंक खाते में जमा की जानी चाहिए?', te: 'పెన్షన్ ఏ బ్యాంక్ ఖాతాలో జమ చేయాలి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'income_limit_cert', label: 'Income Certificate Number', type: 'text',
    voiceLabel: { en: 'Please provide your income certificate number', hi: 'कृपया अपना आय प्रमाण पत्र नंबर प्रदान करें', te: 'దయచేసి మీ ఆదాయ ధృవీకరణ పత్రం సంఖ్యను అందించండి' }
  },
  {
    id: 'pension_desc', label: 'Additional Details', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to provide?', hi: 'कोई और विवरण जो आप साझा करना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు వివరాలు ఏవైనా ఉన్నాయా?' }
  }
];

const WIDOW_PENSION_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Applicant Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per Aadhaar', hi: 'कृपया अपना पूरा नाम आधार के अनुसार बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'age_dob', label: 'Age / Date of Birth', type: 'text',
    voiceLabel: { en: 'What is your age or date of birth?', hi: 'आपकी आयु या जन्म तिथि क्या है?', te: 'మీ వయస్సు లేదా పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'husband_name', label: "Late Husband's Name", type: 'text',
    voiceLabel: { en: "What was your late husband's name?", hi: 'आपके दिवंगत पति का नाम क्या था?', te: 'మీ దివంగత భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'death_cert_no', label: 'Death Certificate Number', type: 'text',
    voiceLabel: { en: "What is the number on your husband's death certificate?", hi: 'पति के मृत्यु प्रमाण पत्र का नंबर क्या है?', te: 'మీ భర్త మరణ ధృవీకరణ పత్రం సంఖ్య ఎంత?' }
  },
  {
    id: 'death_date', label: 'Date of Death', type: 'text',
    voiceLabel: { en: 'What was the date of death?', hi: 'मृत्यु की तिथि क्या थी?', te: 'మరణించిన తేదీ ఏమిటి?' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including PIN code', hi: 'कृपया पिन कोड सहित अपना पूरा आवासीय पता बताएं', te: 'దయచేసి పిన్ కోడ్‌తో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number (for Pension)', type: 'text',
    voiceLabel: { en: 'In which bank account should the pension be credited?', hi: 'पेंशन किस बैंक खाते में जमा की जानी चाहिए?', te: 'పెన్షన్ ఏ బ్యాంక్ ఖాతాలో జమ చేయాలి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'income_cert_no', label: 'Income Certificate Number', type: 'text',
    voiceLabel: { en: 'Please provide your income certificate number', hi: 'कृपया अपना आय प्रमाण पत्र नंबर प्रदान करें', te: 'దయచేసి మీ ఆదాయ ధృవీకరణ పత్రం సంఖ్యను అందించండి' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'अपना मोबाइल नंबर बताएं', te: 'మీ మొబైల్ సంఖ్య చెప్పండి' }
  },
  {
    id: 'widow_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details you want to add?', hi: 'कोई और विवरण जो आप जोड़ना चाहते हैं?', te: 'మీరు జోడించాలనుకుంటున్న ఏవైనా అదనపు వివరాలు ఉన్నాయా?' }
  }
];

const KISAN_SAMMAN_NIDHI_FIELDS: ServiceField[] = [
  {
    id: 'farmer_name', label: "Farmer's Name (as per Aadhaar)", type: 'text',
    voiceLabel: { en: "What is the farmer's name as per Aadhaar?", hi: 'आधार के अनुसार किसान का नाम क्या है?', te: 'ఆధార్ ప్రకారం రైతు పేరు ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'category', label: 'Category (General/SC/ST/OBC)', type: 'text',
    voiceLabel: { en: 'What is your category? General, SC, ST, or OBC?', hi: 'आपकी श्रेणी क्या है? सामान्य, एससी, एसटी, या ओबीसी?', te: 'మీ వర్గం ఏమిటి? జనరల్, SC, ST లేదా OBC?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'residential_address', label: 'Village/Address', type: 'text',
    voiceLabel: { en: 'What is your village and complete address?', hi: 'आपका गांव और पूरा पता क्या है?', te: 'మీ గ్రామం మరియు పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'survey_no', label: 'Land Survey Number / Khasra Number', type: 'text',
    voiceLabel: { en: 'What is your land survey or khasra number?', hi: 'आपकी भूमि का सर्वे या खसरा नंबर क्या है?', te: 'మీ భూమి సర్వే లేదా ఖస్రా సంఖ్య ఎంత?' }
  },
  {
    id: 'khata_no', label: 'Khata Number / Khewat Number', type: 'text',
    voiceLabel: { en: 'What is your khata or khewat number?', hi: 'आपका खाता या खेवट नंबर क्या है?', te: 'మీ ఖాతా లేదా ఖేవాట్ సంఖ్య ఎంత?' }
  },
  {
    id: 'land_area', label: 'Total Land Area (in Acres/Hectares)', type: 'text',
    voiceLabel: { en: 'What is the total area of your land?', hi: 'आपकी भूमि का कुल क्षेत्रफल कितना है?', te: 'మీ భూమి మొత్తం వైశాల్యం ఎంత?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'In which bank account should the benefit be credited?', hi: 'लाभ किस बैंक खाते में जमा किया जाना चाहिए?', te: 'ప్రయోజనం ఏ బ్యాంక్ ఖాతాలో జమ చేయాలి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'kisan_desc', label: 'Additional Land Details', type: 'textarea',
    voiceLabel: { en: 'Any additional details about your land or farming?', hi: 'आपकी भूमि या खेती के बारे में कोई और विवरण?', te: 'మీ భూమి లేదా వ్యవసాయం గురించి ఏవైనా అదనపు వివరాలు ఉన్నాయా?' }
  }
];

const RATION_CARD_FIELDS: ServiceField[] = [
  {
    id: 'head_of_family', label: 'Name of Head of Family', type: 'text',
    voiceLabel: { en: 'Please tell me the name of the head of your family', hi: 'कृपया अपने परिवार के मुखिया का नाम बताएं', te: 'దయచేసి మీ కుటుంబ యజమాని పేరు చెప్పండి' }
  },
  {
    id: 'father_husband_name', label: 'Father / Husband Name of Head of Family', type: 'text',
    voiceLabel: { en: "What is the father's or husband's name of the head of family?", hi: 'परिवार के मुखिया के पिता या पति का नाम क्या है?', te: 'కుటుంబ యజమాని తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name of Head of Family", type: 'text',
    voiceLabel: { en: "What is the mother's name of the head of family?", hi: 'परिवार के मुखिया की माता का नाम क्या है?', te: 'కుటుంబ యజమాని తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'residential_address', label: 'Complete Residential Address', type: 'text',
    voiceLabel: { en: 'Please say your complete residential address including house number and street', hi: 'कृपया अपने घर के नंबर और सड़क सहित अपना पूरा आवासीय पता बताएं', te: 'దయచేసి ఇంటి నంబర్ మరియు వీధితో సహా మీ పూర్తి నివాస చిరునామాను చెప్పండి' }
  },
  {
    id: 'ward_no_village', label: 'Ward Number / Village Name', type: 'text',
    voiceLabel: { en: 'What is your ward number or village name?', hi: 'आपका वार्ड नंबर या गांव का नाम क्या है?', te: 'మీ వార్డు నంబర్ లేదా గ్రామం పేరు ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your area PIN code?', hi: 'आपके क्षेत्र का पिन कोड क्या है?', te: 'మీ ప్రాంతం పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'family_count', label: 'Total Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family including the head?', hi: 'मुखिया सहित आपके परिवार में कुल कितने सदस्य हैं?', te: 'యజమానితో సహా మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'family_aadhaar_details', label: 'Aadhaar Numbers of all Family Members', type: 'textarea',
    voiceLabel: { en: "Please provide the Aadhaar numbers of all family members. You can say them one by one.", hi: 'कृपया परिवार के सभी सदस्यों के आधार नंबर प्रदान करें। आप उन्हें एक-एक करके बता सकते हैं।', te: 'దయచేసి కుటుంబ సభ్యులందరి ఆధార్ సంఖ్యలను అందించండి. మీరు వాటిని ఒక్కొక్కటిగా చెప్పవచ్చు.' }
  },
  {
    id: 'card_type', label: 'Category of Ration Card (APL/BPL/AAY)', type: 'text',
    voiceLabel: { en: 'Which type of card are you applying for? APL, BPL, or Antyodaya?', hi: 'आप किस प्रकार के कार्ड के लिए आवेदन कर रहे हैं? एपीएल, बीपीएल, या अंत्योदय?', te: 'మీరు ఏ రకమైన కార్డు కోసం దరఖాస్తు చేస్తున్నారు? APL, BPL లేదా అంత్యోదయ?' }
  },
  {
    id: 'gas_connection', label: 'Do you have a Gas Connection? (Yes/No)', type: 'text',
    voiceLabel: { en: 'Do you have a gas connection at home?', hi: 'क्या आपके घर में गैस कनेक्शन है?', te: 'మీ ఇంట్లో గ్యాస్ కనెక్షన్ ఉందా?' }
  },
  {
    id: 'annual_income', label: 'Total Annual Income of Family (₹)', type: 'number',
    voiceLabel: { en: 'What is the total annual income of your whole family?', hi: 'आपके पूरे परिवार की कुल वार्षिक आय क्या है?', te: 'మీ మొత్తం కుటుంబ వార్షిక ఆదాయం ఎంత?' }
  },
  {
    id: 'ration_desc', label: 'Additional Details / Remarks', type: 'textarea',
    voiceLabel: { en: 'Any additional details or remarks for your ration card application?', hi: 'आपके राशन कार्ड आवेदन के लिए कोई और विवरण या टिप्पणी?', te: 'మీ రేషన్ కార్డ్ దరఖాస్తు కోసం ఏవైనా అదనపు వివరాలు లేదా వ్యాఖ్యలు ఉన్నాయా?' }
  }
];

const POST_MATRIC_SCHOLARSHIP_FIELDS: ServiceField[] = [
  {
    id: 'student_name', label: 'Student Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name as per your school or college records', hi: 'कृपया अपने स्कूल या कॉलेज के रिकॉर्ड के अनुसार अपना पूरा नाम बताएं', te: 'దయచేసి మీ పాఠశాల లేదా కళాశాల రికార్డుల ప్రకారం మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'aadhaar_no', label: 'Student Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'caste_category', label: 'Caste Category (SC/ST/OBC/Minority)', type: 'text',
    voiceLabel: { en: 'What is your caste category? SC, ST, OBC, or Minority?', hi: 'आपकी जाति श्रेणी क्या है? एससी, एसटी, ओबीसी, या अल्पसंख्यक?', te: 'మీ కుల వర్గం ఏమిటి? SC, ST, OBC లేదా మైనారిటీ?' }
  },
  {
    id: 'caste_cert_no', label: 'Caste Certificate Number', type: 'text',
    voiceLabel: { en: 'What is your caste certificate number?', hi: 'आपका जाति प्रमाण पत्र नंबर क्या है?', te: 'మీ కుల ధృవీకరణ పత్రం సంఖ్య ఎంత?' }
  },
  {
    id: 'income_cert_no', label: 'Income Certificate Number', type: 'text',
    voiceLabel: { en: 'What is your family income certificate number?', hi: 'आपके परिवार का आय प्रमाण पत्र नंबर क्या है?', te: 'మీ కుటుంబ ఆదాయ ధృవీకరణ పత్రం సంఖ్య ఎంత?' }
  },
  {
    id: 'college_name', label: 'College / University Name', type: 'text',
    voiceLabel: { en: 'What is the name of your college or university?', hi: 'आपके कॉलेज या विश्वविद्यालय का नाम क्या है?', te: 'మీ కళాశాల లేదా విశ్వవిద్యాలయం పేరు ఏమిటి?' }
  },
  {
    id: 'course_name', label: 'Course Name (e.g., B.Tech, MBA)', type: 'text',
    voiceLabel: { en: 'Which course are you currently studying?', hi: 'आप वर्तमान में कौन सा कोर्स कर रहे हैं?', te: 'మీరు ప్రస్తుతం ఏ కోర్సు చదువుతున్నారు?' }
  },
  {
    id: 'current_year', label: 'Current Year of Study', type: 'text',
    voiceLabel: { en: 'Which year of the course are you in? First, second, or final year?', hi: 'आप कोर्स के किस वर्ष में हैं? प्रथम, द्वितीय, या अंतिम वर्ष?', te: 'మీరు కోర్సులో ఏ సంవత్సరంలో ఉన్నారు? మొదటి, రెండవ లేదా చివరి సంవత్సరమా?' }
  },
  {
    id: 'prev_marks', label: 'Previous Year Percentage / GPA', type: 'text',
    voiceLabel: { en: 'What was your percentage or GPA in the previous year or semester?', hi: 'पिछले वर्ष या सेमेस्टर में आपका प्रतिशत या GPA क्या था?', te: 'గత సంవత్సరం లేదా సెమిస్టర్‌లో మీ శాతం లేదా GPA ఎంత?' }
  },
  {
    id: 'bank_account', label: 'Student Bank Account Number', type: 'text',
    voiceLabel: { en: 'Please tell me your bank account number for the scholarship credit', hi: 'छात्रवृत्ति क्रेडिट के लिए कृपया अपना बैंक खाता संख्या बताएं', te: 'స్కాలర్‌షిప్ క్రెడిట్ కోసం దయచేసి మీ బ్యాంక్ ఖాతా సంఖ్యను చెప్పండి' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number for scholarship updates?', hi: 'छात्रवृत्ति अपडेट के लिए आपका मोबाइल नंबर क्या है?', te: 'స్కాలర్‌షిప్ అప్‌డేట్‌ల కోసం మీ మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'scholarship_desc', label: 'Additional Academic Details', type: 'textarea',
    voiceLabel: { en: 'Any other academic details or remarks you want to add?', hi: 'कोई और शैक्षणिक विवरण या टिप्पणी जो आप जोड़ना चाहते हैं?', te: 'మీరు చేర్చాలనుకుంటున్న ఇతర విద్యా వివరాలు లేదా వ్యాఖ్యలు ఏవైనా ఉన్నాయా?' }
  }
];

const PRE_MATRIC_SCHOLARSHIP_FIELDS: ServiceField[] = [
  {
    id: 'student_name', label: 'Student Full Name', type: 'text',
    voiceLabel: { en: "What is the student's full name as per school records?", hi: 'स्कूल रिकॉर्ड के अनुसार छात्र का पूरा नाम क्या है?', te: 'పాఠశాల రికార్డుల ప్రకారం విద్యార్థి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'father_guardian_name', label: "Father's / Guardian's Name", type: 'text',
    voiceLabel: { en: "What is the father's or guardian's name?", hi: 'पिता या अभिभावक का नाम क्या है?', te: 'తండ్రి లేదా సంరక్షకుడి పేరు ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Student / Parent Aadhaar Number', type: 'text',
    voiceLabel: { en: "What is the Aadhaar number for the student or parent?", hi: 'छात्र या माता-पिता का आधार नंबर क्या है?', te: 'విద్యార్థి లేదా తల్లిదండ్రుల ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'caste_category', label: 'Caste Category (SC/ST/OBC/Minority)', type: 'text',
    voiceLabel: { en: 'What is your caste category?', hi: 'आपकी जाति श्रेणी क्या है?', te: 'మీ కుల వర్గం ఏమిటి?' }
  },
  {
    id: 'caste_cert_no', label: 'Caste Certificate Number', type: 'text',
    voiceLabel: { en: 'What is the caste certificate number?', hi: 'जाति प्रमाण पत्र नंबर क्या है?', te: 'కుల ధృవీకరణ పత్రం సంఖ్య ఎంత?' }
  },
  {
    id: 'income_cert_no', label: 'Family Income Certificate Number', type: 'text',
    voiceLabel: { en: 'What is the family income certificate number?', hi: 'पारिवारिक आय प्रमाण पत्र नंबर क्या है?', te: 'కుటుంబ ఆదాయ ధృవీకరణ పత్రం సంఖ్య ఎంత?' }
  },
  {
    id: 'school_name', label: 'School Name', type: 'text',
    voiceLabel: { en: 'What is the name of your school?', hi: 'आपके स्कूल का नाम क्या है?', te: 'మీ పాఠశాల పేరు ఏమిటి?' }
  },
  {
    id: 'current_class', label: 'Current Class (e.g., 5th, 8th, 10th)', type: 'text',
    voiceLabel: { en: 'In which class are you currently studying?', hi: 'अभी आप कौन सी कक्षा में पढ़ रहे हैं?', te: 'మీరు ప్రస్తుతం ఏ తరగతిలో చదువుతున్నారు?' }
  },
  {
    id: 'prev_class_marks', label: 'Previous Class Percentage / Marks', type: 'text',
    voiceLabel: { en: 'What was your percentage or marks in the previous class?', hi: 'पिछली कक्षा में आपका प्रतिशत या अंक क्या थे?', te: 'గత తరగతిలో మీ శాతం లేదా మార్కులు ఎంత?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number (Student/Joint)', type: 'text',
    voiceLabel: { en: 'What is the bank account number for the scholarship?', hi: 'छात्रवृत्ति के लिए बैंक खाता संख्या क्या है?', te: 'స్కాలర్‌షిప్ కోసం బ్యాంక్ ఖాతా సంఖ్య ఎంత?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your registered mobile number?', hi: 'आपका पंजीकृत मोबाइल नंबर क्या है?', te: 'మీ నమోదిత మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'scholarship_desc', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional details regarding the scholarship application?', hi: 'छात्रवृत्ति आवेदन के संबंध में कोई और विवरण?', te: 'స్కాలర్‌షిప్ దరఖాస్తు గురించి ఏవైనా అదనపు వివరాలు ఉన్నాయా?' }
  }
];

const AYUSHMAN_BHARAT_FIELDS: ServiceField[] = [
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile_no', label: 'Mobile Number (Linked to Aadhaar)', type: 'tel',
    voiceLabel: { en: 'What is your mobile number linked to Aadhaar?', hi: 'आधार से लिंक किया गया आपका मोबाइल नंबर क्या है?', te: 'ఆధార్‌తో లింక్ చేయబడిన మీ మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'Which state do you reside in?', hi: 'आप किस राज्य में रहते हैं?', te: 'మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'Which district do you belong to?', hi: 'आप किस जिले से हैं?', te: 'మీరు ఏ జిల్లాకు చెందినవారు?' }
  },
  {
    id: 'village_city', label: 'Village/Town/City', type: 'text',
    voiceLabel: { en: 'What is your village, town or city name?', hi: 'आपका गांव, कस्बा या शहर का नाम क्या है?', te: 'మీ గ్రామం, పట్టణం లేదా నగరం పేరు ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'family_size', label: 'Total Family Members', type: 'number',
    voiceLabel: { en: 'How many members are in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'ration_no', label: 'Ration Card Number (Optional)', type: 'text',
    voiceLabel: { en: 'What is your ration card number? You can skip if you dont have one.', hi: 'आपका राशन कार्ड नंबर क्या है? यदि नहीं है तो छोड़ सकते हैं।', te: 'మీ రేషన్ కార్డ్ సంఖ్య ఏమిటి? లేకపోతే వదిలేయవచ్చు.' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number (For Cashless Transactions)', type: 'text',
    voiceLabel: { en: 'What is your bank account number for cashless hospital transactions?', hi: 'नकद रहित अस्पताल लेनदेन के लिए आपका बैंक खाता संख्या क्या है?', te: 'నగదు లేని ఆస్పత్రి లావాదేవీల కోసం మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  }
];

const DISABILITY_CERTIFICATE_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'guardian_name', label: "Guardian's Name (if applicable)", type: 'text',
    voiceLabel: { en: "If you have a guardian, what is their name?", hi: 'यदि आपके पास अभिभावक है तो उनका नाम क्या है?', te: 'మీకు సంరక్షకుడు ఉంటే వారి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste', label: 'Caste Category', type: 'text',
    voiceLabel: { en: 'What is your caste category?', hi: 'आपकी जाति श्रेणी क्या है?', te: 'మీ జాతి వర్గం ఏమిటి?' }
  },
  {
    id: 'house_no', label: 'House Number', type: 'text',
    voiceLabel: { en: 'What is your house number?', hi: 'आपका घर संख्या क्या है?', te: 'మీ ఇల్లు సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_city', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपना गांव, कस्बा या शहर बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం చెప్పండి' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'disability_type', label: 'Type of Disability', type: 'text',
    voiceLabel: { en: 'What type of disability do you have?', hi: 'आपके पास किस प्रकार की विकलांगता है?', te: 'మీకు ఏ రకమైన వైకల్యం ఉంది?' }
  },
  {
    id: 'disability_subtype', label: 'Sub-type of Disability', type: 'text',
    voiceLabel: { en: 'Please specify the sub-type of disability', hi: 'कृपया विकलांगता का उप-प्रकार बताएं', te: 'దయచేసి వైకల్యం యొక్క ఉప-రకాన్ని పేర్కొనండి' }
  },
  {
    id: 'disability_percentage', label: 'Percentage of Disability', type: 'number',
    voiceLabel: { en: 'What is the percentage of your disability?', hi: 'आपकी विकलांगता का प्रतिशत क्या है?', te: 'మీ వైకల్యం శాతం ఎంత?' }
  },
  {
    id: 'disability_cause', label: 'Cause of Disability', type: 'text',
    voiceLabel: { en: 'What is the cause of your disability?', hi: 'आपकी विकलांगता का कारण क्या है?', te: 'మీ వైకల్యం కారణం ఏమిటి?' }
  },
  {
    id: 'disability_onset_date', label: 'Date of Onset of Disability', type: 'text',
    voiceLabel: { en: 'When did your disability begin?', hi: 'आपकी विकलांगता कब शुरू हुई?', te: 'మీ వైకల్యం ఎప్పుడు ప్రారంభమైంది?' }
  },
  {
    id: 'hospital_name', label: 'Name of Hospital/Clinic', type: 'text',
    voiceLabel: { en: 'Which hospital or clinic examined you?', hi: 'आपको किस अस्पताल या क्लिनिक में जांच हुई?', te: 'మిమ్మల్ని ఏ ఆస్పత్రి లేదా క్లినిక్ తనిఖీ చేసింది?' }
  },
  {
    id: 'doctor_name', label: 'Name of Doctor', type: 'text',
    voiceLabel: { en: 'What is the name of the doctor who examined you?', hi: 'आपको जांचने वाले डॉक्टर का नाम क्या है?', te: 'మిమ్మల్ని తనిఖీ చేసిన డాక్టర్ పేరు ఏమిటి?' }
  },
  {
    id: 'medical_examination_date', label: 'Date of Medical Examination', type: 'text',
    voiceLabel: { en: 'When was your medical examination?', hi: 'आपकी चिकित्सा जांच कब हुई?', te: 'మీ వైద్య తనిఖీ ఎప్పుడు జరిగింది?' }
  },
  {
    id: 'medical_board_details', label: 'Medical Board Details', type: 'text',
    voiceLabel: { en: 'Please provide details of the medical board', hi: 'कृपया चिकित्सा बोर्ड का विवरण दें', te: 'దయచేసి వైద్య బోర్డ్ వివరాలను అందించండి' }
  },
  {
    id: 'supporting_documents', label: 'Supporting Documents', type: 'textarea',
    voiceLabel: { en: 'Please list the supporting documents you have', hi: 'कृपया आपके पास मौजूद सहायक दस्तावेजों की सूची दें', te: 'దయచేసి మీ వద్ద ఉన్న మద్దతు పత్రాల జాబితాను అందించండి' }
  },
  {
    id: 'occupation', label: 'Occupation', type: 'text',
    voiceLabel: { en: 'What is your occupation?', hi: 'आपका व्यवसाय क्या है?', te: 'మీ వృత్తి ఏమిటి?' }
  },
  {
    id: 'annual_income', label: 'Annual Income', type: 'text',
    voiceLabel: { en: 'What is your annual income?', hi: 'आपकी वार्षिक आय क्या है?', te: 'మీ వార్షిక ఆదాయం ఎంత?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const MGNREGA_JOB_CARD_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_husband_name', label: "Father's/Husband's Name", type: 'text',
    voiceLabel: { en: "What is your father's or husband's name?", hi: 'आपके पिता या पति का नाम क्या है?', te: 'మీ తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'social_category', label: 'Social Category', type: 'text',
    voiceLabel: { en: 'What is your social category? SC, ST, OBC, or General?', hi: 'आपकी सामाजिक श्रेणी क्या है? अनुसूचित जाति, अनुसूचित जनजाति, अन्य पिछड़ा वर्ग, या सामान्य?', te: 'మీ సామాజిక వర్గం ఏమిటి? SC, ST, OBC లేదా సాధారణ?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'house_no', label: 'House Number', type: 'text',
    voiceLabel: { en: 'What is your house number?', hi: 'आपका घर संख्या क्या है?', te: 'మీ ఇల్లు సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_town', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपना गांव, कस्बा या शहर बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం చెప్పండి' }
  },
  {
    id: 'gram_panchayat', label: 'Gram Panchayat', type: 'text',
    voiceLabel: { en: 'What is your Gram Panchayat name?', hi: 'आपका ग्राम पंचायत नाम क्या है?', te: 'మీ గ్రామ పంచాయతి పేరు ఏమిటి?' }
  },
  {
    id: 'block', label: 'Block / Taluk', type: 'text',
    voiceLabel: { en: 'What is your block or taluk name?', hi: 'आपका ब्लॉक या तालुका नाम क्या है?', te: 'మీ బ్లాక్ లేదా తాలూకా పేరు ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'epic_no', label: 'EPIC Number (Voter ID)', type: 'text',
    voiceLabel: { en: 'What is your EPIC or Voter ID number?', hi: 'आपका EPIC या वोटर आईडी नंबर क्या है?', te: 'మీ EPIC లేదా ఓటర్ ఐడి సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ration_card_no', label: 'Ration Card Number', type: 'text',
    voiceLabel: { en: 'What is your ration card number?', hi: 'आपका राशन कार्ड नंबर क्या है?', te: 'మీ రేషన్ కార్డ్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bpl_apl_status', label: 'BPL/APL Status', type: 'text',
    voiceLabel: { en: 'Are you BPL or APL?', hi: 'आप बीपीएल या एपीएल हैं?', te: 'మీరు BPL లేదా APL?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'branch_name', label: 'Bank Branch Name', type: 'text',
    voiceLabel: { en: 'What is your bank branch name?', hi: 'आपके बैंक की शाखा का नाम क्या है?', te: 'మీ బ్యాంక్ బ్రాంచ్ పేరు ఏమిటి?' }
  },
  {
    id: 'education_level', label: 'Education Level', type: 'text',
    voiceLabel: { en: 'What is your education level?', hi: 'आपका शिक्षा स्तर क्या है?', te: 'మీ విద్యా స్థాయి ఏమిటి?' }
  },
  {
    id: 'occupation', label: 'Current Occupation', type: 'text',
    voiceLabel: { en: 'What is your current occupation?', hi: 'आपका वर्तमान व्यवसाय क्या है?', te: 'మీ ప్రస్తుత వృత్తి ఏమిటి?' }
  },
  {
    id: 'previous_employment', label: 'Previous Employment Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your previous employment', hi: 'कृपया अपनी पिछली नौकरी का विवरण दें', te: 'దయచేసి మీ మునుపటి ఉద్యోగం వివరించండి' }
  },
  {
    id: 'skills', label: 'Skills and Experience', type: 'textarea',
    voiceLabel: { en: 'What skills do you have?', hi: 'आपके पास कौन सी कौशल हैं?', te: 'మీకు ఏ దక్షతలు ఉన్నాయి?' }
  },
  {
    id: 'land_ownership', label: 'Land Ownership Details', type: 'textarea',
    voiceLabel: { en: 'Do you own any land? Please provide details', hi: 'क्या आपके पास कोई जमीन है? कृपया विवरण दें', te: 'మీకు ఏదైనా భూమి ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'irrigation_status', label: 'Irrigation Status', type: 'text',
    voiceLabel: { en: 'What is the irrigation status of your land?', hi: 'आपकी जमीन की सिंचाई स्थिति क्या है?', te: 'మీ భూమి యొక్క నీటిపారుదల స్థితి ఏమిటి?' }
  },
  {
    id: 'family_members', label: 'Family Members Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of your family members including their names, ages, and relationships', hi: 'कृपया अपने परिवार के सदस्यों का विवरण दें जिसमें उनके नाम, आयु और संबंध शामिल हैं', te: 'దయచేసి మీ కుటుంబ సభ్యుల వివరాలను అందించండి వారి పేర్లు, వయస్సులు మరియు సంబంధాలతో సహా' }
  },
  {
    id: 'annual_income', label: 'Annual Family Income', type: 'text',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' }
  },
  {
    id: 'disability_status', label: 'Any Disability', type: 'text',
    voiceLabel: { en: 'Do you have any disability?', hi: 'क्या आपको कोई विकलांगता है?', te: 'మీకు ఏదైనా వైకల్యం ఉందా?' }
  },
  {
    id: 'migrant_worker', label: 'Are you a Migrant Worker?', type: 'text',
    voiceLabel: { en: 'Are you a migrant worker?', hi: 'क्या आप प्रवासी मजदूर हैं?', te: 'మీరు ప్రవాసీ కార్మికులా?' }
  },
  {
    id: 'preferred_work_location', label: 'Preferred Work Location', type: 'text',
    voiceLabel: { en: 'Where would you prefer to work?', hi: 'आप कहां काम करना पसंद करेंगे?', te: 'మీరు ఎక్కడ పని చేయాలని అనుకుంటున్నారు?' }
  },
  {
    id: 'work_experience', label: 'Work Experience in MGNREGA', type: 'text',
    voiceLabel: { en: 'Have you worked under MGNREGA before?', hi: 'क्या आपने पहले एमजीएनआरईजीए के तहत काम किया है?', te: 'మీరు ఇంతకు ముందు MGNREGA కింద పని చేసారా?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const UDYAM_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name of Entrepreneur', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'social_category', label: 'Social Category', type: 'text',
    voiceLabel: { en: 'What is your social category? General, SC, ST, or OBC?', hi: 'आपकी सामाजिक श्रेणी क्या है? सामान्य, अनुसूचित जाति, अनुसूचित जनजाति, या अन्य पिछड़ा वर्ग?', te: 'మీ సామాజిక వర్గం ఏమిటి? సాధారణ, SC, ST లేదా OBC?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'mobile', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your mobile number?', hi: 'आपका मोबाइल नंबर क्या है?', te: 'మీ మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'business_name', label: 'Business/Enterprise Name', type: 'text',
    voiceLabel: { en: 'What is the name of your business or enterprise?', hi: 'आपके व्यवसाय या उद्यम का नाम क्या है?', te: 'మీ వ్యాపారం లేదా ఉద్యమం పేరు ఏమిటి?' }
  },
  {
    id: 'business_type', label: 'Type of Organization', type: 'text',
    voiceLabel: { en: 'What type of organization is it? Proprietorship, Partnership, or Private Limited?', hi: 'यह किस प्रकार का संगठन है? एकल स्वामित्व, साझेदारी, या प्राइवेट लिमिटेड?', te: 'ఇది ఏ రకమైన సంస్థ? ఒక్కడే యజమాని, భాగస్వామ్యం లేదా ప్రైవేట్ లిమిటెడ్?' }
  },
  {
    id: 'business_activity', label: 'Business Activity', type: 'text',
    voiceLabel: { en: 'What is the main business activity?', hi: 'मुख्य व्यावसायिक गतिविधि क्या है?', te: 'ప్రధాన వ్యాపార కార్యాచరణ ఏమిటి?' }
  },
  {
    id: 'nic_code', label: 'NIC Code (if known)', type: 'text',
    voiceLabel: { en: 'What is the NIC code for your business activity?', hi: 'आपकी व्यावसायिक गतिविधि के लिए NIC कोड क्या है?', te: 'మీ వ్యాపార కార్యాచరణ కోసం NIC కోడ్ ఏమిటి?' }
  },
  {
    id: 'date_of_incorporation', label: 'Date of Incorporation/Commencement', type: 'text',
    voiceLabel: { en: 'When did you start your business?', hi: 'आपने अपना व्यवसाय कब शुरू किया?', te: 'మీరు మీ వ్యాపారం ఎప్పుడు ప్రారంభించారు?' }
  },
  {
    id: 'business_address', label: 'Business Address', type: 'textarea',
    voiceLabel: { en: 'What is the complete address of your business?', hi: 'आपके व्यवसाय का पूरा पता क्या है?', te: 'మీ వ్యాపారం యొక్క పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'business_district', label: 'Business District', type: 'text',
    voiceLabel: { en: 'In which district is your business located?', hi: 'आपका व्यवसाय किस जिले में स्थित है?', te: 'మీ వ్యాపారం ఏ జిల్లాలో ఉంది?' }
  },
  {
    id: 'business_state', label: 'Business State', type: 'text',
    voiceLabel: { en: 'In which state is your business located?', hi: 'आपका व्यवसाय किस राज्य में स्थित है?', te: 'మీ వ్యాపారం ఏ రాష్ట్రంలో ఉంది?' }
  },
  {
    id: 'business_pincode', label: 'Business PIN Code', type: 'text',
    voiceLabel: { en: 'What is the PIN code of your business location?', hi: 'आपके व्यवसाय स्थान का पिन कोड क्या है?', te: 'మీ వ్యాపార స్థలం యొక్క పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'plant_machinery_investment', label: 'Investment in Plant & Machinery (₹)', type: 'text',
    voiceLabel: { en: 'What is your investment in plant and machinery?', hi: 'प्लांट और मशीनरी में आपकी निवेश कितना है?', te: 'ప్లాంట్ మరియు మెషినరీలో మీ పెట్టుబడి ఎంత?' }
  },
  {
    id: 'total_investment', label: 'Total Investment (₹)', type: 'text',
    voiceLabel: { en: 'What is your total investment in the business?', hi: 'व्यवसाय में आपका कुल निवेश कितना है?', te: 'వ్యాపారంలో మీ మొత్తం పెట్టుబడి ఎంత?' }
  },
  {
    id: 'previous_year_turnover', label: 'Previous Year Turnover (₹)', type: 'text',
    voiceLabel: { en: 'What was your turnover in the previous year?', hi: 'पिछले वर्ष में आपका टर्नओवर कितना था?', te: 'మునుపటి సంవత్సరంలో మీ టర్నోవర్ ఎంత?' }
  },
  {
    id: 'male_employees', label: 'Number of Male Employees', type: 'number',
    voiceLabel: { en: 'How many male employees do you have?', hi: 'आपके पास कितने पुरुष कर्मचारी हैं?', te: 'మీకు ఎంతమంది పురుషుల కార్మికులు ఉన్నారు?' }
  },
  {
    id: 'female_employees', label: 'Number of Female Employees', type: 'number',
    voiceLabel: { en: 'How many female employees do you have?', hi: 'आपके पास कितनी महिला कर्मचारी हैं?', te: 'మీకు ఎంతమంది స్త్రీ కార్మికులు ఉన్నారు?' }
  },
  {
    id: 'other_employees', label: 'Number of Other Employees', type: 'number',
    voiceLabel: { en: 'How many other employees do you have?', hi: 'आपके पास कितने अन्य कर्मचारी हैं?', te: 'మీకు ఎంతమంది ఇతర కార్మికులు ఉన్నారు?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your business bank account number?', hi: 'आपका व्यवसाय बैंक खाता संख्या क्या है?', te: 'మీ వ్యాపార బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'previous_registration', label: 'Previous MSME Registration Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any previous MSME registration? Please provide details', hi: 'क्या आपके पास कोई पिछली एमएसएमई पंजीकरण है? कृपया विवरण दें', te: 'మీకు ఏదైనా మునుపటి MSME నమోదు ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'dic_name', label: 'DIC Name (if applicable)', type: 'text',
    voiceLabel: { en: 'What is the name of your DIC if applicable?', hi: 'यदि लागू हो तो आपके DIC का नाम क्या है?', te: 'వర్తిస్తే మీ DIC పేరు ఏమిటి?' }
  },
  {
    id: 'export_oriented', label: 'Is the unit export-oriented?', type: 'text',
    voiceLabel: { en: 'Is your business export-oriented?', hi: 'क्या आपका व्यवसाय निर्यात उन्मुख है?', te: 'మీ వ్యాపారం ఎగుమతి ఉन्मుఖమా?' }
  },
  {
    id: 'women_owned', label: 'Is it a women-owned enterprise?', type: 'text',
    voiceLabel: { en: 'Is this a women-owned enterprise?', hi: 'क्या यह महिला स्वामित्व वाला उद्यम है?', te: 'ఇది స్త్రీల యజమానిగా ఉన్న ఉద్యమమా?' }
  },
  {
    id: 'sc_st_owned', label: 'Is it owned by SC/ST entrepreneur?', type: 'text',
    voiceLabel: { en: 'Is this enterprise owned by SC/ST entrepreneur?', hi: 'क्या यह उद्यम SC/ST उद्यमी के स्वामित्व में है?', te: 'ఈ ఉద్యమం SC/ST ఉద్యమి యజమానిగా ఉందా?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const FSSAI_LICENSE_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Applicant/Proprietor Name', type: 'text',
    voiceLabel: { en: 'What is the name of the applicant or proprietor?', hi: 'आवेदक या मालिक का नाम क्या है?', te: 'అప్లైయర్ లేదా యజమాని పేరు ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is the father's name?", hi: 'पिता का नाम क्या है?', te: 'తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mobile', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is the mobile number?', hi: 'मोबाइल नंबर क्या है?', te: 'మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is the email address?', hi: 'ईमेल पता क्या है?', te: 'ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the Aadhaar number?', hi: 'आधार नंबर क्या है?', te: 'ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is the PAN number?', hi: 'पैन नंबर क्या है?', te: 'పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'business_name', label: 'Business/Outlet Name', type: 'text',
    voiceLabel: { en: 'What is the name of your business or outlet?', hi: 'आपके व्यवसाय या आउटलेट का नाम क्या है?', te: 'మీ వ్యాపారం లేదా ఔట్‌లెట్ పేరు ఏమిటి?' }
  },
  {
    id: 'license_type', label: 'License Type', type: 'text',
    voiceLabel: { en: 'What type of FSSAI license do you need? Central State License or Basic Registration?', hi: 'आपको किस प्रकार का FSSAI लाइसेंस चाहिए? सेंट्रल स्टेट लाइसेंस या बेसिक रजिस्ट्रेशन?', te: 'మీకు ఏ రకమైన FSSAI లైసెన్స్ కావాలి? సెంట్రల్ స్టేట్ లైసెన్స్ లేదా బేసిక్ రిజిస్ట్రేషన్?' }
  },
  {
    id: 'business_type', label: 'Type of Business', type: 'text',
    voiceLabel: { en: 'What type of food business do you have? Restaurant, Manufacturer, Retailer, etc.?', hi: 'आपके पास किस प्रकार का खाद्य व्यवसाय है? रेस्टोरेंट, निर्माता, खुदरा विक्रेता, आदि?', te: 'మీకు ఏ రకమైన ఆహార వ్యాపారం ఉంది? రెస్టారెంట్, తయారీదారు, రిటైలర్, మొదలైనవి?' }
  },
  {
    id: 'food_category', label: 'Food Category', type: 'text',
    voiceLabel: { en: 'What category of food do you handle? Packed, Unpacked, Dairy, Meat, etc.?', hi: 'आप किस श्रेणी का खाद्य पदार्थ संभालते हैं? पैक, अनपैक, डेयरी, मीट, आदि?', te: 'మీరు ఏ వర్గం ఆహారాన్ని నిర్వహిస్తారు? ప్యాక్ చేయబడిన, అన్‌ప్యాక్ చేయబడిన, డెయిరీ, మీట్, మొదలైనవి?' }
  },
  {
    id: 'business_address', label: 'Complete Business Address', type: 'textarea',
    voiceLabel: { en: 'What is the complete address of your business?', hi: 'आपके व्यवसाय का पूरा पता क्या है?', te: 'మీ వ్యాపారం యొక్క పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'business_district', label: 'Business District', type: 'text',
    voiceLabel: { en: 'In which district is your business located?', hi: 'आपका व्यवसाय किस जिले में स्थित है?', te: 'మీ వ్యాపారం ఏ జిల్లాలో ఉంది?' }
  },
  {
    id: 'business_state', label: 'Business State', type: 'text',
    voiceLabel: { en: 'In which state is your business located?', hi: 'आपका व्यवसाय किस राज्य में स्थित है?', te: 'మీ వ్యాపారం ఏ రాష్ట్రంలో ఉంది?' }
  },
  {
    id: 'business_pincode', label: 'Business PIN Code', type: 'text',
    voiceLabel: { en: 'What is the PIN code of your business location?', hi: 'आपके व्यवसाय स्थान का पिन कोड क्या है?', te: 'మీ వ్యాపార స్థలం యొక్క పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'gst_no', label: 'GST Number (if applicable)', type: 'text',
    voiceLabel: { en: 'What is your GST number if applicable?', hi: 'यदि लागू हो तो आपका GST नंबर क्या है?', te: 'వర్తిస్తే మీ GST సంఖ్య ఏమిటి?' }
  },
  {
    id: 'food_products', label: 'Food Products/Services Offered', type: 'textarea',
    voiceLabel: { en: 'What food products or services do you offer?', hi: 'आप कौन से खाद्य उत्पाद या सेवाएं प्रदान करते हैं?', te: 'మీరు ఏ ఆహార ఉత్పత్తులు లేదా సేవలను అందిస్తారు?' }
  },
  {
    id: 'production_capacity', label: 'Production Capacity (if manufacturer)', type: 'text',
    voiceLabel: { en: 'What is your production capacity if you are a manufacturer?', hi: 'यदि आप निर्माता हैं तो आपकी उत्पादन क्षमता क्या है?', te: 'మీరు తయారీదారు అయితే మీ ఉత్పత్తి సామర్థ్యం ఏమిటి?' }
  },
  {
    id: 'storage_facility', label: 'Storage Facility Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your storage facilities', hi: 'कृपया अपनी भंडारण सुविधाओं का वर्णन करें', te: 'దయచేసి మీ నిల్వ సౌకర్యాలను వివరించండి' }
  },
  {
    id: 'equipment_details', label: 'Equipment and Machinery Details', type: 'textarea',
    voiceLabel: { en: 'What equipment and machinery do you have?', hi: 'आपके पास कौन से उपकरण और मशीनरी हैं?', te: 'మీకు ఏ ఉపకరణాలు మరియు మెషినరీ ఉన్నాయి?' }
  },
  {
    id: 'water_source', label: 'Source of Water Supply', type: 'text',
    voiceLabel: { en: 'What is the source of your water supply?', hi: 'आपकी जल आपूर्ति का स्रोत क्या है?', te: 'మీ నీటి సరఫరా మూలం ఏమిటి?' }
  },
  {
    id: 'waste_disposal', label: 'Waste Disposal Method', type: 'text',
    voiceLabel: { en: 'How do you dispose of waste?', hi: 'आप अपशिष्ट का निपटान कैसे करते हैं?', te: 'మీరు వ్యర్థాలను ఎలా తీసివేస్తారు?' }
  },
  {
    id: 'food_handlers', label: 'Number of Food Handlers', type: 'number',
    voiceLabel: { en: 'How many food handlers do you have?', hi: 'आपके पास कितने खाद्य संचालक हैं?', te: 'మీకు ఎంతమంది ఆహార నిర్వాహకులు ఉన్నారు?' }
  },
  {
    id: 'training_certificates', label: 'Food Safety Training Certificates', type: 'textarea',
    voiceLabel: { en: 'Do you have any food safety training certificates?', hi: 'क्या आपके पास कोई खाद्य सुरक्षा प्रशिक्षण प्रमाणपत्र हैं?', te: 'మీకు ఏదైనా ఆహార భద్రతా శిక్షణ ధృవీకరణ పత్రాలు ఉన్నాయా?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'annual_turnover', label: 'Annual Turnover (₹)', type: 'text',
    voiceLabel: { en: 'What is your annual turnover?', hi: 'आपका वार्षिक टर्नओवर कितना है?', te: 'మీ వార్షిక టర్నోవర్ ఎంత?' }
  },
  {
    id: 'previous_license', label: 'Previous FSSAI License Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any previous FSSAI license? Please provide details', hi: 'क्या आपके पास कोई पिछला FSSAI लाइसेंस है? कृपया विवरण दें', te: 'మీకు ఏదైనా మునుపటి FSSAI లైసెన్స్ ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'food_safety_plan', label: 'Food Safety Management Plan', type: 'textarea',
    voiceLabel: { en: 'Do you have a food safety management plan?', hi: 'क्या आपके पास खाद्य सुरक्षा प्रबंधन योजना है?', te: 'మీకు ఆహార భద్రతా నిర్వహణ ప్రణాళిక ఉందా?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const PM_AWAS_YOJANA_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_husband_name', label: "Father's/Husband's Name", type: 'text',
    voiceLabel: { en: "What is your father's or husband's name?", hi: 'आपके पिता या पति का नाम क्या है?', te: 'మీ తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste_category', label: 'Caste Category', type: 'text',
    voiceLabel: { en: 'What is your caste category? SC, ST, OBC, or General?', hi: 'आपकी जाति श्रेणी क्या है? अनुसूचित जाति, अनुसूचित जनजाति, अन्य पिछड़ा वर्ग, या सामान्य?', te: 'మీ జాతి వర్గం ఏమిటి? SC, ST, OBC లేదా సాధారణ?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'voter_id', label: 'Voter ID Number', type: 'text',
    voiceLabel: { en: 'What is your Voter ID number?', hi: 'आपका वोटर आईडी नंबर क्या है?', te: 'మీ ఓటర్ ఐడి సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ration_card_no', label: 'Ration Card Number', type: 'text',
    voiceLabel: { en: 'What is your ration card number?', hi: 'आपका राशन कार्ड नंबर क्या है?', te: 'మీ రేషన్ కార్డ్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bpl_apl_status', label: 'BPL/APL Status', type: 'text',
    voiceLabel: { en: 'Are you BPL or APL?', hi: 'आप बीपीएल या एपीएल हैं?', te: 'మీరు BPL లేదా APL?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'occupation', label: 'Occupation', type: 'text',
    voiceLabel: { en: 'What is your occupation?', hi: 'आपका व्यवसाय क्या है?', te: 'మీ వృత్తి ఏమిటి?' }
  },
  {
    id: 'monthly_income', label: 'Monthly Family Income (₹)', type: 'text',
    voiceLabel: { en: 'What is your monthly family income?', hi: 'आपकी मासिक पारिवारिक आय क्या है?', te: 'మీ నెలవారీ కుటుంబ ఆదాయం ఎంత?' }
  },
  {
    id: 'annual_income', label: 'Annual Family Income (₹)', type: 'text',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'family_details', label: 'Family Members Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of your family members including their names, ages, and relationships', hi: 'कृपया अपने परिवार के सदस्यों का विवरण दें जिसमें उनके नाम, आयु और संबंध शामिल हैं', te: 'దయచేసి మీ కుటుంబ సభ్యుల వివరాలను అందించండి వారి పేర్లు, వయస్సులు మరియు సంబంధాలతో సహా' }
  },
  {
    id: 'housing_status', label: 'Current Housing Status', type: 'text',
    voiceLabel: { en: 'What is your current housing status? Own house, rented, homeless, etc.?', hi: 'आपकी वर्तमान आवास स्थिति क्या है? अपना घर, किराए का, बेघर, आदि?', te: 'మీ ప్రస్తుత నివాస స్థితి ఏమిటి? స్వంత ఇల్లు, అద్దెకు తీసుకున్న, నిరాశ్రయులు, మొదలైనవి?' }
  },
  {
    id: 'house_ownership', label: 'House Ownership Details', type: 'textarea',
    voiceLabel: { en: 'Do you own any house? Please provide details', hi: 'क्या आपके पास कोई घर है? कृपया विवरण दें', te: 'మీకు ఏదైనా ఇల్లు ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'land_ownership', label: 'Land Ownership Details', type: 'textarea',
    voiceLabel: { en: 'Do you own any land? Please provide details', hi: 'क्या आपके पास कोई जमीन है? कृपया विवरण दें', te: 'మీకు ఏదైనా భూమి ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'account_holder_name', label: 'Bank Account Holder Name', type: 'text',
    voiceLabel: { en: 'What is the name of the bank account holder?', hi: 'बैंक खाते के धारक का नाम क्या है?', te: 'బ్యాంక్ ఖాతా హోల్డర్ పేరు ఏమిటి?' }
  },
  {
    id: 'previous_benefits', label: 'Previous Housing Scheme Benefits', type: 'textarea',
    voiceLabel: { en: 'Have you received any benefits from housing schemes before? Please provide details', hi: 'क्या आपको पहले आवास योजनाओं से कोई लाभ मिला है? कृपया विवरण दें', te: 'మీకు ఇంతకు ముందు నివాస పథకాల నుండి ఏదైనా ప్రయోజనాలు వచ్చాయా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'disability_status', label: 'Any Family Member with Disability', type: 'text',
    voiceLabel: { en: 'Is there any person with disability in your family?', hi: 'क्या आपके परिवार में कोई विकलांग व्यक्ति है?', te: 'మీ కుటుంబంలో ఏదైనా వైకల్యం ఉన్న వ్యక్తి ఉన్నారా?' }
  },
  {
    id: 'widow_status', label: 'Are you a Widow/Widower?', type: 'text',
    voiceLabel: { en: 'Are you a widow or widower?', hi: 'क्या आप विधवा या विधुर हैं?', te: 'మీరు విధవ లేదా విధురులా?' }
  },
  {
    id: 'minority_status', label: 'Are you from Minority Community?', type: 'text',
    voiceLabel: { en: 'Are you from a minority community?', hi: 'क्या आप अल्पसंख्यक समुदाय से हैं?', te: 'మీరు అల్పసంఖ్యాక సమాజం నుండి వచ్చారా?' }
  },
  {
    id: 'priority_category', label: 'Priority Category (if any)', type: 'text',
    voiceLabel: { en: 'Do you belong to any priority category?', hi: 'क्या आप किसी प्राथमिकता श्रेणी से संबंधित हैं?', te: 'మీరు ఏదైనా ప్రాధాన్య వర్గానికి చెందినవారా?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const NEW_ELECTRICITY_CONNECTION_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Applicant Name', type: 'text',
    voiceLabel: { en: 'What is the name of the applicant?', hi: 'आवेदक का नाम क्या है?', te: 'అప్లైయర్ పేరు ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is the father's name?", hi: 'पिता का नाम क्या है?', te: 'తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mobile', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is the mobile number?', hi: 'मोबाइल नंबर क्या है?', te: 'మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is the email address?', hi: 'ईमेल पता क्या है?', te: 'ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the Aadhaar number?', hi: 'आधार नंबर क्या है?', te: 'ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number (if applicable)', type: 'text',
    voiceLabel: { en: 'What is the PAN number if applicable?', hi: 'यदि लागू हो तो पैन नंबर क्या है?', te: 'వర్తిస్తే పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'connection_type', label: 'Type of Connection', type: 'text',
    voiceLabel: { en: 'What type of electricity connection do you need? Residential, Commercial, or Industrial?', hi: 'आपको किस प्रकार की बिजली कनेक्शन चाहिए? आवासीय, वाणिज्यिक, या औद्योगिक?', te: 'మీకు ఏ రకమైన విద్యుత్ కనెక్షన్ కావాలి? నివాస, వాణిజ్య, లేదా పారిశ్రామిక?' }
  },
  {
    id: 'load_requirement', label: 'Load Requirement (in KW)', type: 'text',
    voiceLabel: { en: 'What is your load requirement in KW?', hi: 'आपकी लोड आवश्यकता KW में क्या है?', te: 'మీ లోడ్ అవసరం KWలో ఎంత?' }
  },
  {
    id: 'purpose', label: 'Purpose of Connection', type: 'text',
    voiceLabel: { en: 'What is the purpose of this electricity connection?', hi: 'इस बिजली कनेक्शन का उद्देश्य क्या है?', te: 'ఈ విద్యుత్ కనెక్షన్ ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'house_plot_no', label: 'House/Plot Number', type: 'text',
    voiceLabel: { en: 'What is your house or plot number?', hi: 'आपका घर या प्लॉट नंबर क्या है?', te: 'మీ ఇల్లు లేదా ప్లాట్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_locality', label: 'Street/Locality', type: 'text',
    voiceLabel: { en: 'What is your street or locality?', hi: 'आपकी गली या इलाका क्या है?', te: 'మీ వీధి లేదా ప్రాంతం ఏమిటి?' }
  },
  {
    id: 'village_city', label: 'Village/City', type: 'text',
    voiceLabel: { en: 'What is your village or city?', hi: 'आपका गांव या शहर क्या है?', te: 'మీ గ్రామం లేదా నగరం ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'ownership_type', label: 'Property Ownership Type', type: 'text',
    voiceLabel: { en: 'What is the ownership type of the property? Owned, Rented, or Leased?', hi: 'संपत्ति का स्वामित्व प्रकार क्या है? स्वामित्व, किराए का, या पट्टे पर?', te: 'సంపత్తి యజమాని రకం ఏమిటి? యజమాని, అద్దెకు తీసుకున్న, లేదా లీజ్?' }
  },
  {
    id: 'property_documents', label: 'Property Documents', type: 'textarea',
    voiceLabel: { en: 'Please list the property documents you have', hi: 'कृपया आपके पास मौजूद संपत्ति दस्तावेजों की सूची दें', te: 'దయచేసి మీ వద్ద ఉన్న సంపత్తి పత్రాల జాబితాను అందించండి' }
  },
  {
    id: 'nearest_pole', label: 'Nearest Electricity Pole Number', type: 'text',
    voiceLabel: { en: 'What is the number of the nearest electricity pole?', hi: 'नजदीकी बिजली खंभे की संख्या क्या है?', te: 'సమీప విద్యుత్ పోల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'distance_from_pole', label: 'Distance from Pole (in meters)', type: 'text',
    voiceLabel: { en: 'What is the distance from the pole in meters?', hi: 'खंभे से दूरी मीटर में क्या है?', te: 'పోల్ నుండి దూరం మీటర్లలో ఎంత?' }
  },
  {
    id: 'existing_connection', label: 'Existing Electricity Connection', type: 'text',
    voiceLabel: { en: 'Do you have any existing electricity connection?', hi: 'क्या आपके पास कोई मौजूदा बिजली कनेक्शन है?', te: 'మీకు ఏదైనా ఇప్పటికే ఉన్న విద్యుత్ కనెక్షన్ ఉందా?' }
  },
  {
    id: 'existing_consumer_no', label: 'Existing Consumer Number (if any)', type: 'text',
    voiceLabel: { en: 'What is your existing consumer number if any?', hi: 'यदि कोई हो तो आपका मौजूदा उपभोक्ता संख्या क्या है?', te: 'ఉంటే మీ ఇప్పటికే ఉన్న కన్స్యూమర్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'account_holder_name', label: 'Account Holder Name', type: 'text',
    voiceLabel: { en: 'What is the name of the bank account holder?', hi: 'बैंक खाते के धारक का नाम क्या है?', te: 'బ్యాంక్ ఖాతా హోల్డర్ పేరు ఏమిటి?' }
  },
  {
    id: 'category', label: 'Category', type: 'text',
    voiceLabel: { en: 'What is your category? General, SC, ST, or OBC?', hi: 'आपकी श्रेणी क्या है? सामान्य, अनुसूचित जाति, अनुसूचित जनजाति, या अन्य पिछड़ा वर्ग?', te: 'మీ వర్గం ఏమిటి? సాధారణ, SC, ST లేదా OBC?' }
  },
  {
    id: 'monthly_income', label: 'Monthly Income (₹)', type: 'text',
    voiceLabel: { en: 'What is your monthly income?', hi: 'आपकी मासिक आय क्या है?', te: 'మీ నెలవారీ ఆదాయం ఎంత?' }
  },
  {
    id: 'supporting_documents', label: 'Supporting Documents', type: 'textarea',
    voiceLabel: { en: 'Please list the supporting documents you have', hi: 'कृपया आपके पास मौजूद सहायक दस्तावेजों की सूची दें', te: 'దయచేసి మీ వద్ద ఉన్న మద్దతు పత్రాల జాబితాను అందించండి' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Details', type: 'textarea',
    voiceLabel: { en: 'Please provide emergency contact details', hi: 'कृपया आपातकालीन संपर्क विवरण दें', te: 'దయచేసి అత్యవసర సంప్రదింపుల వివరాలను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const WATER_PIPE_CONNECTION_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Applicant Name', type: 'text',
    voiceLabel: { en: 'What is the name of the applicant?', hi: 'आवेदक का नाम क्या है?', te: 'అప్లైయర్ పేరు ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is the father's name?", hi: 'पिता का नाम क्या है?', te: 'తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mobile', label: 'Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is the mobile number?', hi: 'मोबाइल नंबर क्या है?', te: 'మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is the email address?', hi: 'ईमेल पता क्या है?', te: 'ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the Aadhaar number?', hi: 'आधार नंबर क्या है?', te: 'ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'connection_type', label: 'Type of Connection', type: 'text',
    voiceLabel: { en: 'What type of water connection do you need? Domestic or Commercial?', hi: 'आपको किस प्रकार का पानी कनेक्शन चाहिए? घरेलू या व्यावसायिक?', te: 'మీకు ఏ రకమైన నీటి కనెక్షన్ కావాలి? గృహస్థ లేదా వాణిజ్య?' }
  },
  {
    id: 'property_type', label: 'Property Type', type: 'text',
    voiceLabel: { en: 'What type of property is it? Owned or Rented?', hi: 'यह किस प्रकार की संपत्ति है? स्वामित्व या किराए की?', te: 'ఇది ఏ రకమైన ఆస్తి? స్వంత లేదా అద్దె?' }
  },
  {
    id: 'property_tax_no', label: 'Property Tax Number', type: 'text',
    voiceLabel: { en: 'What is your property tax number?', hi: 'आपका संपत्ति कर संख्या क्या है?', te: 'మీ ఆస్తి పన్ను సంఖ్య ఏమిటి?' }
  },
  {
    id: 'house_no', label: 'House/Plot Number', type: 'text',
    voiceLabel: { en: 'What is your house or plot number?', hi: 'आपका घर या प्लॉट संख्या क्या है?', te: 'మీ ఇల్లు లేదా ప్లాట్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_name', label: 'Street/Locality Name', type: 'text',
    voiceLabel: { en: 'What is your street or locality name?', hi: 'आपकी गली या इलाका नाम क्या है?', te: 'మీ వీధి లేదా ప్రాంతం పేరు ఏమిటి?' }
  },
  {
    id: 'area_name', label: 'Area/Colony Name', type: 'text',
    voiceLabel: { en: 'What is your area or colony name?', hi: 'आपका क्षेत्र या कॉलोनी नाम क्या है?', te: 'మీ ప్రాంతం లేదా కాలనీ పేరు ఏమిటి?' }
  },
  {
    id: 'ward_no', label: 'Ward Number', type: 'text',
    voiceLabel: { en: 'What is your ward number?', hi: 'आपका वार्ड संख्या क्या है?', te: 'మీ వార్డ్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'zone_name', label: 'Zone Name', type: 'text',
    voiceLabel: { en: 'What is your zone name?', hi: 'आपका ज़ोन नाम क्या है?', te: 'మీ జోన్ పేరు ఏమిటి?' }
  },
  {
    id: 'city_town', label: 'City/Town', type: 'text',
    voiceLabel: { en: 'What is your city or town?', hi: 'आपका शहर या कस्बा क्या है?', te: 'మీ నగరం లేదా పట్టణం ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'landmark', label: 'Landmark (if any)', type: 'text',
    voiceLabel: { en: 'Is there any landmark near your property?', hi: 'क्या आपके संपत्ति के पास कोई लैंडमार्क है?', te: 'మీ ఆస్తి దగ్గర ఏదైనా ల్యాండ్‌మార్క్ ఉందా?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'water_usage', label: 'Estimated Monthly Water Usage (Liters)', type: 'text',
    voiceLabel: { en: 'What is your estimated monthly water usage in liters?', hi: 'आपका अनुमानित मासिक पानी उपयोग कितना है लीटर में?', te: 'మీ అంచనా నెలవారీ నీటి వినియోగం ఎంత లీటర్లలో?' }
  },
  {
    id: 'existing_connection', label: 'Existing Water Connection', type: 'text',
    voiceLabel: { en: 'Do you have any existing water connection?', hi: 'क्या आपके पास कोई मौजूदा पानी कनेक्शन है?', te: 'మీకు ఏదైనా ఇప్పటికే ఉన్న నీటి కనెక్షన్ ఉందా?' }
  },
  {
    id: 'existing_connection_no', label: 'Existing Connection Number (if any)', type: 'text',
    voiceLabel: { en: 'What is your existing connection number?', hi: 'आपका मौजूदा कनेक्शन संख्या क्या है?', te: 'మీ ఇప్పటికే ఉన్న కనెక్షన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ownership_proof', label: 'Ownership Proof Document', type: 'text',
    voiceLabel: { en: 'What ownership proof document do you have? Property tax receipt, sale deed, etc.?', hi: 'आपके पास कौन सा स्वामित्व प्रमाण दस्तावेज है? संपत्ति कर रसीद, बिक्री विलेख, आदि?', te: 'మీకు ఏ యజమాని రుజువు పత్రం ఉంది? ఆస్తి పన్ను రసీదు, అమ్మకం విలేఖం, మొదలైనవి?' }
  },
  {
    id: 'noc_landlord', label: 'NOC from Landlord (if rented)', type: 'text',
    voiceLabel: { en: 'Do you have NOC from your landlord?', hi: 'क्या आपके पास आपके landlord से NOC है?', te: 'మీకు మీ ల్యాండ్‌లార్డ్ నుండి NOC ఉందా?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'purpose', label: 'Purpose of Connection', type: 'textarea',
    voiceLabel: { en: 'What is the purpose of this water connection?', hi: 'इस पानी कनेक्शन का उद्देश्य क्या है?', te: 'ఈ నీటి కనెక్షన్ ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'nearest_connection', label: 'Nearest Existing Connection Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of the nearest existing water connection', hi: 'कृपया निकटतम मौजूदा पानी कनेक्शन का विवरण दें', te: 'దయచేసి దగ్గరలో ఉన్న ఇప్పటికే ఉన్న నీటి కనెక్షన్ వివరాలను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const UJJWALA_YOJANA_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_husband_name', label: "Father's/Husband's Name", type: 'text',
    voiceLabel: { en: "What is your father's or husband's name?", hi: 'आपके पिता या पति का नाम क्या है?', te: 'మీ తండ్రి లేదా భర్త పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste_category', label: 'Caste Category', type: 'text',
    voiceLabel: { en: 'What is your caste category? SC, ST, OBC, or General?', hi: 'आपकी जाति श्रेणी क्या है? अनुसूचित जाति, अनुसूचित जनजाति, अन्य पिछड़ा वर्ग, या सामान्य?', te: 'మీ జాతి వర్గం ఏమిటి? SC, ST, OBC లేదా సాధారణ?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ration_card_no', label: 'Ration Card Number', type: 'text',
    voiceLabel: { en: 'What is your ration card number?', hi: 'आपका राशन कार्ड नंबर क्या है?', te: 'మీ రేషన్ కార్డ్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bpl_card_no', label: 'BPL Card Number', type: 'text',
    voiceLabel: { en: 'What is your BPL card number?', hi: 'आपका बीपीएल कार्ड नंबर क्या है?', te: 'మీ BPL కార్డ్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bpl_apl_status', label: 'BPL/APL Status', type: 'text',
    voiceLabel: { en: 'Are you BPL or APL?', hi: 'आप बीपीएल या एपीएल हैं?', te: 'మీరు BPL లేదా APL?' }
  },
  {
    id: 'house_no', label: 'House Number', type: 'text',
    voiceLabel: { en: 'What is your house number?', hi: 'आपका घर संख्या क्या है?', te: 'మీ ఇల్లు సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_town', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपना गांव, कस्बा या शहर बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం చెప్పండి' }
  },
  {
    id: 'gram_panchayat', label: 'Gram Panchayat', type: 'text',
    voiceLabel: { en: 'What is your Gram Panchayat name?', hi: 'आपका ग्राम पंचायत नाम क्या है?', te: 'మీ గ్రామ పంచాయతి పేరు ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'annual_income', label: 'Annual Family Income (₹)', type: 'text',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' }
  },
  {
    id: 'occupation', label: 'Occupation', type: 'text',
    voiceLabel: { en: 'What is your occupation?', hi: 'आपका व्यवसाय क्या है?', te: 'మీ వృత్తి ఏమిటి?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'account_holder_name', label: 'Bank Account Holder Name', type: 'text',
    voiceLabel: { en: 'What is the name of the bank account holder?', hi: 'बैंक खाते के धारक का नाम क्या है?', te: 'బ్యాంక్ ఖాతా హోల్డర్ పేరు ఏమిటి?' }
  },
  {
    id: 'existing_gas_connection', label: 'Existing Gas Connection Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any existing gas connection? Please provide details', hi: 'क्या आपके पास कोई मौजूदा गैस कनेक्शन है? कृपया विवरण दें', te: 'మీకు ఏదైనా ఇప్పటికే ఉన్న గ్యాస్ కనెక్షన్ ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'cooking_fuel_used', label: 'Current Cooking Fuel Used', type: 'text',
    voiceLabel: { en: 'What cooking fuel do you currently use?', hi: 'आप वर्तमान में कौन सा खाना पकाने का ईंधन इस्तेमाल करते हैं?', te: 'మీరు ప్రస్తుతం ఏ వంట పండ్లను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'aadhaar_linked_mobile', label: 'Aadhaar Linked Mobile Number', type: 'tel',
    voiceLabel: { en: 'What is your Aadhaar linked mobile number?', hi: 'आपका आधार लिंक्ड मोबाइल नंबर क्या है?', te: 'మీ ఆధార్ లింక్ చేయబడిన మొబైల్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'consent_declaration', label: 'Consent and Declaration', type: 'textarea',
    voiceLabel: { en: 'Please provide your consent and declaration for the scheme', hi: 'कृपया योजना के लिए अपनी सहमति और घोषणा दें', te: 'దయచేసి పథకం కోసం మీ సమ్మతి మరియు ప్రకటనను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const SOIL_HEALTH_CARD_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name of Farmer', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'house_no', label: 'House Number', type: 'text',
    voiceLabel: { en: 'What is your house number?', hi: 'आपका घर संख्या क्या है?', te: 'మీ ఇల్లు సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_town', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपना गांव, कस्बा या शहर बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం చెప్పండి' }
  },
  {
    id: 'gram_panchayat', label: 'Gram Panchayat', type: 'text',
    voiceLabel: { en: 'What is your Gram Panchayat name?', hi: 'आपका ग्राम पंचायत नाम क्या है?', te: 'మీ గ్రామ పంచాయతి పేరు ఏమిటి?' }
  },
  {
    id: 'block', label: 'Block / Taluk', type: 'text',
    voiceLabel: { en: 'What is your block or taluk name?', hi: 'आपका ब्लॉक या तालुका नाम क्या है?', te: 'మీ బ్లాక్ లేదా తాలూకా పేరు ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'survey_no', label: 'Land Survey Number/Khata Number', type: 'text',
    voiceLabel: { en: 'What is your land survey number or khata number?', hi: 'आपकी भूमि सर्वेक्षण संख्या या खाता संख्या क्या है?', te: 'మీ భూమి సర్వే సంఖ్య లేదా ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'land_area', label: 'Total Land Area (in acres/hectares)', type: 'text',
    voiceLabel: { en: 'What is the total area of your land?', hi: 'आपकी भूमि का कुल क्षेत्रफल क्या है?', te: 'మీ భూమి యొక్క మొత్తం ప్రాంతం ఎంత?' }
  },
  {
    id: 'land_type', label: 'Type of Land', type: 'text',
    voiceLabel: { en: 'What type of land do you have? Agricultural, barren, etc.?', hi: 'आपके पास किस प्रकार की भूमि है? कृषि, बंजर, आदि?', te: 'మీకు ఏ రకమైన భూమి ఉంది? వ్యవసాయ, బంజర్, మొదలైనవి?' }
  },
  {
    id: 'irrigation_type', label: 'Irrigation Type', type: 'text',
    voiceLabel: { en: 'What type of irrigation do you use? Canal, well, rainwater, etc.?', hi: 'आप किस प्रकार की सिंचाई का उपयोग करते हैं? नहर, कुआं, वर्षा जल, आदि?', te: 'మీరు ఏ రకమైన నీటిపారుదలను ఉపయోగిస్తారు? కాలువ, బావి, వర్షపు నీరు, మొదలైనవి?' }
  },
  {
    id: 'soil_type', label: 'Soil Type (if known)', type: 'text',
    voiceLabel: { en: 'What type of soil do you have?', hi: 'आपके पास किस प्रकार की मिट्टी है?', te: 'మీకు ఏ రకమైన మట్టి ఉంది?' }
  },
  {
    id: 'previous_crop_1', label: 'Previous Crop 1 (Last 3 years)', type: 'text',
    voiceLabel: { en: 'What crop did you grow in the previous year?', hi: 'पिछले वर्ष में आपने कौन सी फसल उगाई?', te: 'మునుపటి సంవత్సరంలో మీరు ఏ పంటను పెంచారు?' }
  },
  {
    id: 'previous_crop_2', label: 'Previous Crop 2 (Last 3 years)', type: 'text',
    voiceLabel: { en: 'What crop did you grow 2 years ago?', hi: '2 साल पहले आपने कौन सी फसल उगाई?', te: '2 సంవత్సరాల క్రితం మీరు ఏ పంటను పెంచారు?' }
  },
  {
    id: 'previous_crop_3', label: 'Previous Crop 3 (Last 3 years)', type: 'text',
    voiceLabel: { en: 'What crop did you grow 3 years ago?', hi: '3 साल पहले आपने कौन सी फसल उगाई?', te: '3 సంవత్సరాల క్రితం మీరు ఏ పంటను పెంచారు?' }
  },
  {
    id: 'current_crop', label: 'Current Crop (if any)', type: 'text',
    voiceLabel: { en: 'What crop are you currently growing?', hi: 'आप वर्तमान में कौन सी फसल उगा रहे हैं?', te: 'మీరు ప్రస్తుతం ఏ పంటను పెంచుతున్నారు?' }
  },
  {
    id: 'sample_collection_date', label: 'Soil Sample Collection Date', type: 'text',
    voiceLabel: { en: 'When was the soil sample collected?', hi: 'मिट्टी का नमूना कब एकत्र किया गया?', te: 'మట్టి నమూనా ఎప్పుడు సేకరించబడింది?' }
  },
  {
    id: 'sample_location', label: 'Soil Sample Location on Farm', type: 'text',
    voiceLabel: { en: 'Where on your farm was the soil sample taken?', hi: 'आपकी खेती में मिट्टी का नमूना कहां से लिया गया?', te: 'మీ పొలంలో మట్టి నమూనా ఎక్కడ నుండి తీసుకోబడింది?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'account_holder_name', label: 'Bank Account Holder Name', type: 'text',
    voiceLabel: { en: 'What is the name of the bank account holder?', hi: 'बैंक खाते के धारक का नाम क्या है?', te: 'బ్యాంక్ ఖాతా హోల్డర్ పేరు ఏమిటి?' }
  },
  {
    id: 'organic_farming', label: 'Do you practice organic farming?', type: 'text',
    voiceLabel: { en: 'Do you practice organic farming?', hi: 'क्या आप जैविक खेती करते हैं?', te: 'మీరు సేంద్రీయ వ్యవసాయం చేస్తారా?' }
  },
  {
    id: 'fertilizer_usage', label: 'Fertilizer Usage Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your fertilizer usage', hi: 'कृपया अपने उर्वरक उपयोग का वर्णन करें', te: 'దయచేసి మీ ఎరువుల వినియోగాన్ని వివరించండి' }
  },
  {
    id: 'pesticide_usage', label: 'Pesticide Usage Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your pesticide usage', hi: 'कृपया अपने कीटनाशक उपयोग का वर्णन करें', te: 'దయచేసి మీ కీటక నాశకాల వినియోగాన్ని వివరించండి' }
  },
  {
    id: 'water_source', label: 'Source of Irrigation Water', type: 'text',
    voiceLabel: { en: 'What is the source of your irrigation water?', hi: 'आपकी सिंचाई जल का स्रोत क्या है?', te: 'మీ నీటిపారుదల నీటి మూలం ఏమిటి?' }
  },
  {
    id: 'previous_soil_test', label: 'Previous Soil Test Details', type: 'textarea',
    voiceLabel: { en: 'Have you done soil testing before? Please provide details', hi: 'क्या आपने पहले मिट्टी परीक्षण करवाया है? कृपया विवरण दें', te: 'మీరు ఇంతకు ముందు మట్టి పరీక్ష చేయించారా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const KISAN_CREDIT_CARD_FIELDS: ServiceField[] = [
  {
    id: 'full_name', label: 'Full Name of Farmer', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste_category', label: 'Caste Category', type: 'text',
    voiceLabel: { en: 'What is your caste category? SC, ST, OBC, or General?', hi: 'आपकी जाति श्रेणी क्या है? अनुसूचित जाति, अनुसूचित जनजाति, अन्य पिछड़ा वर्ग, या सामान्य?', te: 'మీ జాతి వర్గం ఏమిటి? SC, ST, OBC లేదా సాధారణ?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number (if available)', type: 'text',
    voiceLabel: { en: 'What is your PAN number if available?', hi: 'यदि उपलब्ध हो तो आपका पैन नंबर क्या है?', te: 'అందుబాటులో ఉంటే మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'voter_id', label: 'Voter ID Number', type: 'text',
    voiceLabel: { en: 'What is your Voter ID number?', hi: 'आपका वोटर आईडी नंबर क्या है?', te: 'మీ ఓటర్ ఐడి సంఖ్య ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'house_no', label: 'House Number', type: 'text',
    voiceLabel: { en: 'What is your house number?', hi: 'आपका घर संख्या क्या है?', te: 'మీ ఇల్లు సంఖ్య ఏమిటి?' }
  },
  {
    id: 'street_area', label: 'Street / Area / Locality', type: 'text',
    voiceLabel: { en: 'Tell me your street, area or locality', hi: 'अपनी गली, क्षेत्र या इलाका बताएं', te: 'మీ వీధి, ప్రాంతం లేదా ప్రాంతాన్ని చెప్పండి' }
  },
  {
    id: 'village_town', label: 'Village / Town / City', type: 'text',
    voiceLabel: { en: 'Tell me your village, town or city', hi: 'अपना गांव, कस्बा या शहर बताएं', te: 'మీ గ్రామం, పట్టణం లేదా నగరం చెప్పండి' }
  },
  {
    id: 'gram_panchayat', label: 'Gram Panchayat', type: 'text',
    voiceLabel: { en: 'What is your Gram Panchayat name?', hi: 'आपका ग्राम पंचायत नाम क्या है?', te: 'మీ గ్రామ పంచాయతి పేరు ఏమిటి?' }
  },
  {
    id: 'block', label: 'Block / Taluk', type: 'text',
    voiceLabel: { en: 'What is your block or taluk name?', hi: 'आपका ब्लॉक या तालुका नाम क्या है?', te: 'మీ బ్లాక్ లేదా తాలూకా పేరు ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'land_holding', label: 'Total Land Holding (in acres)', type: 'text',
    voiceLabel: { en: 'What is your total land holding in acres?', hi: 'आपकी कुल भूमि होल्डिंग एकड़ में कितनी है?', te: 'మీ మొత్తం భూమి హోల్డింగ్ ఎకరాలలో ఎంత?' }
  },
  {
    id: 'owned_land', label: 'Owned Land Area (in acres)', type: 'text',
    voiceLabel: { en: 'How much land do you own?', hi: 'आपके पास कितनी भूमि है?', te: 'మీకు ఎంత భూమి ఉంది?' }
  },
  {
    id: 'leased_land', label: 'Leased Land Area (in acres)', type: 'text',
    voiceLabel: { en: 'How much land do you lease?', hi: 'आप कितनी भूमि पट्टे पर लेते हैं?', te: 'మీరు ఎంత భూమిని అద్దెకు తీసుకుంటారు?' }
  },
  {
    id: 'survey_numbers', label: 'Survey/Khata Numbers', type: 'textarea',
    voiceLabel: { en: 'What are your land survey or khata numbers?', hi: 'आपकी भूमि सर्वेक्षण या खाता संख्याएं क्या हैं?', te: 'మీ భూమి సర్వే లేదా ఖాతా సంఖ్యలు ఏమిటి?' }
  },
  {
    id: 'main_crop', label: 'Main Crop Grown', type: 'text',
    voiceLabel: { en: 'What is your main crop?', hi: 'आपकी मुख्य फसल क्या है?', te: 'మీ ప్రధాన పంట ఏమిటి?' }
  },
  {
    id: 'secondary_crops', label: 'Secondary Crops (if any)', type: 'textarea',
    voiceLabel: { en: 'What secondary crops do you grow?', hi: 'आप कौन सी द्वितीयक फसलें उगाते हैं?', te: 'మీరు ఏ ద్వితీయ పంటలను పెంచుతారు?' }
  },
  {
    id: 'irrigation_type', label: 'Irrigation Type', type: 'text',
    voiceLabel: { en: 'What type of irrigation do you use?', hi: 'आप किस प्रकार की सिंचाई का उपयोग करते हैं?', te: 'మీరు ఏ రకమైన నీటిపారుదలను ఉపయోగిస్తారు?' }
  },
  {
    id: 'livestock_details', label: 'Livestock Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any livestock? Please provide details', hi: 'क्या आपके पास कोई पशुधन है? कृपया विवरण दें', te: 'మీకు ఏదైనా పశువులు ఉన్నాయా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'equipment_owned', label: 'Agricultural Equipment Owned', type: 'textarea',
    voiceLabel: { en: 'What agricultural equipment do you own?', hi: 'आपके पास कौन से कृषि उपकरण हैं?', te: 'మీకు ఏ వ్యవసాయ సామాగ్రులు ఉన్నాయి?' }
  },
  {
    id: 'annual_income', label: 'Annual Income from Agriculture (₹)', type: 'text',
    voiceLabel: { en: 'What is your annual income from agriculture?', hi: 'कृषि से आपकी वार्षिक आय क्या है?', te: 'వ్యవసాయం నుండి మీ వార్షిక ఆదాయం ఎంత?' }
  },
  {
    id: 'other_income_sources', label: 'Other Income Sources', type: 'textarea',
    voiceLabel: { en: 'Do you have any other sources of income?', hi: 'क्या आपके पास आय के अन्य स्रोत हैं?', te: 'మీకు ఆదాయం యొక్క ఇతర మూలాలు ఉన్నాయా?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'branch_name', label: 'Bank Branch Name', type: 'text',
    voiceLabel: { en: 'What is your bank branch name?', hi: 'आपके बैंक की शाखा का नाम क्या है?', te: 'మీ బ్యాంక్ బ్రాంచ్ పేరు ఏమిటి?' }
  },
  {
    id: 'account_holder_name', label: 'Bank Account Holder Name', type: 'text',
    voiceLabel: { en: 'What is the name of the bank account holder?', hi: 'बैंक खाते के धारक का नाम क्या है?', te: 'బ్యాంక్ ఖాతా హోల్డర్ పేరు ఏమిటి?' }
  },
  {
    id: 'previous_loans', label: 'Previous Loan Details', type: 'textarea',
    voiceLabel: { en: 'Have you taken any loans before? Please provide details', hi: 'क्या आपने पहले कोई ऋण लिया है? कृपया विवरण दें', te: 'మీరు ఇంతకు ముందు ఏదైనా ఋణాలు తీసుకున్నారా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'credit_limit_required', label: 'Credit Limit Required (₹)', type: 'text',
    voiceLabel: { en: 'What credit limit do you require?', hi: 'आपको कितनी क्रेडिट लिमिट चाहिए?', te: 'మీకు ఎంత క్రెడిట్ పరిమితి కావాలి?' }
  },
  {
    id: 'purpose_of_loan', label: 'Purpose of Loan', type: 'textarea',
    voiceLabel: { en: 'What is the purpose of the loan?', hi: 'ऋण का उद्देश्य क्या है?', te: 'ఋణం యొక్క ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'repayment_capacity', label: 'Repayment Capacity Assessment', type: 'textarea',
    voiceLabel: { en: 'Please describe your repayment capacity', hi: 'कृपया अपनी चुकौती क्षमता का वर्णन करें', te: 'దయచేసి మీ చెల్లింపు సామర్థ్యాన్ని వివరించండి' }
  },
  {
    id: 'guarantor_details', label: 'Guarantor Details (if required)', type: 'textarea',
    voiceLabel: { en: 'Please provide guarantor details if required', hi: 'यदि आवश्यक हो तो गारंटर का विवरण दें', te: 'కావాలంటే గ్యారెంటర్ వివరాలను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const PESTICIDE_LICENSE_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_no', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ పాన్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'phone', label: 'Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' }
  },
  {
    id: 'email', label: 'Email ID', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'business_name', label: 'Business/Shop Name', type: 'text',
    voiceLabel: { en: 'What is the name of your business or shop?', hi: 'आपके व्यवसाय या दुकान का नाम क्या है?', te: 'మీ వ్యాపారం లేదా దుకాణం పేరు ఏమిటి?' }
  },
  {
    id: 'business_type', label: 'Type of Business', type: 'text',
    voiceLabel: { en: 'What type of business do you run? Retail, Wholesale, Manufacturing?', hi: 'आप किस प्रकार का व्यवसाय चलाते हैं? खुदरा, थोक, निर्माण?', te: 'మీరు ఏ రకమైన వ్యాపారం నడుపుతారు? రిటైల్, వోల్‌సేల్, తయారీ?' }
  },
  {
    id: 'license_type', label: 'Type of Pesticide License Required', type: 'text',
    voiceLabel: { en: 'What type of pesticide license do you need?', hi: 'आपको किस प्रकार का कीटनाशक लाइसेंस चाहिए?', te: 'మీకు ఏ రకమైన కీటక నాశక లైసెన్స్ కావాలి?' }
  },
  {
    id: 'shop_address', label: 'Complete Shop/Business Address', type: 'textarea',
    voiceLabel: { en: 'What is the complete address of your shop or business?', hi: 'आपकी दुकान या व्यवसाय का पूरा पता क्या है?', te: 'మీ దుకాణం లేదా వ్యాపారం యొక్క పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'district', label: 'District', type: 'text',
    voiceLabel: { en: 'What is your district?', hi: 'आपका जिला कौन सा है?', te: 'మీ జిల్లా ఏమిటి?' }
  },
  {
    id: 'state', label: 'State', type: 'text',
    voiceLabel: { en: 'What is your state?', hi: 'आपका राज्य कौन सा है?', te: 'మీ రాష్ట్రం ఏమిటి?' }
  },
  {
    id: 'pincode', label: 'PIN Code', type: 'text',
    voiceLabel: { en: 'What is your PIN code?', hi: 'आपका पिन कोड क्या है?', te: 'మీ పిన్ కోడ్ ఏమిటి?' }
  },
  {
    id: 'gst_no', label: 'GST Number (if applicable)', type: 'text',
    voiceLabel: { en: 'What is your GST number if applicable?', hi: 'यदि लागू हो तो आपका GST नंबर क्या है?', te: 'వర్తిస్తే మీ GST సంఖ్య ఏమిటి?' }
  },
  {
    id: 'educational_qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your educational qualification?', hi: 'आपकी शैक्षिक योग्यता क्या है?', te: 'మీ విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'technical_qualification', label: 'Technical Qualification in Pesticides', type: 'textarea',
    voiceLabel: { en: 'Do you have any technical qualification related to pesticides?', hi: 'क्या आपके पास कीटनाशकों से संबंधित कोई तकनीकी योग्यता है?', te: 'మీకు కీటక నాశకాలకు సంబంధించిన ఏదైనా సాంకేతిక అర్హత ఉందా?' }
  },
  {
    id: 'experience_years', label: 'Years of Experience', type: 'number',
    voiceLabel: { en: 'How many years of experience do you have?', hi: 'आपके पास कितने साल का अनुभव है?', te: 'మీకు ఎంత సంవత్సరాల అనుభవం ఉంది?' }
  },
  {
    id: 'experience_details', label: 'Experience Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your experience in pesticide handling', hi: 'कृपया कीटनाशक संभालने में अपने अनुभव का वर्णन करें', te: 'దయచేసి కీటక నాశకాల నిర్వహణలో మీ అనుభవాన్ని వివరించండి' }
  },
  {
    id: 'storage_facility', label: 'Storage Facility Details', type: 'textarea',
    voiceLabel: { en: 'Please describe your storage facilities for pesticides', hi: 'कृपया कीटनाशकों के लिए अपनी भंडारण सुविधाओं का वर्णन करें', te: 'దయచేసి కీటక నాశకాల కోసం మీ నిల్వ సౌకర్యాలను వివరించండి' }
  },
  {
    id: 'storage_area', label: 'Storage Area (in sq ft)', type: 'text',
    voiceLabel: { en: 'What is the area of your storage facility?', hi: 'आपकी भंडारण सुविधा का क्षेत्रफल क्या है?', te: 'మీ నిల్వ సౌకర్యం యొక్క ప్రాంతం ఎంత?' }
  },
  {
    id: 'pesticides_to_deal', label: 'Types of Pesticides to Deal With', type: 'textarea',
    voiceLabel: { en: 'What types of pesticides do you plan to deal with?', hi: 'आप किस प्रकार के कीटनाशकों से निपटने की योजना बना रहे हैं?', te: 'మీరు ఏ రకమైన కీటక నాశకాలతో వ్యవహరించాలని ప్లాన్ చేస్తున్నారు?' }
  },
  {
    id: 'annual_turnover', label: 'Expected Annual Turnover (₹)', type: 'text',
    voiceLabel: { en: 'What is your expected annual turnover?', hi: 'आपका अपेक्षित वार्षिक टर्नओवर क्या है?', te: 'మీ ఆశించిన వార్షిక టర్నోవర్ ఎంత?' }
  },
  {
    id: 'bank_account_no', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'Bank IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ యొక్క IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'previous_license', label: 'Previous Pesticide License Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any previous pesticide license? Please provide details', hi: 'क्या आपके पास कोई पिछला कीटनाशक लाइसेंस है? कृपया विवरण दें', te: 'మీకు ఏదైనా మునుపటి కీటక నాశక లైసెన్స్ ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'training_certificates', label: 'Training Certificates', type: 'textarea',
    voiceLabel: { en: 'Do you have any training certificates related to pesticides?', hi: 'क्या आपके पास कीटनाशकों से संबंधित कोई प्रशिक्षण प्रमाणपत्र हैं?', te: 'మీకు కీటక నాశకాలకు సంబంధించిన ఏదైనా శిక్షణ ధృవీకరణ పత్రాలు ఉన్నాయా?' }
  },
  {
    id: 'safety_measures', label: 'Safety Measures for Storage', type: 'textarea',
    voiceLabel: { en: 'What safety measures do you have for pesticide storage?', hi: 'कीटनाशक भंडारण के लिए आपके पास क्या सुरक्षा उपाय हैं?', te: 'కీటక నాశక నిల్వ కోసం మీకు ఏ భద్రతా చర్యలు ఉన్నాయి?' }
  },
  {
    id: 'waste_disposal', label: 'Waste Disposal Method', type: 'textarea',
    voiceLabel: { en: 'How do you dispose of pesticide waste?', hi: 'आप कीटनाशक अपशिष्ट का निपटान कैसे करते हैं?', te: 'మీరు కీటక నాశక వ్యర్థాలను ఎలా తీసివేస్తారు?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const LEGAL_HEIR_CERTIFICATE_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'Please tell me your full name', hi: 'कृपया अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' }
  },
  {
    id: 'applicant_relationship', label: 'Relationship with Deceased', type: 'text',
    voiceLabel: { en: 'What is your relationship with the deceased person?', hi: 'मृतक व्यक्ति से आपका क्या संबंध है?', te: 'మృతదేహి వ్యక్తితో మీ సంబంధం ఏమిటి?' }
  },
  {
    id: 'applicant_address', label: 'Applicant Address', type: 'textarea',
    voiceLabel: { en: 'What is your complete address?', hi: 'आपका पूरा पता क्या है?', te: 'మీ పూర్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_phone', label: 'Applicant Phone Number', type: 'tel',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_email', label: 'Applicant Email ID (Optional)', type: 'email',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఈమెయిల్ అడ్రస్ ఏమిటి?' }
  },
  {
    id: 'applicant_aadhaar', label: 'Applicant Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'deceased_name', label: 'Full Name of Deceased Person', type: 'text',
    voiceLabel: { en: 'What is the full name of the deceased person?', hi: 'मृतक व्यक्ति का पूरा नाम क्या है?', te: 'మృతదేహి వ్యక్తి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_father_name', label: "Deceased Person's Father's Name", type: 'text',
    voiceLabel: { en: "What was the deceased person's father's name?", hi: 'मृतक व्यक्ति के पिता का नाम क्या था?', te: 'మృతదేహి వ్యక్తి తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_dob', label: 'Date of Birth of Deceased', type: 'text',
    voiceLabel: { en: 'What was the date of birth of the deceased person?', hi: 'मृतक व्यक्ति की जन्म तिथि क्या थी?', te: 'మృతదేహి వ్యక్తి పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'deceased_dod', label: 'Date of Death', type: 'text',
    voiceLabel: { en: 'What was the date of death?', hi: 'मृत्यु की तिथि क्या थी?', te: 'మరణం తేదీ ఏమిటి?' }
  },
  {
    id: 'place_of_death', label: 'Place of Death', type: 'text',
    voiceLabel: { en: 'Where did the death occur?', hi: 'मृत्यु कहां हुई?', te: 'మరణం ఎక్కడ జరిగింది?' }
  },
  {
    id: 'deceased_address', label: 'Last Address of Deceased', type: 'textarea',
    voiceLabel: { en: 'What was the last address of the deceased person?', hi: 'मृतक व्यक्ति का अंतिम पता क्या था?', te: 'మృతదేహి వ్యక్తి చివరి చిరునామా ఏమిటి?' }
  },
  {
    id: 'death_certificate_no', label: 'Death Certificate Number', type: 'text',
    voiceLabel: { en: 'What is the death certificate number?', hi: 'मृत्यु प्रमाण पत्र संख्या क्या है?', te: 'మరణ ధృవీకరణ పత్రం సంఖ్య ఏమిటి?' }
  },
  {
    id: 'death_certificate_date', label: 'Death Certificate Issue Date', type: 'text',
    voiceLabel: { en: 'When was the death certificate issued?', hi: 'मृत्यु प्रमाण पत्र कब जारी किया गया?', te: 'మరణ ధృవీకరణ పత్రం ఎప్పుడు జారీ చేయబడింది?' }
  },
  {
    id: 'issuing_authority', label: 'Issuing Authority of Death Certificate', type: 'text',
    voiceLabel: { en: 'Which authority issued the death certificate?', hi: 'मृत्यु प्रमाण पत्र किस अधिकारी ने जारी किया?', te: 'మరణ ధృవీకరణ పత్రాన్ని ఏ అధికారి జారీ చేసారు?' }
  },
  {
    id: 'marital_status_deceased', label: 'Marital Status of Deceased', type: 'text',
    voiceLabel: { en: 'What was the marital status of the deceased?', hi: 'मृतक की वैवाहिक स्थिति क्या थी?', te: 'మృతదేహి వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'spouse_name', label: 'Name of Spouse (if applicable)', type: 'text',
    voiceLabel: { en: 'What was the name of the spouse if applicable?', hi: 'यदि लागू हो तो जीवनसाथी का नाम क्या था?', te: 'వర్తిస్తే జీవిత భాగస్వామి పేరు ఏమిటి?' }
  },
  {
    id: 'number_of_children', label: 'Number of Children', type: 'number',
    voiceLabel: { en: 'How many children did the deceased have?', hi: 'मृतक के कितने बच्चे थे?', te: 'మృతదేహికి ఎంతమంది పిల్లలు ఉన్నారు?' }
  },
  {
    id: 'children_details', label: 'Children Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of all children including names, ages, and genders', hi: 'कृपया सभी बच्चों का विवरण दें जिसमें नाम, आयु और लिंग शामिल हैं', te: 'దయచేసి అన్ని పిల్లల వివరాలను అందించండి పేర్లు, వయస్సులు మరియు లింగాలతో సహా' }
  },
  {
    id: 'parents_details', label: 'Parents Details (if applicable)', type: 'textarea',
    voiceLabel: { en: 'Please provide details of parents if they are alive', hi: 'यदि जीवित हैं तो माता-पिता का विवरण दें', te: 'జీవించి ఉంటే తల్లిదండ్రుల వివరాలను అందించండి' }
  },
  {
    id: 'siblings_details', label: 'Siblings Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of brothers and sisters', hi: 'कृपया भाइयों और बहनों का विवरण दें', te: 'దయచేసి సోదరులు మరియు సోదరీమణుల వివరాలను అందించండి' }
  },
  {
    id: 'other_relatives', label: 'Other Legal Heirs/Relatives', type: 'textarea',
    voiceLabel: { en: 'Are there any other legal heirs or relatives?', hi: 'क्या कोई अन्य कानूनी वारिस या रिश्तेदार हैं?', te: 'ఏదైనా ఇతర చట్టపరమైన వారసులు లేదా బంధువులు ఉన్నారా?' }
  },
  {
    id: 'property_details', label: 'Property/Assets Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of property or assets to be inherited', hi: 'कृपया उत्तराधिकार में मिलने वाली संपत्ति या परिसंपत्तियों का विवरण दें', te: 'దయచేసి వారసత్వంలో వచ్చే ఆస్తి లేదా ఆస్తుల వివరాలను అందించండి' }
  },
  {
    id: 'bank_accounts', label: 'Bank Accounts Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of bank accounts held by the deceased', hi: 'कृपया मृतक द्वारा रखे गए बैंक खातों का विवरण दें', te: 'దయచేసి మృతదేహి చేత ఉంచబడిన బ్యాంక్ ఖాతాల వివరాలను అందించండి' }
  },
  {
    id: 'will_details', label: 'Will/Testament Details (if any)', type: 'textarea',
    voiceLabel: { en: 'Was there any will or testament? Please provide details', hi: 'क्या कोई वसीयत या वसीयतनामा था? कृपया विवरण दें', te: 'ఏదైనా విల్ లేదా వసీయత్ ఉందా? దయచేసి వివరాలు అందించండి' }
  },
  {
    id: 'court_case_details', label: 'Court Case Details (if any)', type: 'textarea',
    voiceLabel: { en: 'Are there any ongoing court cases related to inheritance?', hi: 'क्या उत्तराधिकार से संबंधित कोई चल रही अदालती मामले हैं?', te: 'వారసత్వానికి సంబంధించిన ఏదైనా కొనసాగుతున్న కోర్టు కేసులు ఉన్నాయా?' }
  },
  {
    id: 'witness_1_name', label: 'First Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the first witness?', hi: 'पहले गवाह का नाम क्या है?', te: 'మొదటి సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'witness_1_address', label: 'First Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the first witness?', hi: 'पहले गवाह का पता क्या है?', te: 'మొదటి సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'witness_1_aadhaar', label: 'First Witness Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the Aadhaar number of the first witness?', hi: 'पहले गवाह का आधार नंबर क्या है?', te: 'మొదటి సాక్షి ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'witness_2_name', label: 'Second Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the second witness?', hi: 'दूसरे गवाह का नाम क्या है?', te: 'రెండవ సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'witness_2_address', label: 'Second Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the second witness?', hi: 'दूसरे गवाह का पता क्या है?', te: 'రెండవ సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'witness_2_aadhaar', label: 'Second Witness Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the Aadhaar number of the second witness?', hi: 'दूसरे गवाह का आधार नंबर क्या है?', te: 'రెండవ సాక్షి ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'purpose_of_certificate', label: 'Purpose of Legal Heir Certificate', type: 'textarea',
    voiceLabel: { en: 'What is the purpose of obtaining this certificate?', hi: 'इस प्रमाण पत्र को प्राप्त करने का उद्देश्य क्या है?', te: 'ఈ ధృవీకరణ పత్రాన్ని పొందే ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'affidavit_details', label: 'Affidavit Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of the affidavit submitted', hi: 'कृपया प्रस्तुत किए गए हलफनामे का विवरण दें', te: 'దయచేసి సమర్పించబడిన హలఫ్‌నామా వివరాలను అందించండి' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const MARRIAGE_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'bride_name', label: 'Full Name of Bride', type: 'text',
    voiceLabel: { en: 'What is the full name of the bride?', hi: 'दुल्हन का पूरा नाम क्या है?', te: 'వధువు పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'bride_father_name', label: "Bride's Father's Name", type: 'text',
    voiceLabel: { en: "What is the bride's father's name?", hi: 'दुल्हन के पिता का नाम क्या है?', te: 'వధువు తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'bride_mother_name', label: "Bride's Mother's Name", type: 'text',
    voiceLabel: { en: "What is the bride's mother's name?", hi: 'दुल्हन की माता का नाम क्या है?', te: 'వధువు తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'bride_dob', label: 'Bride Date of Birth', type: 'text',
    voiceLabel: { en: 'What is the bride date of birth?', hi: 'दुल्हन की जन्म तिथि क्या है?', te: 'వధువు పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'bride_age', label: 'Bride Age', type: 'number',
    voiceLabel: { en: 'What is the bride age?', hi: 'दुल्हन की आयु क्या है?', te: 'వధువు వయస్సు ఎంత?' }
  },
  {
    id: 'bride_religion', label: 'Bride Religion', type: 'text',
    voiceLabel: { en: 'What is the bride religion?', hi: 'दुल्हन का धर्म क्या है?', te: 'వధువు మతం ఏమిటి?' }
  },
  {
    id: 'bride_caste', label: 'Bride Caste', type: 'text',
    voiceLabel: { en: 'What is the bride caste?', hi: 'दुल्हन की जाति क्या है?', te: 'వధువు జాతి ఏమిటి?' }
  },
  {
    id: 'bride_address', label: 'Bride Address', type: 'textarea',
    voiceLabel: { en: 'What is the bride address?', hi: 'दुल्हन का पता क्या है?', te: 'వధువు చిరునామా ఏమిటి?' }
  },
  {
    id: 'bride_aadhaar', label: 'Bride Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the bride Aadhaar number?', hi: 'दुल्हन का आधार नंबर क्या है?', te: 'వధువు ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bride_occupation', label: 'Bride Occupation', type: 'text',
    voiceLabel: { en: 'What is the bride occupation?', hi: 'दुल्हन का व्यवसाय क्या है?', te: 'వధువు వృత్తి ఏమిటి?' }
  },
  {
    id: 'groom_name', label: 'Full Name of Groom', type: 'text',
    voiceLabel: { en: 'What is the full name of the groom?', hi: 'दूल्हे का पूरा नाम क्या है?', te: 'వరుడు పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'groom_father_name', label: "Groom's Father's Name", type: 'text',
    voiceLabel: { en: "What is the groom's father's name?", hi: 'दूल्हे के पिता का नाम क्या है?', te: 'వరుడు తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'groom_mother_name', label: "Groom's Mother's Name", type: 'text',
    voiceLabel: { en: "What is the groom's mother's name?", hi: 'दूल्हे की माता का नाम क्या है?', te: 'వరుడు తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'groom_dob', label: 'Groom Date of Birth', type: 'text',
    voiceLabel: { en: 'What is the groom date of birth?', hi: 'दूल्हे की जन्म तिथि क्या है?', te: 'వరుడు పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'groom_age', label: 'Groom Age', type: 'number',
    voiceLabel: { en: 'What is the groom age?', hi: 'दूल्हे की आयु क्या है?', te: 'వరుడు వయస్సు ఎంత?' }
  },
  {
    id: 'groom_religion', label: 'Groom Religion', type: 'text',
    voiceLabel: { en: 'What is the groom religion?', hi: 'दूल्हे का धर्म क्या है?', te: 'వరుడు మతం ఏమిటి?' }
  },
  {
    id: 'groom_caste', label: 'Groom Caste', type: 'text',
    voiceLabel: { en: 'What is the groom caste?', hi: 'दूल्हे की जाति क्या है?', te: 'వరుడు జాతి ఏమిటి?' }
  },
  {
    id: 'groom_address', label: 'Groom Address', type: 'textarea',
    voiceLabel: { en: 'What is the groom address?', hi: 'दूल्हे का पता क्या है?', te: 'వరుడు చిరునామా ఏమిటి?' }
  },
  {
    id: 'groom_aadhaar', label: 'Groom Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is the groom Aadhaar number?', hi: 'दूल्हे का आधार नंबर क्या है?', te: 'వరుడు ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'groom_occupation', label: 'Groom Occupation', type: 'text',
    voiceLabel: { en: 'What is the groom occupation?', hi: 'दूल्हे का व्यवसाय क्या है?', te: 'వరుడు వృత్తి ఏమిటి?' }
  },
  {
    id: 'marriage_date', label: 'Date of Marriage', type: 'text',
    voiceLabel: { en: 'What is the date of marriage?', hi: 'विवाह की तिथि क्या है?', te: 'వివాహం తేదీ ఏమిటి?' }
  },
  {
    id: 'marriage_time', label: 'Time of Marriage', type: 'text',
    voiceLabel: { en: 'What is the time of marriage?', hi: 'विवाह का समय क्या है?', te: 'వివాహం సమయం ఏమిటి?' }
  },
  {
    id: 'marriage_place', label: 'Place of Marriage', type: 'textarea',
    voiceLabel: { en: 'What is the place of marriage?', hi: 'विवाह का स्थान क्या है?', te: 'వివాహం స్థలం ఏమిటి?' }
  },
  {
    id: 'marriage_type', label: 'Type of Marriage', type: 'text',
    voiceLabel: { en: 'What type of marriage is it? Hindu, Muslim, Christian, etc.?', hi: 'यह किस प्रकार का विवाह है? हिंदू, मुस्लिम, ईसाई, आदि?', te: 'ఇది ఏ రకమైన వివాహం? హిందూ, ముస్లిం, క్రైస్తవ, మొదలైనవి?' }
  },
  {
    id: 'marriage_act', label: 'Marriage under Special Marriage Act?', type: 'text',
    voiceLabel: { en: 'Is this marriage under Special Marriage Act?', hi: 'क्या यह विशेष विवाह अधिनियम के तहत विवाह है?', te: 'ఇది స్పెషల్ మ్యారేజ్ యాక్ట్ కింద వివాహమా?' }
  },
  {
    id: 'witness_1_name', label: 'First Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the first witness?', hi: 'पहले गवाह का नाम क्या है?', te: 'మొదటి సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'witness_1_address', label: 'First Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the first witness?', hi: 'पहले गवाह का पता क्या है?', te: 'మొదటి సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'witness_1_relation', label: 'First Witness Relation to Bride/Groom', type: 'text',
    voiceLabel: { en: 'What is the relation of the first witness to bride or groom?', hi: 'पहले गवाह का दुल्हन या दूल्हे से क्या संबंध है?', te: 'మొదటి సాక్షి వధువు లేదా వరుడితో సంబంధం ఏమిటి?' }
  },
  {
    id: 'witness_2_name', label: 'Second Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the second witness?', hi: 'दूसरे गवाह का नाम क्या है?', te: 'రెండవ సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'witness_2_address', label: 'Second Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the second witness?', hi: 'दूसरे गवाह का पता क्या है?', te: 'రెండవ సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'witness_2_relation', label: 'Second Witness Relation to Bride/Groom', type: 'text',
    voiceLabel: { en: 'What is the relation of the second witness to bride or groom?', hi: 'दूसरे गवाह का दुल्हन या दूल्हे से क्या संबंध है?', te: 'రెండవ సాక్షి వధువు లేదా వరుడితో సంబంధం ఏమిటి?' }
  },
  {
    id: 'priest_pandit_name', label: 'Name of Priest/Pandit/Officiant', type: 'text',
    voiceLabel: { en: 'What is the name of the priest or pandit who performed the marriage?', hi: 'विवाह संपन्न करने वाले पुजारी या पंडित का नाम क्या है?', te: 'వివాహం నిర్వహించిన పూజారి లేదా పండిట్ పేరు ఏమిటి?' }
  },
  {
    id: 'priest_address', label: 'Priest/Pandit Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the priest or pandit?', hi: 'पुजारी या पंडित का पता क्या है?', te: 'పూజారి లేదా పండిట్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'bride_age_proof', label: 'Bride Age Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as age proof for the bride?', hi: 'दुल्हन के लिए आप कौन सा दस्तावेज़ आयु प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'వధువు కోసం మీరు ఏ డాక్యుమెంట్‌ను వయస్సు నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'groom_age_proof', label: 'Groom Age Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as age proof for the groom?', hi: 'दूल्हे के लिए आप कौन सा दस्तावेज़ आयु प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'వరుడు కోసం మీరు ఏ డాక్యుమెంట్‌ను వయస్సు నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'bride_address_proof', label: 'Bride Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof for the bride?', hi: 'दुल्हन के लिए आप कौन सा दस्तावेज़ पता प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'వధువు కోసం మీరు ఏ డాక్యుమెంట్‌ను చిరునామా నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'groom_address_proof', label: 'Groom Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof for the groom?', hi: 'दूल्हे के लिए आप कौन सा दस्तावेज़ पता प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'వరుడు కోసం మీరు ఏ డాక్యుమెంట్‌ను చిరునామా నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'bride_photo', label: 'Bride Photograph Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted the bride photograph?', hi: 'क्या आपने दुल्हन की फोटो जमा की है?', te: 'మీరు వధువు ఫోటో సమర్పించారా?' }
  },
  {
    id: 'groom_photo', label: 'Groom Photograph Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted the groom photograph?', hi: 'क्या आपने दूल्हे की फोटो जमा की है?', te: 'మీరు వరుడు ఫోటో సమర్పించారా?' }
  },
  {
    id: 'consent_bride', label: 'Bride Consent Declaration', type: 'textarea',
    voiceLabel: { en: 'Please provide the bride consent declaration', hi: 'कृपया दुल्हन की सहमति घोषणा दें', te: 'దయచేసి వధువు సమ్మతి ప్రకటనను అందించండి' }
  },
  {
    id: 'consent_groom', label: 'Groom Consent Declaration', type: 'textarea',
    voiceLabel: { en: 'Please provide the groom consent declaration', hi: 'कृपया दूल्हे की सहमति घोषणा दें', te: 'దయచేసి వరుడు సమ్మతి ప్రకటనను అందించండి' }
  },
  {
    id: 'registration_date', label: 'Date of Registration Application', type: 'text',
    voiceLabel: { en: 'What is the date of registration application?', hi: 'पंजीकरण आवेदन की तिथि क्या है?', te: 'నమోదు అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const DEATH_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'deceased_name', label: 'Full Name of Deceased Person', type: 'text',
    voiceLabel: { en: 'What is the full name of the deceased person?', hi: 'मृतक व्यक्ति का पूरा नाम क्या है?', te: 'మరణించిన వ్యక్తి పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_father_name', label: "Deceased Person's Father's Name", type: 'text',
    voiceLabel: { en: "What is the deceased person's father's name?", hi: 'मृतक व्यक्ति के पिता का नाम क्या है?', te: 'మరణించిన వ్యక్తి తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_mother_name', label: "Deceased Person's Mother's Name", type: 'text',
    voiceLabel: { en: "What is the deceased person's mother's name?", hi: 'मृतक व्यक्ति की माता का नाम क्या है?', te: 'మరణించిన వ్యక్తి తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_spouse_name', label: "Deceased Person's Spouse Name", type: 'text',
    voiceLabel: { en: "What is the deceased person's spouse name?", hi: 'मृतक व्यक्ति के जीवनसाथी का नाम क्या है?', te: 'మరణించిన వ్యక్తి జీవిత భాగస్వామి పేరు ఏమిటి?' }
  },
  {
    id: 'deceased_dob', label: 'Date of Birth of Deceased', type: 'text',
    voiceLabel: { en: 'What is the date of birth of the deceased person?', hi: 'मृतक व्यक्ति की जन्म तिथि क्या है?', te: 'మరణించిన వ్యక్తి పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'deceased_age', label: 'Age of Deceased at Death', type: 'number',
    voiceLabel: { en: 'What was the age of the deceased person at the time of death?', hi: 'मृत्यु के समय मृतक व्यक्ति की आयु क्या थी?', te: 'మరణం సమయంలో మరణించిన వ్యక్తి వయస్సు ఎంత?' }
  },
  {
    id: 'deceased_gender', label: 'Gender of Deceased', type: 'text',
    voiceLabel: { en: 'What was the gender of the deceased person?', hi: 'मृतक व्यक्ति का लिंग क्या था?', te: 'మరణించిన వ్యక్తి లింగం ఏమిటి?' }
  },
  {
    id: 'deceased_religion', label: 'Religion of Deceased', type: 'text',
    voiceLabel: { en: 'What was the religion of the deceased person?', hi: 'मृतक व्यक्ति का धर्म क्या था?', te: 'మరణించిన వ్యక్తి మతం ఏమిటి?' }
  },
  {
    id: 'deceased_caste', label: 'Caste of Deceased', type: 'text',
    voiceLabel: { en: 'What was the caste of the deceased person?', hi: 'मृतक व्यक्ति की जाति क्या थी?', te: 'మరణించిన వ్యక్తి జాతి ఏమిటి?' }
  },
  {
    id: 'deceased_occupation', label: 'Occupation of Deceased', type: 'text',
    voiceLabel: { en: 'What was the occupation of the deceased person?', hi: 'मृतक व्यक्ति का व्यवसाय क्या था?', te: 'మరణించిన వ్యక్తి వృత్తి ఏమిటి?' }
  },
  {
    id: 'deceased_address', label: 'Permanent Address of Deceased', type: 'textarea',
    voiceLabel: { en: 'What was the permanent address of the deceased person?', hi: 'मृतक व्यक्ति का स्थायी पता क्या था?', te: 'మరణించిన వ్యక్తి శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'deceased_aadhaar', label: 'Aadhaar Number of Deceased', type: 'text',
    voiceLabel: { en: 'What was the Aadhaar number of the deceased person?', hi: 'मृतक व्यक्ति का आधार नंबर क्या था?', te: 'మరణించిన వ్యక్తి ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'death_date', label: 'Date of Death', type: 'text',
    voiceLabel: { en: 'What is the date of death?', hi: 'मृत्यु की तिथि क्या है?', te: 'మరణం తేదీ ఏమిటి?' }
  },
  {
    id: 'death_time', label: 'Time of Death', type: 'text',
    voiceLabel: { en: 'What is the time of death?', hi: 'मृत्यु का समय क्या है?', te: 'మరణం సమయం ఏమిటి?' }
  },
  {
    id: 'death_place', label: 'Place of Death', type: 'textarea',
    voiceLabel: { en: 'What is the place of death?', hi: 'मृत्यु का स्थान क्या है?', te: 'మరణం స్థలం ఏమిటి?' }
  },
  {
    id: 'death_hospital', label: 'Name of Hospital/Medical Center', type: 'text',
    voiceLabel: { en: 'What is the name of the hospital or medical center where death occurred?', hi: 'मृत्यु किस अस्पताल या चिकित्सा केंद्र में हुई?', te: 'మరణం జరిగిన ఆస్పత్రి లేదా వైద్య కేంద్రం పేరు ఏమిటి?' }
  },
  {
    id: 'death_cause', label: 'Cause of Death', type: 'text',
    voiceLabel: { en: 'What was the cause of death?', hi: 'मृत्यु का कारण क्या था?', te: 'మరణం కారణం ఏమిటి?' }
  },
  {
    id: 'death_medical_officer', label: 'Name of Medical Officer/Certifying Doctor', type: 'text',
    voiceLabel: { en: 'What is the name of the medical officer or certifying doctor?', hi: 'चिकित्सा अधिकारी या प्रमाणित करने वाले डॉक्टर का नाम क्या है?', te: 'వైద్య అధికారి లేదా ధృవీకరించే వైద్యుడు పేరు ఏమిటి?' }
  },
  {
    id: 'death_informant_name', label: 'Name of Person Giving Information', type: 'text',
    voiceLabel: { en: 'What is the name of the person giving information about the death?', hi: 'मृत्यु के बारे में जानकारी देने वाले व्यक्ति का नाम क्या है?', te: 'మరణం గురించి సమాచారం ఇచ్చే వ్యక్తి పేరు ఏమిటి?' }
  },
  {
    id: 'death_informant_relation', label: 'Relation of Informant to Deceased', type: 'text',
    voiceLabel: { en: 'What is the relation of the informant to the deceased person?', hi: 'सूचना देने वाले का मृतक व्यक्ति से क्या संबंध है?', te: 'సమాచారం ఇచ్చే వ్యక్తి మరణించిన వ్యక్తితో సంబంధం ఏమిటి?' }
  },
  {
    id: 'death_informant_address', label: 'Address of Informant', type: 'textarea',
    voiceLabel: { en: 'What is the address of the person giving information?', hi: 'सूचना देने वाले व्यक्ति का पता क्या है?', te: 'సమాచారం ఇచ్చే వ్యక్తి చిరునామా ఏమిటి?' }
  },
  {
    id: 'death_informant_phone', label: 'Phone Number of Informant', type: 'text',
    voiceLabel: { en: 'What is the phone number of the person giving information?', hi: 'सूचना देने वाले व्यक्ति का फोन नंबर क्या है?', te: 'సమాచారం ఇచ్చే వ్యక్తి ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'death_witness_1_name', label: 'First Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the first witness?', hi: 'पहले गवाह का नाम क्या है?', te: 'మొదటి సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'death_witness_1_address', label: 'First Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the first witness?', hi: 'पहले गवाह का पता क्या है?', te: 'మొదటి సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'death_witness_1_relation', label: 'First Witness Relation to Deceased', type: 'text',
    voiceLabel: { en: 'What is the relation of the first witness to the deceased?', hi: 'पहले गवाह का मृतक व्यक्ति से क्या संबंध है?', te: 'మొదటి సాక్షి మరణించిన వ్యక్తితో సంబంధం ఏమిటి?' }
  },
  {
    id: 'death_witness_2_name', label: 'Second Witness Name', type: 'text',
    voiceLabel: { en: 'What is the name of the second witness?', hi: 'दूसरे गवाह का नाम क्या है?', te: 'రెండవ సాక్షి పేరు ఏమిటి?' }
  },
  {
    id: 'death_witness_2_address', label: 'Second Witness Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of the second witness?', hi: 'दूसरे गवाह का पता क्या है?', te: 'రెండవ సాక్షి చిరునామా ఏమిటి?' }
  },
  {
    id: 'death_witness_2_relation', label: 'Second Witness Relation to Deceased', type: 'text',
    voiceLabel: { en: 'What is the relation of the second witness to the deceased?', hi: 'दूसरे गवाह का मृतक व्यक्ति से क्या संबंध है?', te: 'రెండవ సాక్షి మరణించిన వ్యక్తితో సంబంధం ఏమిటి?' }
  },
  {
    id: 'death_certificate_type', label: 'Type of Death Certificate', type: 'text',
    voiceLabel: { en: 'What type of death certificate are you applying for?', hi: 'आप किस प्रकार का मृत्यु प्रमाण पत्र के लिए आवेदन कर रहे हैं?', te: 'మీరు ఏ రకమైన మరణం సర్టిఫికేట్ కోసం అప్లై చేస్తున్నారు?' }
  },
  {
    id: 'death_hospital_death', label: 'Was death in hospital?', type: 'text',
    voiceLabel: { en: 'Did the death occur in a hospital?', hi: 'क्या मृत्यु अस्पताल में हुई थी?', te: 'మరణం ఆస్పత్రిలో జరిగిందా?' }
  },
  {
    id: 'death_home_death', label: 'Was death at home?', type: 'text',
    voiceLabel: { en: 'Did the death occur at home?', hi: 'क्या मृत्यु घर पर हुई थी?', te: 'మరణం ఇంట్లో జరిగిందా?' }
  },
  {
    id: 'death_other_place', label: 'If death at other place, specify', type: 'textarea',
    voiceLabel: { en: 'If death occurred at another place, please specify', hi: 'यदि मृत्यु किसी अन्य स्थान पर हुई है तो निर्दिष्ट करें', te: 'మరణం మరో స్థలంలో జరిగి ఉంటే, దయచేసి పేర్కొనండి' }
  },
  {
    id: 'death_medical_attention', label: 'Was medical attention received before death?', type: 'text',
    voiceLabel: { en: 'Was medical attention received before death?', hi: 'मृत्यु से पहले चिकित्सा सहायता प्राप्त हुई थी?', te: 'మరణం ముందు వైద్య సహాయం పొందారా?' }
  },
  {
    id: 'death_pregnancy_related', label: 'Was death pregnancy related?', type: 'text',
    voiceLabel: { en: 'Was the death related to pregnancy?', hi: 'क्या मृत्यु गर्भावस्था से संबंधित थी?', te: 'మరణం గర్భం సంబంధితమా?' }
  },
  {
    id: 'death_age_proof', label: 'Age Proof Document of Deceased', type: 'text',
    voiceLabel: { en: 'What document are you using as age proof for the deceased?', hi: 'मृतक के लिए आप कौन सा दस्तावेज़ आयु प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'మరణించిన వ్యక్తి కోసం మీరు ఏ డాక్యుమెంట్‌ను వయస్సు నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'death_address_proof', label: 'Address Proof Document of Deceased', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof for the deceased?', hi: 'मृतक के लिए आप कौन सा दस्तावेज़ पता प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'మరణించిన వ్యక్తి కోసం మీరు ఏ డాక్యుమెంట్‌ను చిరునామా నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'death_identity_proof', label: 'Identity Proof Document of Deceased', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof for the deceased?', hi: 'मृतक के लिए आप कौन सा दस्तावेज़ पहचान प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'మరణించిన వ్యక్తి కోసం మీరు ఏ డాక్యుమెంట్‌ను గుర్తింపు నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'death_relationship_proof', label: 'Relationship Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as relationship proof?', hi: 'आप कौन सा दस्तावेज़ संबंध प्रमाण के रूप में इस्तेमाल कर रहे हैं?', te: 'మీరు ఏ డాక్యుమెంట్‌ను సంబంధం నిరూపణగా ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'death_medical_certificate', label: 'Medical Certificate of Death Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted the medical certificate of death?', hi: 'क्या आपने मृत्यु का चिकित्सा प्रमाण पत्र जमा किया है?', te: 'మీరు మరణం వైద్య సర్టిఫికేట్ సమర్పించారా?' }
  },
  {
    id: 'death_police_report', label: 'Police Report (if applicable)', type: 'text',
    voiceLabel: { en: 'Do you have a police report for this death?', hi: 'इस मृत्यु के लिए पुलिस रिपोर्ट है?', te: 'ఈ మరణం కోసం మీకు పోలీస్ రిపోర్ట్ ఉందా?' }
  },
  {
    id: 'death_court_order', label: 'Court Order (if applicable)', type: 'text',
    voiceLabel: { en: 'Do you have a court order related to this death?', hi: 'इस मृत्यु से संबंधित अदालत का आदेश है?', te: 'ఈ మరణం సంబంధిత కోర్టు ఆర్డర్ ఉందా?' }
  },
  {
    id: 'registration_date', label: 'Date of Registration Application', type: 'text',
    voiceLabel: { en: 'What is the date of registration application?', hi: 'पंजीकरण आवेदन की तिथि क्या है?', te: 'నమోదు అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const DIGITAL_SIGNATURE_CERT_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_designation', label: 'Designation/Title', type: 'text',
    voiceLabel: { en: 'What is your designation or title?', hi: 'आपका पदनाम या उपाधि क्या है?', te: 'మీ పదవి లేదా శీర్షిక ఏమిటి?' }
  },
  {
    id: 'organization_name', label: 'Organization Name', type: 'text',
    voiceLabel: { en: 'What is the name of your organization?', hi: 'आपके संगठन का नाम क्या है?', te: 'మీ సంస్థ పేరు ఏమిటి?' }
  },
  {
    id: 'organization_type', label: 'Type of Organization', type: 'text',
    voiceLabel: { en: 'What type of organization is it? Private, Government, etc.?', hi: 'यह किस प्रकार का संगठन है? निजी, सरकारी, आदि?', te: 'ఇది ఏ రకమైన సంస్థ? ప్రైవేట్, గవర్నమెంట్, మొదలైనవి?' }
  },
  {
    id: 'organization_address', label: 'Organization Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of your organization?', hi: 'आपके संगठन का पता क्या है?', te: 'మీ సంస్థ చిరునామా ఏమిటి?' }
  },
  {
    id: 'organization_phone', label: 'Organization Phone Number', type: 'text',
    voiceLabel: { en: 'What is the phone number of your organization?', hi: 'आपके संगठन का फोन नंबर क्या है?', te: 'మీ సంస్థ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'organization_email', label: 'Organization Email', type: 'text',
    voiceLabel: { en: 'What is the email address of your organization?', hi: 'आपके संगठन का ईमेल पता क्या है?', te: 'మీ సంస్థ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'dsc_class', label: 'Class of Digital Signature Certificate', type: 'text',
    voiceLabel: { en: 'What class of DSC do you want? Class 1, 2, or 3?', hi: 'आप किस क्लास का डिजिटल सिग्नेचर सर्टिफिकेट चाहते हैं? क्लास 1, 2, या 3?', te: 'మీరు ఏ క్లాస్ DSC కావాలి? క్లాస్ 1, 2, లేదా 3?' }
  },
  {
    id: 'dsc_type', label: 'Type of DSC', type: 'text',
    voiceLabel: { en: 'What type of DSC do you want? Individual, Organization, etc.?', hi: 'आप किस प्रकार का DSC चाहते हैं? व्यक्तिगत, संगठन, आदि?', te: 'మీరు ఏ రకమైన DSC కావాలి? వ్యక్తిగత, సంస్థ, మొదలైనవి?' }
  },
  {
    id: 'validity_period', label: 'Validity Period Required', type: 'text',
    voiceLabel: { en: 'What validity period do you require? 1 year, 2 years, etc.?', hi: 'आपको कितने समय की वैधता चाहिए? 1 साल, 2 साल, आदि?', te: 'మీకు ఎంత కాలం చెల్లుబాటు కావాలి? 1 సంవత్సరం, 2 సంవత్సరాలు, మొదలైనవి?' }
  },
  {
    id: 'applicant_address', label: 'Applicant Address', type: 'textarea',
    voiceLabel: { en: 'What is your address?', hi: 'आपका पता क्या है?', te: 'మీ చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_phone', label: 'Applicant Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_email', label: 'Applicant Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_pan', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_aadhaar', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'applicant_dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'applicant_gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'applicant_nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'photo_proof', label: 'Photograph Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your photograph?', hi: 'क्या आपने अपनी फोटो जमा की है?', te: 'మీరు మీ ఫోటో సమర్పించారా?' }
  },
  {
    id: 'signature_proof', label: 'Signature Specimen Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your signature specimen?', hi: 'क्या आपने अपने हस्ताक्षर का नमूना जमा किया है?', te: 'మీరు మీ సంతకం నమూనా సమర్పించారా?' }
  },
  {
    id: 'certifying_authority', label: 'Preferred Certifying Authority', type: 'text',
    voiceLabel: { en: 'Which certifying authority do you prefer?', hi: 'आप कौन सी प्रमाणन प्राधिकारी को पसंद करते हैं?', te: 'మీరు ఏ ధృవీకరణ అధికారిని ఇష్టపడతారు?' }
  },
  {
    id: 'application_purpose', label: 'Purpose of DSC Application', type: 'textarea',
    voiceLabel: { en: 'What is the purpose of applying for DSC?', hi: 'DSC के लिए आवेदन का उद्देश्य क्या है?', te: 'DSC కోసం అప్లై చేసే ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'token_type', label: 'Type of Token Required', type: 'text',
    voiceLabel: { en: 'What type of token do you require? USB, Hardware, etc.?', hi: 'आपको किस प्रकार का टोकन चाहिए? USB, हार्डवेयर, आदि?', te: 'మీకు ఏ రకమైన టోకెన్ కావాలి? USB, హార్డ్‌వేర్, మొదలైనవి?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'bank_details', label: 'Bank Account Details for Refund', type: 'textarea',
    voiceLabel: { en: 'Please provide your bank account details for refund purposes', hi: 'कृपया रिफंड के लिए अपने बैंक खाते का विवरण दें', te: 'దయచేసి రీఫండ్ కోసం మీ బ్యాంక్ ఖాతా వివరాలను అందించండి' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const DOMAIN_REGISTRATION_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_designation', label: 'Designation/Title', type: 'text',
    voiceLabel: { en: 'What is your designation or title?', hi: 'आपका पदनाम या उपाधि क्या है?', te: 'మీ పదవి లేదా శీర్షిక ఏమిటి?' }
  },
  {
    id: 'organization_name', label: 'Organization Name', type: 'text',
    voiceLabel: { en: 'What is the name of your organization?', hi: 'आपके संगठन का नाम क्या है?', te: 'మీ సంస్థ పేరు ఏమిటి?' }
  },
  {
    id: 'organization_type', label: 'Type of Organization', type: 'text',
    voiceLabel: { en: 'What type of organization is it? Government, Private, NGO, etc.?', hi: 'यह किस प्रकार का संगठन है? सरकारी, निजी, एनजीओ, आदि?', te: 'ఇది ఏ రకమైన సంస్థ? గవర్నమెంట్, ప్రైవేట్, NGO, మొదలైనవి?' }
  },
  {
    id: 'organization_address', label: 'Organization Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of your organization?', hi: 'आपके संगठन का पता क्या है?', te: 'మీ సంస్థ చిరునామా ఏమిటి?' }
  },
  {
    id: 'organization_phone', label: 'Organization Phone Number', type: 'text',
    voiceLabel: { en: 'What is the phone number of your organization?', hi: 'आपके संगठन का फोन नंबर क्या है?', te: 'మీ సంస్థ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'organization_email', label: 'Organization Email', type: 'text',
    voiceLabel: { en: 'What is the email address of your organization?', hi: 'आपके संगठन का ईमेल पता क्या है?', te: 'మీ సంస్థ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'proposed_domain', label: 'Proposed Domain Name', type: 'text',
    voiceLabel: { en: 'What domain name do you want to register?', hi: 'आप कौन सा डोमेन नाम रजिस्टर करना चाहते हैं?', te: 'మీరు ఏ డొమైన్ పేరు నమోదు చేయాలనుకుంటున్నారు?' }
  },
  {
    id: 'domain_extension', label: 'Domain Extension', type: 'text',
    voiceLabel: { en: 'What domain extension do you want? .in, .gov.in, etc.?', hi: 'आप कौन सा डोमेन एक्सटेंशन चाहते हैं? .in, .gov.in, आदि?', te: 'మీరు ఏ డొమైన్ పొడిగింపు కావాలి? .in, .gov.in, మొదలైనవి?' }
  },
  {
    id: 'domain_purpose', label: 'Purpose of Domain Registration', type: 'textarea',
    voiceLabel: { en: 'What is the purpose of registering this domain?', hi: 'इस डोमेन को रजिस्टर करने का उद्देश्य क्या है?', te: 'ఈ డొమైన్‌ను నమోదు చేసే ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'domain_category', label: 'Domain Category', type: 'text',
    voiceLabel: { en: 'What category does this domain fall under?', hi: 'यह डोमेन किस श्रेणी में आता है?', te: 'ఈ డొమైన్ ఏ వర్గంలోకి వస్తుంది?' }
  },
  {
    id: 'registration_period', label: 'Registration Period Required', type: 'text',
    voiceLabel: { en: 'How many years do you want to register the domain for?', hi: 'आप डोमेन को कितने साल के लिए रजिस्टर करना चाहते हैं?', te: 'మీరు డొమైన్‌ను ఎంత సంవత్సరాల పాటు నమోదు చేయాలనుకుంటున్నారు?' }
  },
  {
    id: 'applicant_address', label: 'Applicant Address', type: 'textarea',
    voiceLabel: { en: 'What is your address?', hi: 'आपका पता क्या है?', te: 'మీ చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_phone', label: 'Applicant Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_email', label: 'Applicant Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_pan', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_aadhaar', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'applicant_dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'applicant_gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'applicant_nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'organization_proof', label: 'Organization Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as organization proof?', hi: 'आप संगठन प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు సంస్థ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'authorization_letter', label: 'Authorization Letter Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted the authorization letter?', hi: 'क्या आपने प्राधिकरण पत्र जमा किया है?', te: 'మీరు అధికార పత్రం సమర్పించారా?' }
  },
  {
    id: 'domain_availability', label: 'Domain Availability Checked?', type: 'text',
    voiceLabel: { en: 'Have you checked the availability of the domain name?', hi: 'क्या आपने डोमेन नाम की उपलब्धता की जांच की है?', te: 'మీరు డొమైన్ పేరు లభ్యతను తనిఖీ చేసారా?' }
  },
  {
    id: 'name_servers', label: 'Preferred Name Servers', type: 'textarea',
    voiceLabel: { en: 'What are your preferred name servers?', hi: 'आपके पसंदीदा नेम सर्वर कौन से हैं?', te: 'మీ ప్రాధాన్య నేమ్ సర్వర్లు ఏమిటి?' }
  },
  {
    id: 'admin_contact', label: 'Administrative Contact Details', type: 'textarea',
    voiceLabel: { en: 'Please provide administrative contact details', hi: 'कृपया प्रशासनिक संपर्क विवरण दें', te: 'దయచేసి నిర్వహణ సంప్రదింపు వివరాలను అందించండి' }
  },
  {
    id: 'technical_contact', label: 'Technical Contact Details', type: 'textarea',
    voiceLabel: { en: 'Please provide technical contact details', hi: 'कृपया तकनीकी संपर्क विवरण दें', te: 'దయచేసి సాంకేతిక సంప్రదింపు వివరాలను అందించండి' }
  },
  {
    id: 'billing_contact', label: 'Billing Contact Details', type: 'textarea',
    voiceLabel: { en: 'Please provide billing contact details', hi: 'कृपया बिलिंग संपर्क विवरण दें', te: 'దయచేసి బిల్లింగ్ సంప్రదింపు వివరాలను అందించండి' }
  },
  {
    id: 'privacy_protection', label: 'Privacy Protection Required?', type: 'text',
    voiceLabel: { en: 'Do you require privacy protection for your domain?', hi: 'क्या आपको अपने डोमेन के लिए गोपनीयता सुरक्षा चाहिए?', te: 'మీ డొమైన్ కోసం మీకు గోప్యతా రక్షణ కావాలా?' }
  },
  {
    id: 'dns_hosting', label: 'DNS Hosting Required?', type: 'text',
    voiceLabel: { en: 'Do you require DNS hosting services?', hi: 'क्या आपको DNS होस्टिंग सेवाएं चाहिए?', te: 'మీకు DNS హోస్టింగ్ సేవలు కావాలా?' }
  },
  {
    id: 'ssl_certificate', label: 'SSL Certificate Required?', type: 'text',
    voiceLabel: { en: 'Do you require SSL certificate with the domain?', hi: 'क्या आपको डोमेन के साथ SSL प्रमाण पत्र चाहिए?', te: 'మీకు డొమైన్‌తో SSL సర్టిఫికేట్ కావాలా?' }
  },
  {
    id: 'payment_method', label: 'Preferred Payment Method', type: 'text',
    voiceLabel: { en: 'What is your preferred payment method?', hi: 'आपका पसंदीदा भुगतान विधि क्या है?', te: 'మీ ప్రాధాన్య చెల్లింపు పద్ధతి ఏమిటి?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const ARMS_LICENSE_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_father_name', label: "Applicant's Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_mother_name', label: "Applicant's Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'applicant_age', label: 'Age', type: 'number',
    voiceLabel: { en: 'What is your age?', hi: 'आपकी आयु क्या है?', te: 'మీ వయస్సు ఎంత?' }
  },
  {
    id: 'applicant_gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'applicant_nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'applicant_religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'applicant_caste', label: 'Caste', type: 'text',
    voiceLabel: { en: 'What is your caste?', hi: 'आपकी जाति क्या है?', te: 'మీ జాతి ఏమిటి?' }
  },
  {
    id: 'applicant_occupation', label: 'Occupation', type: 'text',
    voiceLabel: { en: 'What is your occupation?', hi: 'आपका व्यवसाय क्या है?', te: 'మీ వృత్తి ఏమిటి?' }
  },
  {
    id: 'applicant_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_phone', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'applicant_email', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'applicant_aadhaar', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'applicant_pan', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'license_type', label: 'Type of License Required', type: 'text',
    voiceLabel: { en: 'What type of arms license do you require? New, Renewal, etc.?', hi: 'आप किस प्रकार का हथियार लाइसेंस चाहते हैं? नया, नवीनीकरण, आदि?', te: 'మీకు ఏ రకమైన ఆయుధాల లైసెన్స్ కావాలి? కొత్త, పునరుద్ధరణ, మొదలైనవి?' }
  },
  {
    id: 'license_category', label: 'License Category', type: 'text',
    voiceLabel: { en: 'What category of license do you want? Pistol, Rifle, Shotgun, etc.?', hi: 'आप किस श्रेणी का लाइसेंस चाहते हैं? पिस्तौल, राइफल, शॉटगन, आदि?', te: 'మీకు ఏ వర్గం లైసెన్స్ కావాలి? పిస్టల్, రైఫిల్, షాట్‌గన్, మొదలైనవి?' }
  },
  {
    id: 'arms_description', label: 'Description of Arms Required', type: 'textarea',
    voiceLabel: { en: 'Please describe the arms you want to license', hi: 'कृपया उन हथियारों का वर्णन करें जिनका आप लाइसेंस चाहते हैं', te: 'దయచేసి మీరు లైసెన్స్ చేయాలనుకుంటున్న ఆయుధాలను వివరించండి' }
  },
  {
    id: 'arms_quantity', label: 'Quantity of Arms', type: 'number',
    voiceLabel: { en: 'How many arms do you want to license?', hi: 'आप कितने हथियारों का लाइसेंस चाहते हैं?', te: 'మీరు ఎన్ని ఆయుధాలకు లైసెన్స్ కావాలి?' }
  },
  {
    id: 'arms_purpose', label: 'Purpose for Arms License', type: 'textarea',
    voiceLabel: { en: 'What is the purpose for requiring arms license?', hi: 'हथियार लाइसेंस की आवश्यकता का उद्देश्य क्या है?', te: 'ఆయుధాల లైసెన్స్ అవసరం ఉద్దేశ్యం ఏమిటి?' }
  },
  {
    id: 'arms_reason', label: 'Reason for License Application', type: 'textarea',
    voiceLabel: { en: 'What is the reason for applying for arms license?', hi: 'हथियार लाइसेंस के लिए आवेदन करने का कारण क्या है?', te: 'ఆయుధాల లైసెన్స్ కోసం అప్లై చేసే కారణం ఏమిటి?' }
  },
  {
    id: 'previous_license', label: 'Previous License Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any previous arms license? If yes, provide details', hi: 'क्या आपके पास पहले कोई हथियार लाइसेंस है? यदि हाँ, तो विवरण दें', te: 'మీకు గతంలో ఆయుధాల లైసెన్స్ ఉందా? ఉంటే, వివరాలు అందించండి' }
  },
  {
    id: 'criminal_record', label: 'Criminal Record Check', type: 'text',
    voiceLabel: { en: 'Do you have any criminal record?', hi: 'क्या आपके पास कोई आपराधिक रिकॉर्ड है?', te: 'మీకు ఏవైనా నేరపూరిత నమోదు ఉందా?' }
  },
  {
    id: 'mental_health', label: 'Mental Health Certificate', type: 'text',
    voiceLabel: { en: 'Do you have a mental health certificate?', hi: 'क्या आपके पास मानसिक स्वास्थ्य प्रमाण पत्र है?', te: 'మీకు మానసిక ఆరోగ్య సర్టిఫికేట్ ఉందా?' }
  },
  {
    id: 'police_verification', label: 'Police Verification Required?', type: 'text',
    voiceLabel: { en: 'Have you undergone police verification?', hi: 'क्या आपने पुलिस सत्यापन करवाया है?', te: 'మీరు పోలీస్ ధృవీకరణ చేయించుకున్నారా?' }
  },
  {
    id: 'character_certificate', label: 'Character Certificate Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted character certificate?', hi: 'क्या आपने चरित्र प्रमाण पत्र जमा किया है?', te: 'మీరు పాత్ర సర్టిఫికేట్ సమర్పించారా?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'income_proof', label: 'Income Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as income proof?', hi: 'आप आय प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ఆదాయ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'photo_passport', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'thumb_impression', label: 'Thumb Impression Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided thumb impression?', hi: 'क्या आपने अंगूठे का निशान दिया है?', te: 'మీరు అంగుళం ముద్ర తెలిపారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'storage_place', label: 'Place of Storage for Arms', type: 'textarea',
    voiceLabel: { en: 'Where will you store the licensed arms?', hi: 'आप लाइसेंस प्राप्त हथियार कहाँ रखेंगे?', te: 'మీరు లైసెన్స్ పొందిన ఆయుధాలను ఎక్కడ నిల్వ చేస్తారు?' }
  },
  {
    id: 'security_measures', label: 'Security Measures for Storage', type: 'textarea',
    voiceLabel: { en: 'What security measures will you take for storing arms?', hi: 'हथियारों के भंडारण के लिए आप क्या सुरक्षा उपाय करेंगे?', te: 'ఆయుధాల నిల్వ కోసం మీరు ఏ సురక్షా చర్యలు తీసుకుంటారు?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'emergency_relation', label: 'Emergency Contact Relation', type: 'text',
    voiceLabel: { en: 'What is your relation with the emergency contact?', hi: 'आपातकालीन संपर्क से आपका क्या संबंध है?', te: 'అత్యవసర సంప్రదింపుతో మీ సంబంధం ఏమిటి?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const EX_SERVICEMEN_IDENTITY_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Ex-Serviceman', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'service_number', label: 'Service Number', type: 'text',
    voiceLabel: { en: 'What is your service number?', hi: 'आपका सेवा संख्या क्या है?', te: 'మీ సేవా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'rank', label: 'Rank at Retirement', type: 'text',
    voiceLabel: { en: 'What was your rank at the time of retirement?', hi: 'सेवानिवृत्ति के समय आपका रैंक क्या था?', te: 'విరమణ సమయంలో మీ ర్యాంక్ ఏమిటి?' }
  },
  {
    id: 'unit_corps', label: 'Unit/Corps/Regiment', type: 'text',
    voiceLabel: { en: 'What was your unit, corps, or regiment?', hi: 'आपका यूनिट, कोर या रेजिमेंट क्या था?', te: 'మీ యూనిట్, కార్ప్స్ లేదా రెజిమెంట్ ఏమిటి?' }
  },
  {
    id: 'service_type', label: 'Type of Service', type: 'text',
    voiceLabel: { en: 'What type of service did you serve? Army, Navy, Air Force?', hi: 'आपने किस प्रकार की सेवा की? सेना, नौसेना, वायु सेना?', te: 'మీరు ఏ రకమైన సేవ చేసారు? ఆర్మీ, నేవీ, ఎయిర్ ఫోర్స్?' }
  },
  {
    id: 'enrollment_date', label: 'Date of Enrollment', type: 'text',
    voiceLabel: { en: 'What was your date of enrollment?', hi: 'आपकी भर्ती की तिथि क्या थी?', te: 'మీ ఎన్‌రోల్‌మెంట్ తేదీ ఏమిటి?' }
  },
  {
    id: 'retirement_date', label: 'Date of Retirement', type: 'text',
    voiceLabel: { en: 'What was your date of retirement?', hi: 'आपकी सेवानिवृत्ति की तिथि क्या थी?', te: 'మీ విరమణ తేదీ ఏమిటి?' }
  },
  {
    id: 'service_duration', label: 'Total Service Duration', type: 'text',
    voiceLabel: { en: 'What was your total service duration?', hi: 'आपकी कुल सेवा अवधि क्या थी?', te: 'మీ మొత్తం సేవా వ్యవధి ఏమిటి?' }
  },
  {
    id: 'pension_details', label: 'Pension Details', type: 'textarea',
    voiceLabel: { en: 'Please provide your pension details', hi: 'कृपया अपनी पेंशन विवरण दें', te: 'దయచేసి మీ పెన్షన్ వివరాలను అందించండి' }
  },
  {
    id: 'discharge_certificate', label: 'Discharge Certificate Number', type: 'text',
    voiceLabel: { en: 'What is your discharge certificate number?', hi: 'आपका डिस्चार्ज प्रमाण पत्र संख्या क्या है?', te: 'మీ డిస్చార్జ్ సర్టిఫికేట్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'ppo_number', label: 'PPO Number', type: 'text',
    voiceLabel: { en: 'What is your PPO number?', hi: 'आपका पीपीओ संख्या क्या है?', te: 'మీ పిపిఓ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'applicant_dob', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'applicant_age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'applicant_gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'blood_group', label: 'Blood Group', type: 'text',
    voiceLabel: { en: 'What is your blood group?', hi: 'आपका ब्लड ग्रुप क्या है?', te: 'మీ రక్త సమూహం ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'phone_number', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'email_address', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'aadhaar_number', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_number', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'spouse_name', label: "Spouse's Name", type: 'text',
    voiceLabel: { en: "What is your spouse's name?", hi: 'आपके जीवनसाथी का नाम क्या है?', te: 'మీ జీవిత భాగస్వామి పేరు ఏమిటి?' }
  },
  {
    id: 'spouse_dob', label: "Spouse's Date of Birth", type: 'text',
    voiceLabel: { en: "What is your spouse's date of birth?", hi: 'आपके जीवनसाथी की जन्म तिथि क्या है?', te: 'మీ జీవిత భాగస్వామి పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'children_details', label: 'Children Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of your children', hi: 'कृपया अपने बच्चों का विवरण दें', te: 'దయచేసి మీ పిల్లల వివరాలను అందించండి' }
  },
  {
    id: 'next_of_kin', label: 'Next of Kin Details', type: 'textarea',
    voiceLabel: { en: 'Please provide next of kin details', hi: 'कृपया निकटतम संबंधी का विवरण दें', te: 'దయచేసి నికటవర్తి బంధువు వివరాలను అందించండి' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'emergency_relation', label: 'Emergency Contact Relation', type: 'text',
    voiceLabel: { en: 'What is your relation with the emergency contact?', hi: 'आपातकालीन संपर्क से आपका क्या संबंध है?', te: 'అత్యవసర సంప్రదింపుతో మీ సంబంధం ఏమిటి?' }
  },
  {
    id: 'medical_condition', label: 'Medical Condition (if any)', type: 'textarea',
    voiceLabel: { en: 'Do you have any medical condition?', hi: 'क्या आपके पास कोई चिकित्सा स्थिति है?', te: 'మీకు ఏవైనా వైద్య పరిస్థితి ఉందా?' }
  },
  {
    id: 'disability_status', label: 'Disability Status', type: 'text',
    voiceLabel: { en: 'Do you have any disability?', hi: 'क्या आपके पास कोई विकलांगता है?', te: 'మీకు ఏవైనా వైకల్యం ఉందా?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'service_proof', label: 'Service Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as service proof?', hi: 'आप सेवा प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు సేవా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'retirement_proof', label: 'Retirement Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as retirement proof?', hi: 'आप सेवानिवृत्ति प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు విరమణ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'photographs', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'thumb_impression', label: 'Thumb Impression Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided thumb impression?', hi: 'क्या आपने अंगूठे का निशान दिया है?', te: 'మీరు అంగుళం ముద్ర తెలిపారా?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const SENIOR_CITIZEN_CARD_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_father_name', label: "Applicant's Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_mother_name', label: "Applicant's Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'applicant_spouse_name', label: "Applicant's Spouse Name", type: 'text',
    voiceLabel: { en: "What is your spouse's name?", hi: 'आपके जीवनसाथी का नाम क्या है?', te: 'మీ జీవిత భాగస్వామి పేరు ఏమిటి?' }
  },
  {
    id: 'date_of_birth', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste', label: 'Caste', type: 'text',
    voiceLabel: { en: 'What is your caste?', hi: 'आपकी जाति क्या है?', te: 'మీ జాతి ఏమిటి?' }
  },
  {
    id: 'nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'occupation', label: 'Occupation/Profession', type: 'text',
    voiceLabel: { en: 'What is your occupation or profession?', hi: 'आपका व्यवसाय या पेशा क्या है?', te: 'మీ వృత్తి లేదా వృత్తి ఏమిటి?' }
  },
  {
    id: 'monthly_income', label: 'Monthly Income', type: 'text',
    voiceLabel: { en: 'What is your monthly income?', hi: 'आपकी मासिक आय क्या है?', te: 'మీ నెలవారీ ఆదాయం ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'phone_number', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'email_address', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'aadhaar_number', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_number', label: 'PAN Number', type: 'text',
    voiceLabel: { en: 'What is your PAN number?', hi: 'आपका पैन नंबर क्या है?', te: 'మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Details', type: 'textarea',
    voiceLabel: { en: 'Please provide your bank account details', hi: 'कृपया अपने बैंक खाते का विवरण दें', te: 'దయచేసి మీ బ్యాంక్ ఖాతా వివరాలను అందించండి' }
  },
  {
    id: 'pension_details', label: 'Pension Details (if applicable)', type: 'textarea',
    voiceLabel: { en: 'Please provide your pension details if applicable', hi: 'यदि लागू हो तो अपनी पेंशन विवरण दें', te: 'వర్తిస్తే మీ పెన్షన్ వివరాలను అందించండి' }
  },
  {
    id: 'medical_condition', label: 'Medical Condition (if any)', type: 'textarea',
    voiceLabel: { en: 'Do you have any medical condition?', hi: 'क्या आपके पास कोई चिकित्सा स्थिति है?', te: 'మీకు ఏవైనా వైద్య పరిస్థితి ఉందా?' }
  },
  {
    id: 'disability_status', label: 'Disability Status', type: 'text',
    voiceLabel: { en: 'Do you have any disability?', hi: 'क्या आपके पास कोई विकलांगता है?', te: 'మీకు ఏవైనా వైకల్యం ఉందా?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many family members do you have?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎన్ని సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'dependent_family', label: 'Details of Dependent Family Members', type: 'textarea',
    voiceLabel: { en: 'Please provide details of dependent family members', hi: 'कृपया आश्रित परिवार के सदस्यों का विवरण दें', te: 'దయచేసి ఆశ్రిత కుటుంబ సభ్యుల వివరాలను అందించండి' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'age_proof', label: 'Age Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as age proof?', hi: 'आप आयु प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు వయస్సు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'income_proof', label: 'Income Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as income proof?', hi: 'आप आय प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ఆదాయ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'photographs', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'thumb_impression', label: 'Thumb Impression Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided thumb impression?', hi: 'क्या आपने अंगूठे का निशान दिया है?', te: 'మీరు అంగుళం ముద్ర తెలిపారా?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'emergency_relation', label: 'Emergency Contact Relation', type: 'text',
    voiceLabel: { en: 'What is your relation with the emergency contact?', hi: 'आपातकालीन संपर्क से आपका क्या संबंध है?', te: 'అత్యవసర సంప్రదింపుతో మీ సంబంధం ఏమిటి?' }
  },
  {
    id: 'benefits_required', label: 'Benefits Required', type: 'textarea',
    voiceLabel: { en: 'What benefits are you applying for?', hi: 'आप कौन से लाभ के लिए आवेदन कर रहे हैं?', te: 'మీరు ఏ లాభాల కోసం అప్లై చేస్తున్నారు?' }
  },
  {
    id: 'previous_card', label: 'Previous Senior Citizen Card Details', type: 'textarea',
    voiceLabel: { en: 'Do you have any previous senior citizen card?', hi: 'क्या आपके पास पहले कोई वरिष्ठ नागरिक कार्ड है?', te: 'మీకు గతంలో ఏవైనా సీనియర్ సిటిజన్ కార్డ్ ఉందా?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const TRANSGENDER_ID_CARD_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'preferred_name', label: 'Preferred Name', type: 'text',
    voiceLabel: { en: 'What is your preferred name?', hi: 'आपका पसंदीदा नाम क्या है?', te: 'మీ ప్రాధాన్య పేరు ఏమిటి?' }
  },
  {
    id: 'self_identification', label: 'Self Identification as Transgender', type: 'text',
    voiceLabel: { en: 'How do you identify yourself?', hi: 'आप खुद को कैसे पहचानते हैं?', te: 'మీరు మిమ్మల్ని ఎలా గుర్తించుకుంటారు?' }
  },
  {
    id: 'gender_assigned_at_birth', label: 'Gender Assigned at Birth', type: 'text',
    voiceLabel: { en: 'What gender were you assigned at birth?', hi: 'जन्म के समय आपको कौन सा लिंग दिया गया था?', te: 'పుట్టినప్పుడు మీకు ఏ లింగం అప్పగించబడింది?' }
  },
  {
    id: 'current_gender_identity', label: 'Current Gender Identity', type: 'text',
    voiceLabel: { en: 'What is your current gender identity?', hi: 'आपकी वर्तमान लिंग पहचान क्या है?', te: 'మీ ప్రస్తుత లింగ గుర్తింపు ఏమిటి?' }
  },
  {
    id: 'date_of_birth', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'place_of_birth', label: 'Place of Birth', type: 'text',
    voiceLabel: { en: 'What is your place of birth?', hi: 'आपका जन्म स्थान क्या है?', te: 'మీ పుట్టిన స్థలం ఏమిటి?' }
  },
  {
    id: 'nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'caste', label: 'Caste', type: 'text',
    voiceLabel: { en: 'What is your caste?', hi: 'आपकी जाति क्या है?', te: 'మీ జాతి ఏమిటి?' }
  },
  {
    id: 'educational_qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your educational qualification?', hi: 'आपकी शैक्षिक योग्यता क्या है?', te: 'మీ విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'occupation', label: 'Occupation/Profession', type: 'text',
    voiceLabel: { en: 'What is your occupation or profession?', hi: 'आपका व्यवसाय या पेशा क्या है?', te: 'మీ వృత్తి లేదా వృత్తి ఏమిటి?' }
  },
  {
    id: 'monthly_income', label: 'Monthly Income', type: 'text',
    voiceLabel: { en: 'What is your monthly income?', hi: 'आपकी मासिक आय क्या है?', te: 'మీ నెలవారీ ఆదాయం ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'phone_number', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'email_address', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'aadhaar_number', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'pan_number', label: 'PAN Number (if applicable)', type: 'text',
    voiceLabel: { en: 'What is your PAN number if applicable?', hi: 'यदि लागू हो तो आपका पैन नंबर क्या है?', te: 'వర్తిస్తే మీ ప్యాన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'bank_account', label: 'Bank Account Details', type: 'textarea',
    voiceLabel: { en: 'Please provide your bank account details', hi: 'कृपया अपने बैंक खाते का विवरण दें', te: 'దయచేసి మీ బ్యాంక్ ఖాతా వివరాలను అందించండి' }
  },
  {
    id: 'family_details', label: 'Family Details', type: 'textarea',
    voiceLabel: { en: 'Please provide your family details', hi: 'कृपया अपने परिवार का विवरण दें', te: 'దయచేసి మీ కుటుంబ వివరాలను అందించండి' }
  },
  {
    id: 'supporting_documents', label: 'Supporting Documents', type: 'textarea',
    voiceLabel: { en: 'What supporting documents are you submitting?', hi: 'आप कौन से सहायक दस्तावेज़ जमा कर रहे हैं?', te: 'మీరు ఏ సహాయక డాక్యుమెంట్‌లను సమర్పిస్తున్నారు?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'age_proof', label: 'Age Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as age proof?', hi: 'आप आयु प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు వయస్సు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'photographs', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'thumb_impression', label: 'Thumb Impression Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided thumb impression?', hi: 'क्या आपने अंगूठे का निशान दिया है?', te: 'మీరు అంగుళం ముద్ర తెలిపారా?' }
  },
  {
    id: 'emergency_contact', label: 'Emergency Contact Name', type: 'text',
    voiceLabel: { en: 'What is your emergency contact name?', hi: 'आपका आपातकालीन संपर्क नाम क्या है?', te: 'మీ అత్యవసర సంప్రదింపు పేరు ఏమిటి?' }
  },
  {
    id: 'emergency_phone', label: 'Emergency Contact Phone', type: 'text',
    voiceLabel: { en: 'What is your emergency contact phone number?', hi: 'आपका आपातकालीन संपर्क फोन नंबर क्या है?', te: 'మీ అత్యవసర సంప్రదింపు ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'emergency_relation', label: 'Emergency Contact Relation', type: 'text',
    voiceLabel: { en: 'What is your relation with the emergency contact?', hi: 'आपातकालीन संपर्क से आपका क्या संबंध है?', te: 'అత్యవసర సంప్రదింపుతో మీ సంబంధం ఏమిటి?' }
  },
  {
    id: 'discrimination_experiences', label: 'Experiences of Discrimination', type: 'textarea',
    voiceLabel: { en: 'Please describe any experiences of discrimination', hi: 'कृपया भेदभाव के किसी भी अनुभव का वर्णन करें', te: 'దయచేసి వివక్ష విషయంలో ఏవైనా అనుభవాలను వివరించండి' }
  },
  {
    id: 'support_needed', label: 'Support Needed', type: 'textarea',
    voiceLabel: { en: 'What support do you need?', hi: 'आपको क्या सहायता चाहिए?', te: 'మీకు ఏ సహాయం కావాలి?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const SC_ST_FELLOWSHIP_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'date_of_birth', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'category', label: 'Social Category (SC/ST)', type: 'text',
    voiceLabel: { en: 'What is your social category?', hi: 'आपकी सामाजिक श्रेणी क्या है?', te: 'మీ సామాజిక వర్గం ఏమిటి?' }
  },
  {
    id: 'caste_certificate_number', label: 'Caste Certificate Number', type: 'text',
    voiceLabel: { en: 'What is your caste certificate number?', hi: 'आपका जाति प्रमाण पत्र संख्या क्या है?', te: 'మీ జాతి సర్టిఫికేట్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'caste_certificate_date', label: 'Caste Certificate Issue Date', type: 'text',
    voiceLabel: { en: 'What is the issue date of your caste certificate?', hi: 'आपके जाति प्रमाण पत्र की जारी करने की तिथि क्या है?', te: 'మీ జాతి సర్టిఫికేట్ జారీ తేదీ ఏమిటి?' }
  },
  {
    id: 'caste_certificate_issuing_authority', label: 'Caste Certificate Issuing Authority', type: 'text',
    voiceLabel: { en: 'Which authority issued your caste certificate?', hi: 'आपके जाति प्रमाण पत्र को कौन सा अधिकारी जारी किया?', te: 'మీ జాతి సర్టిఫికేట్‌ను ఏ అధికారి జారీ చేసారు?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'phone_number', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'email_address', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'aadhaar_number', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_account_number', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'educational_qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your educational qualification?', hi: 'आपकी शैक्षिक योग्यता क्या है?', te: 'మీ విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'course_name', label: 'Name of the Course', type: 'text',
    voiceLabel: { en: 'What is the name of your course?', hi: 'आपके कोर्स का नाम क्या है?', te: 'మీ కోర్స్ పేరు ఏమిటి?' }
  },
  {
    id: 'course_duration', label: 'Course Duration', type: 'text',
    voiceLabel: { en: 'What is the duration of your course?', hi: 'आपके कोर्स की अवधि क्या है?', te: 'మీ కోర్స్ వ్యవధి ఏమిటి?' }
  },
  {
    id: 'academic_year', label: 'Academic Year', type: 'text',
    voiceLabel: { en: 'What is your academic year?', hi: 'आपका शैक्षणिक वर्ष क्या है?', te: 'మీ విద్యా సంవత్సరం ఏమిటి?' }
  },
  {
    id: 'university_institution', label: 'University/Institution Name', type: 'text',
    voiceLabel: { en: 'What is the name of your university or institution?', hi: 'आपके विश्वविद्यालय या संस्थान का नाम क्या है?', te: 'మీ విశ్వవిద్యాలయం లేదా సంస్థ పేరు ఏమిటి?' }
  },
  {
    id: 'institution_address', label: 'Institution Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of your institution?', hi: 'आपके संस्थान का पता क्या है?', te: 'మీ సంస్థ చిరునామా ఏమిటి?' }
  },
  {
    id: 'research_topic', label: 'Subject/Research Topic', type: 'text',
    voiceLabel: { en: 'What is your subject or research topic?', hi: 'आपका विषय या शोध विषय क्या है?', te: 'మీ విషయం లేదా పరిశోధనా విషయం ఏమిటి?' }
  },
  {
    id: 'admission_date', label: 'Date of Admission', type: 'text',
    voiceLabel: { en: 'What is your date of admission?', hi: 'आपकी प्रवेश तिथि क्या है?', te: 'మీ ప్రవేశ తేదీ ఏమిటి?' }
  },
  {
    id: 'fee_structure', label: 'Course Fee Structure', type: 'textarea',
    voiceLabel: { en: 'Please provide your course fee structure', hi: 'कृपया अपने कोर्स की फीस संरचना दें', te: 'దయచేసి మీ కోర్స్ ఫీస్ నిర్మాణాన్ని అందించండి' }
  },
  {
    id: 'annual_family_income', label: 'Annual Family Income', type: 'text',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఏమిటి?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎన్ని సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'father_occupation', label: "Father's Occupation", type: 'text',
    voiceLabel: { en: "What is your father's occupation?", hi: 'आपके पिता का व्यवसाय क्या है?', te: 'మీ తండ్రి వృత్తి ఏమిటి?' }
  },
  {
    id: 'mother_occupation', label: "Mother's Occupation", type: 'text',
    voiceLabel: { en: "What is your mother's occupation?", hi: 'आपकी माता का व्यवसाय क्या है?', te: 'మీ తల్లి వృత్తి ఏమిటి?' }
  },
  {
    id: 'previous_fellowship', label: 'Previous Fellowship/Scholarship Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of any previous fellowship or scholarship', hi: 'कृपया किसी भी पिछले फेलोशिप या छात्रवृत्ति का विवरण दें', te: 'దయచేసి గతంలో ఏవైనా ఫెలోషిప్ లేదా స్కాలర్‌షిప్ వివరాలను అందించండి' }
  },
  {
    id: 'hostel_required', label: 'Hostel Accommodation Required?', type: 'text',
    voiceLabel: { en: 'Do you require hostel accommodation?', hi: 'क्या आपको हॉस्टल आवास चाहिए?', te: 'మీకు హాస్టల్ నివాసం కావాలా?' }
  },
  {
    id: 'distance_from_institution', label: 'Distance from Institution to Home', type: 'text',
    voiceLabel: { en: 'What is the distance from your institution to home?', hi: 'आपके संस्थान से घर की दूरी क्या है?', te: 'మీ సంస్థ నుండి ఇంటికి దూరం ఎంత?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'income_proof', label: 'Income Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as income proof?', hi: 'आप आय प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ఆదాయ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'caste_proof', label: 'Caste Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as caste proof?', hi: 'आप जाति प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు జాతి నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'admission_proof', label: 'Admission Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as admission proof?', hi: 'आप प्रवेश प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ప్రవేశ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'fee_receipt', label: 'Fee Receipt Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your fee receipt?', hi: 'क्या आपने अपनी फीस रसीद जमा की है?', te: 'మీరు మీ ఫీస్ రసీదు సమర్పించారా?' }
  },
  {
    id: 'mark_sheets', label: 'Previous Mark Sheets Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your previous mark sheets?', hi: 'क्या आपने अपनी पिछली मार्कशीट जमा की है?', te: 'మీరు మీ గత మార్క్‌షీట్లు సమర్పించారా?' }
  },
  {
    id: 'photographs', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const MINORITY_SCHOLARSHIP_FIELDS: ServiceField[] = [
  {
    id: 'applicant_name', label: 'Full Name of Applicant', type: 'text',
    voiceLabel: { en: 'What is your full name?', hi: 'आपका पूरा नाम क्या है?', te: 'మీ పూర్తి పేరు ఏమిటి?' }
  },
  {
    id: 'father_name', label: "Father's Name", type: 'text',
    voiceLabel: { en: "What is your father's name?", hi: 'आपके पिता का नाम क्या है?', te: 'మీ తండ్రి పేరు ఏమిటి?' }
  },
  {
    id: 'mother_name', label: "Mother's Name", type: 'text',
    voiceLabel: { en: "What is your mother's name?", hi: 'आपकी माता का नाम क्या है?', te: 'మీ తల్లి పేరు ఏమిటి?' }
  },
  {
    id: 'date_of_birth', label: 'Date of Birth', type: 'date',
    voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' }
  },
  {
    id: 'age', label: 'Current Age', type: 'number',
    voiceLabel: { en: 'What is your current age?', hi: 'आपकी वर्तमान आयु क्या है?', te: 'మీ ప్రస్తుత వయస్సు ఎంత?' }
  },
  {
    id: 'gender', label: 'Gender', type: 'text',
    voiceLabel: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?', te: 'మీ లింగం ఏమిటి?' }
  },
  {
    id: 'religion', label: 'Religion', type: 'text',
    voiceLabel: { en: 'What is your religion?', hi: 'आपका धर्म क्या है?', te: 'మీ మతం ఏమిటి?' }
  },
  {
    id: 'minority_community', label: 'Minority Community', type: 'text',
    voiceLabel: { en: 'Which minority community do you belong to?', hi: 'आप किस अल्पसंख्यक समुदाय से संबंध रखते हैं?', te: 'మీరు ఏ అల్పసంఖ్యాక సమాజానికి చెందినారు?' }
  },
  {
    id: 'nationality', label: 'Nationality', type: 'text',
    voiceLabel: { en: 'What is your nationality?', hi: 'आपकी राष्ट्रीयता क्या है?', te: 'మీ జాతీయత ఏమిటి?' }
  },
  {
    id: 'marital_status', label: 'Marital Status', type: 'text',
    voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' }
  },
  {
    id: 'permanent_address', label: 'Permanent Address', type: 'textarea',
    voiceLabel: { en: 'What is your permanent address?', hi: 'आपका स्थायी पता क्या है?', te: 'మీ శాశ్వత చిరునామా ఏమిటి?' }
  },
  {
    id: 'current_address', label: 'Current Address', type: 'textarea',
    voiceLabel: { en: 'What is your current address?', hi: 'आपका वर्तमान पता क्या है?', te: 'మీ ప్రస్తుత చిరునామా ఏమిటి?' }
  },
  {
    id: 'phone_number', label: 'Phone Number', type: 'text',
    voiceLabel: { en: 'What is your phone number?', hi: 'आपका फोन नंबर क्या है?', te: 'మీ ఫోన్ నంబర్ ఏమిటి?' }
  },
  {
    id: 'email_address', label: 'Email Address', type: 'text',
    voiceLabel: { en: 'What is your email address?', hi: 'आपका ईमेल पता क्या है?', te: 'మీ ఇమెయిల్ చిరునామా ఏమిటి?' }
  },
  {
    id: 'aadhaar_number', label: 'Aadhaar Number', type: 'text',
    voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_account_number', label: 'Bank Account Number', type: 'text',
    voiceLabel: { en: 'What is your bank account number?', hi: 'आपका बैंक खाता संख्या क्या है?', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య ఏమిటి?' }
  },
  {
    id: 'bank_name', label: 'Bank Name', type: 'text',
    voiceLabel: { en: 'What is the name of your bank?', hi: 'आपके बैंक का नाम क्या है?', te: 'మీ బ్యాంక్ పేరు ఏమిటి?' }
  },
  {
    id: 'ifsc_code', label: 'IFSC Code', type: 'text',
    voiceLabel: { en: 'What is the IFSC code of your bank?', hi: 'आपके बैंक का IFSC कोड क्या है?', te: 'మీ బ్యాంక్ IFSC కోడ్ ఏమిటి?' }
  },
  {
    id: 'educational_qualification', label: 'Educational Qualification', type: 'text',
    voiceLabel: { en: 'What is your educational qualification?', hi: 'आपकी शैक्षिक योग्यता क्या है?', te: 'మీ విద్యా అర్హత ఏమిటి?' }
  },
  {
    id: 'course_name', label: 'Name of the Course', type: 'text',
    voiceLabel: { en: 'What is the name of your course?', hi: 'आपके कोर्स का नाम क्या है?', te: 'మీ కోర్స్ పేరు ఏమిటి?' }
  },
  {
    id: 'course_duration', label: 'Course Duration', type: 'text',
    voiceLabel: { en: 'What is the duration of your course?', hi: 'आपके कोर्स की अवधि क्या है?', te: 'మీ కోర్స్ వ్యవధి ఏమిటి?' }
  },
  {
    id: 'academic_year', label: 'Academic Year', type: 'text',
    voiceLabel: { en: 'What is your academic year?', hi: 'आपका शैक्षणिक वर्ष क्या है?', te: 'మీ విద్యా సంవత్సరం ఏమిటి?' }
  },
  {
    id: 'university_institution', label: 'University/Institution Name', type: 'text',
    voiceLabel: { en: 'What is the name of your university or institution?', hi: 'आपके विश्वविद्यालय या संस्थान का नाम क्या है?', te: 'మీ విశ్వవిద్యాలయం లేదా సంస్థ పేరు ఏమిటి?' }
  },
  {
    id: 'institution_address', label: 'Institution Address', type: 'textarea',
    voiceLabel: { en: 'What is the address of your institution?', hi: 'आपके संस्थान का पता क्या है?', te: 'మీ సంస్థ చిరునామా ఏమిటి?' }
  },
  {
    id: 'admission_date', label: 'Date of Admission', type: 'text',
    voiceLabel: { en: 'What is your date of admission?', hi: 'आपकी प्रवेश तिथि क्या है?', te: 'మీ ప్రవేశ తేదీ ఏమిటి?' }
  },
  {
    id: 'fee_structure', label: 'Course Fee Structure', type: 'textarea',
    voiceLabel: { en: 'Please provide your course fee structure', hi: 'कृपया अपने कोर्स की फीस संरचना दें', te: 'దయచేసి మీ కోర్స్ ఫీస్ నిర్మాణాన్ని అందించండి' }
  },
  {
    id: 'annual_family_income', label: 'Annual Family Income', type: 'text',
    voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఏమిటి?' }
  },
  {
    id: 'family_members', label: 'Number of Family Members', type: 'number',
    voiceLabel: { en: 'How many members are there in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎన్ని సభ్యులు ఉన్నారు?' }
  },
  {
    id: 'father_occupation', label: "Father's Occupation", type: 'text',
    voiceLabel: { en: "What is your father's occupation?", hi: 'आपके पिता का व्यवसाय क्या है?', te: 'మీ తండ్రి వృత్తి ఏమిటి?' }
  },
  {
    id: 'mother_occupation', label: "Mother's Occupation", type: 'text',
    voiceLabel: { en: "What is your mother's occupation?", hi: 'आपकी माता का व्यवसाय क्या है?', te: 'మీ తల్లి వృత్తి ఏమిటి?' }
  },
  {
    id: 'previous_scholarship', label: 'Previous Scholarship Details', type: 'textarea',
    voiceLabel: { en: 'Please provide details of any previous scholarship', hi: 'कृपया किसी भी पिछले छात्रवृत्ति का विवरण दें', te: 'దయచేసి గతంలో ఏవైనా స్కాలర్‌షిప్ వివరాలను అందించండి' }
  },
  {
    id: 'hostel_required', label: 'Hostel Accommodation Required?', type: 'text',
    voiceLabel: { en: 'Do you require hostel accommodation?', hi: 'क्या आपको हॉस्टल आवास चाहिए?', te: 'మీకు హాస్టల్ నివాసం కావాలా?' }
  },
  {
    id: 'distance_from_institution', label: 'Distance from Institution to Home', type: 'text',
    voiceLabel: { en: 'What is the distance from your institution to home?', hi: 'आपके संस्थान से घर की दूरी क्या है?', te: 'మీ సంస్థ నుండి ఇంటికి దూరం ఎంత?' }
  },
  {
    id: 'minority_certificate_number', label: 'Minority Community Certificate Number', type: 'text',
    voiceLabel: { en: 'What is your minority community certificate number?', hi: 'आपका अल्पसंख्यक समुदाय प्रमाण पत्र संख्या क्या है?', te: 'మీ అల్పసంఖ్యాక సమాజ సర్టిఫికేట్ సంఖ్య ఏమిటి?' }
  },
  {
    id: 'minority_certificate_date', label: 'Minority Certificate Issue Date', type: 'text',
    voiceLabel: { en: 'What is the issue date of your minority certificate?', hi: 'आपके अल्पसंख्यक प्रमाण पत्र की जारी करने की तिथि क्या है?', te: 'మీ అల్పసంఖ్యాక సర్టిఫికేట్ జారీ తేదీ ఏమిటి?' }
  },
  {
    id: 'minority_certificate_issuing_authority', label: 'Minority Certificate Issuing Authority', type: 'text',
    voiceLabel: { en: 'Which authority issued your minority certificate?', hi: 'आपके अल्पसंख्यक प्रमाण पत्र को कौन सा अधिकारी जारी किया?', te: 'మీ అల్పసంఖ్యాక సర్టిఫికేట్‌ను ఏ అధికారి జారీ చేసారు?' }
  },
  {
    id: 'identity_proof', label: 'Identity Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as identity proof?', hi: 'आप पहचान प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు గుర్తింపు నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'address_proof', label: 'Address Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as address proof?', hi: 'आप पता प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు చిరునామా నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'income_proof', label: 'Income Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as income proof?', hi: 'आप आय प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ఆదాయ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'minority_proof', label: 'Minority Community Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as minority community proof?', hi: 'आप अल्पसंख्यक समुदाय प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు అల్పసంఖ్యాక సమాజ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'admission_proof', label: 'Admission Proof Document', type: 'text',
    voiceLabel: { en: 'What document are you using as admission proof?', hi: 'आप प्रवेश प्रमाण के लिए कौन सा दस्तावेज़ इस्तेमाल कर रहे हैं?', te: 'మీరు ప్రవేశ నిరూపణ కోసం ఏ డాక్యుమెంట్‌ను ఉపయోగిస్తున్నారు?' }
  },
  {
    id: 'fee_receipt', label: 'Fee Receipt Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your fee receipt?', hi: 'क्या आपने अपनी फीस रसीद जमा की है?', te: 'మీరు మీ ఫీస్ రసీదు సమర్పించారా?' }
  },
  {
    id: 'mark_sheets', label: 'Previous Mark Sheets Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted your previous mark sheets?', hi: 'क्या आपने अपनी पिछली मार्कशीट जमा की है?', te: 'మీరు మీ గత మార్క్‌షీట్లు సమర్పించారా?' }
  },
  {
    id: 'photographs', label: 'Passport Size Photographs Submitted?', type: 'text',
    voiceLabel: { en: 'Have you submitted passport size photographs?', hi: 'क्या आपने पासपोर्ट साइज फोटो जमा की है?', te: 'మీరు పాస్‌పోర్ట్ సైజ్ ఫోటోలు సమర్పించారా?' }
  },
  {
    id: 'signature_specimen', label: 'Signature Specimen Provided?', type: 'text',
    voiceLabel: { en: 'Have you provided signature specimen?', hi: 'क्या आपने हस्ताक्षर का नमूना दिया है?', te: 'మీరు సంతకం నమూనా అందించారా?' }
  },
  {
    id: 'declaration', label: 'Declaration and Undertaking', type: 'textarea',
    voiceLabel: { en: 'Please provide your declaration and undertaking', hi: 'कृपया अपनी घोषणा और आश्वासन दें', te: 'దయచేసి మీ ప్రకటన మరియు హామీను అందించండి' }
  },
  {
    id: 'application_date', label: 'Date of Application', type: 'text',
    voiceLabel: { en: 'What is the date of application?', hi: 'आवेदन की तिथि क्या है?', te: 'అప్లికేషన్ తేదీ ఏమిటి?' }
  },
  {
    id: 'additional_info', label: 'Additional Information', type: 'textarea',
    voiceLabel: { en: 'Any additional information you want to provide?', hi: 'कोई और जानकारी जो आप देना चाहते हैं?', te: 'మీరు అందించాలనుకుంటున్న అదనపు సమాచారం ఏమైనా ఉందా?' }
  }
];

const BANK_ACCOUNT_OPENING_FIELDS: ServiceField[] = [
  { id: 'full_name', label: 'Full Name', type: 'text', voiceLabel: { en: 'Please tell me your full name', hi: 'अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' } },
  { id: 'dob', label: 'Date of Birth', type: 'date', voiceLabel: { en: 'What is your date of birth?', hi: 'आपकी जन्म तिथि क्या है?', te: 'మీ పుట్టిన తేదీ ఏమిటి?' } },
  { id: 'phone', label: 'Phone Number', type: 'tel', voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your 12 digit Aadhaar number?', hi: 'अपना 12 अंकों का आधार नंबर बताएं', te: 'మీ 12 అంకెల ఆధార్ సంఖ్యను చెప్పండి' } },
  { id: 'pan_no', label: 'PAN Card Number', type: 'text', voiceLabel: { en: 'What is your PAN card number?', hi: 'आपका पैन कार्ड नंबर क्या है?', te: 'మీ పాన్ కార్డ్ సంఖ్య ఏమిటి?' } },
  { id: 'address', label: 'Complete Address', type: 'textarea', voiceLabel: { en: 'Tell me your complete address', hi: 'अपना पूरा पता बताएं', te: 'మీ పూర్తి చిరునామా చెప్పండి' } },
  { id: 'account_type', label: 'Account Type (Savings/Current)', type: 'text', voiceLabel: { en: 'What type of account? Savings or Current?', hi: 'किस प्रकार का खाता? बचत या चालू?', te: 'ఏ రకమైన ఖాతా? సేవింగ్స్ లేదా కరెంట్?' } },
  { id: 'nominee_name', label: 'Nominee Name', type: 'text', voiceLabel: { en: 'Who is your nominee?', hi: 'आपका नामांकित व्यक्ति कौन है?', te: 'మీ నామినీ ఎవరు?' } },
  { id: 'kyc_proof', label: 'Upload KYC Proof', type: 'file', requiresFile: true, voiceLabel: { en: 'Please upload your KYC proof', hi: 'कृपया अपना केवाईसी प्रमाण अपलोड करें', te: 'దయచేసి మీ కేవైసీ నిరూపణను అప్‌లోడ్ చేయండి' } }
];

const RESIDENCE_CERTIFICATE_FIELDS: ServiceField[] = [
  { id: 'full_name', label: 'Full Name', type: 'text', voiceLabel: { en: 'Please tell me your full name', hi: 'अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' } },
  { id: 'father_husband_name', label: 'Father / Husband Name', type: 'text', voiceLabel: { en: 'What is your father or husband name?', hi: 'आपके पिता या पति का नाम क्या है?', te: 'మీ తండ్రి లేదా భర్త పేరు ఏమిటి?' } },
  { id: 'address', label: 'Full Address', type: 'textarea', voiceLabel: { en: 'Tell me your complete address', hi: 'अपना पूरा पता बताएं', te: 'మీ పూర్తి చిరునామా చెప్పండి' } },
  { id: 'stay_duration', label: 'Stay Duration (Years)', type: 'number', voiceLabel: { en: 'How many years have you lived at this address?', hi: 'आप इस पते पर कितने वर्षों से रह रहे हैं?', te: 'మీరు ఈ చిరునామాలో ఎన్ని సంవత్సరాలుగా నివసిస్తున్నారు?' } },
  { id: 'purpose', label: 'Purpose of Certificate', type: 'text', voiceLabel: { en: 'Why do you need this certificate?', hi: 'आपको इस प्रमाण पत्र की आवश्यकता क्यों है?', te: 'మీకు ఈ సర్టిఫికేట్ ఎందుకు అవసరం?' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  { id: 'address_proof', label: 'Upload Address Proof', type: 'file', requiresFile: true, voiceLabel: { en: 'Please upload your address proof', hi: 'कृपया अपना पता प्रमाण अपलोड करें', te: 'దయచేసి మీ చిరునామా నిరూపణను అప్‌లోడ్ చేయండి' } }
];

const HEALTH_INSURANCE_ENROLLMENT_FIELDS: ServiceField[] = [
  { id: 'applicant_name', label: 'Applicant Name', type: 'text', voiceLabel: { en: 'What is the applicants name?', hi: 'आवेदक का नाम क्या है?', te: 'దరఖాస్తుదారు పేరు ఏమిటి?' } },
  { id: 'age', label: 'Age', type: 'number', voiceLabel: { en: 'What is your age?', hi: 'आपकी उम्र क्या है?', te: 'నీ వయస్సు ఎంత?' } },
  { id: 'family_income', label: 'Annual Family Income', type: 'number', voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  { id: 'member_count', label: 'Number of Family Members', type: 'number', voiceLabel: { en: 'How many family members to include?', hi: 'कितने परिवार के सदस्यों को शामिल करना है?', te: 'ఎంతమంది కుటుంబ సభ్యులను చేర్చాలి?' } },
  { id: 'previous_illness', label: 'Existing Medical Conditions', type: 'textarea', voiceLabel: { en: 'Do you have any existing medical conditions?', hi: 'क्या आपको कोई मौजूदा चिकित्सीय स्थिति है?', te: 'మీకు ఏవైనా ఆరోగ్య సమస్యలు ఉన్నాయా?' } },
  {
    id: 'income_certificate',
    label: 'Upload Income Certificate',
    type: 'file',
    requiresFile: true,
    description: 'Please upload a clear photo or PDF of your family Income Certificate issued by the Tahsildar or Revenue Department.',
    voiceLabel: {
      en: 'Please upload a clear photo or PDF of your family Income Certificate issued by the Tahsildar or Revenue Department.',
      hi: 'कृपया अपने परिवार के आय प्रमाण पत्र की स्पष्ट फोटो या पीडीएफ अपलोड करें जो तहसीलदार या राजस्व विभाग द्वारा जारी किया गया हो।',
      te: 'దయచేసి తహశీల్దార్ లేదా రెవెన్యూ విభాగం జారీ చేసిన మీ కుటుంబ ఆదాయ ధృవీకరణ పత్రం యొక్క స్పష్టమైన ఫోటో లేదా PDFని అప్‌లోడ్ చేయండి.'
    }
  }
];

const MEDICAL_REIMBURSEMENT_FIELDS: ServiceField[] = [
  { id: 'patient_name', label: 'Patient Name', type: 'text', voiceLabel: { en: 'What is the patients name?', hi: 'मरीज का नाम क्या है?', te: 'రోగి పేరు ఏమిటి?' } },
  { id: 'hospital_name', label: 'Hospital Name', type: 'text', voiceLabel: { en: 'What is the hospital name?', hi: 'अस्पताल का नाम क्या है?', te: 'ఆసుపత్రి పేరు ఏమిటి?' } },
  { id: 'treatment_desc', label: 'Treatment Details', type: 'textarea', voiceLabel: { en: 'Describe the treatment received', hi: 'उपचार का विवरण दें', te: 'చికిత్స వివరాలను వివరించండి' } },
  { id: 'bill_amount', label: 'Total Bill Amount', type: 'number', voiceLabel: { en: 'What is the total bill amount?', hi: 'कुल बिल राशि क्या है?', te: 'మొత్తం బిల్లు మొత్తం ఎంత?' } },
  { id: 'bank_account', label: 'Bank Account for Refund', type: 'text', voiceLabel: { en: 'Tell me your bank account number for refund', hi: 'वापसी के लिए अपना बैंक खाता नंबर बताएं', te: 'రీఫండ్ కోసం మీ బ్యాంక్ ఖాతా సంఖ్య చెప్పండి' } },
  { id: 'ifsc_code', label: 'IFSC Code', type: 'text', voiceLabel: { en: 'What is the bank IFSC code?', hi: 'बैंक का IFSC कोड क्या है?', te: 'బ్యాంక్ IFSC కోడ్ ఏమిటి?' } },
  {
    id: 'bill_files',
    label: 'Upload Medical Bills',
    type: 'file',
    requiresFile: true,
    description: 'Upload clear photos of all hospital bills and pharmacy receipts. Make sure the patient name and amount is visible.',
    voiceLabel: {
      en: 'Please upload clear photos of all hospital bills and pharmacy receipts. Make sure the patient name and amount is visible.',
      hi: 'कृपया सभी अस्पताल के बिलों और फार्मेसी रसीदों की स्पष्ट तस्वीरें अपलोड करें। मरीज का नाम और राशि दिखाई देनी चाहिए।',
      te: 'దయచేసి అన్ని ఆసుపత్రి బిల్లులు మరియు ఫార్మసీ రసీదుల స్పష్టమైన ఫోటోలను అప్‌లోడ్ చేయండి. రోగి పేరు మరియు మొత్తం కనిపించేలా చూసుకోండి.'
    }
  }
];

const WOMEN_WELFARE_SCHEMES_FIELDS: ServiceField[] = [
  { id: 'applicant_name', label: 'Name of Women Applicant', type: 'text', voiceLabel: { en: 'What is your name?', hi: 'आपका नाम क्या है?', te: 'నీ పేరేమిటి?' } },
  { id: 'marital_status', label: 'Marital Status', type: 'text', voiceLabel: { en: 'What is your marital status?', hi: 'आपकी वैवाहिक स्थिति क्या है?', te: 'మీ వైవాహిక స్థితి ఏమిటి?' } },
  { id: 'category', label: 'Category', type: 'text', voiceLabel: { en: 'What is your category?', hi: 'आपकी श्रेणी क्या है?', te: 'మీ వర్గం ఏమిటి?' } },
  { id: 'annual_income', label: 'Annual Income', type: 'number', voiceLabel: { en: 'What is your annual income?', hi: 'आपकी वार्षिक आय क्या है?', te: 'మీ వార్షిక ఆదాయం ఎంత?' } },
  { id: 'scheme_type', label: 'Scheme Applying For', type: 'text', voiceLabel: { en: 'Which scheme are you applying for?', hi: 'आप किस योजना के लिए आवेदन कर रहे हैं?', te: 'మీరు ఏ పథకం కోసం దరఖాస్తు చేస్తున్నారు?' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  {
    id: 'id_proof',
    label: 'Upload ID Proof',
    type: 'file',
    requiresFile: true,
    description: 'Upload a clear copy of your Aadhaar Card, Voter ID, or Pan Card to verify your identity.',
    voiceLabel: {
      en: 'Please upload a clear copy of your Aadhaar Card, Voter ID, or Pan Card to verify your identity.',
      hi: 'कृपया अपनी पहचान सत्यापित करने के लिए अपने आधार कार्ड, वोटर आईडी या पैन कार्ड की एक स्पष्ट प्रति अपलोड करें।',
      te: 'మీ గుర్తింపును ధృవీకరించడానికి దయచేసి మీ ఆధార్ కార్డ్, ఓటర్ ఐడి లేదా పాన్ కార్డ్ యొక్క స్పష్టమైన కాపీని అప్‌లోడ్ చేయండి.'
    }
  }
];

const BUILDING_WORKER_REGISTRATION_FIELDS: ServiceField[] = [
  { id: 'worker_name', label: 'Worker Name', type: 'text', voiceLabel: { en: 'What is your name?', hi: 'आपका नाम क्या है?', te: 'నీ పేరేమిటి?' } },
  { id: 'work_type', label: 'Type of Work', type: 'text', voiceLabel: { en: 'What type of construction work do you do?', hi: 'आप किस प्रकार का निर्माण कार्य करते हैं?', te: 'మీరు ఏ రకమైన నిర్మాణ పని చేస్తారు?' } },
  { id: 'experience_years', label: 'Years of Experience', type: 'number', voiceLabel: { en: 'How many years of experience do you have?', hi: 'आपको कितने वर्षों का अनुभव है?', te: 'మీకు ఎన్ని సంవత్సరాల అనుభవం ఉంది?' } },
  { id: 'employer_details', label: 'Current Employer/Contractor', type: 'text', voiceLabel: { en: 'Who is your current employer or contractor?', hi: 'आपका वर्तमान नियोक्ता या ठेकेदार कौन है?', te: 'మీ ప్రస్తుత యజమాని లేదా కాంట్రాక్టర్ ఎవరు?' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  { id: 'bank_details', label: 'Bank Account Number', type: 'text', voiceLabel: { en: 'Tell me your bank account number', hi: 'अपना बैंक खाता नंबर बताएं', te: 'మీ బ్యాంక్ ఖాతా సంఖ్య చెప్పండి' } },
  { id: 'work_proof', label: 'Upload Work Proof/Certificate', type: 'file', requiresFile: true, voiceLabel: { en: 'Please upload proof of your work', hi: 'कृपया अपने कार्य का प्रमाण अपलोड करें', te: 'దయచేసి మీ పని నిరూపణను అప్‌లోడ్ చేయండి' } }
];

const HOUSING_SCHEME_APPLICATION_FIELDS: ServiceField[] = [
  { id: 'applicant_name', label: 'Applicant Name', type: 'text', voiceLabel: { en: 'What is your name?', hi: 'आपका नाम क्या है?', te: 'నీ పేరేమిటి?' } },
  { id: 'family_count', label: 'Total Family Members', type: 'number', voiceLabel: { en: 'How many members are in your family?', hi: 'आपके परिवार में कितने सदस्य हैं?', te: 'మీ కుటుంబంలో ఎంతమంది సభ్యులు ఉన్నారు?' } },
  { id: 'current_address', label: 'Current Residence Type (Rented/Own)', type: 'text', voiceLabel: { en: 'Do you currently live in a rented or owned house?', hi: 'क्या आप वर्तमान में किराए के या अपने घर में रहते हैं?', te: 'మీరు ప్రస్తుతం అద్దె ఇంట్లో ఉంటున్నారా లేదా సొంత ఇంట్లోనా?' } },
  { id: 'annual_income', label: 'Annual Family Income', type: 'number', voiceLabel: { en: 'What is your annual family income?', hi: 'आपकी वार्षिक पारिवारिक आय क्या है?', te: 'మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  { id: 'pref_location', label: 'Preferred Location', type: 'text', voiceLabel: { en: 'Where would you prefer the house?', hi: 'आप घर कहाँ पसंद करेंगे?', te: 'మీరు ఇల్లు ఎక్కడ కోరుకుంటున్నారు?' } },
  { id: 'bpl_card', label: 'Upload BPL/Ration Card', type: 'file', requiresFile: true, voiceLabel: { en: 'Please upload your BPL or Ration card', hi: 'कृपया अपना बीपीएल या राशन कार्ड अपलोड करें', te: 'దయచేసి మీ బిపిఎల్ లేదా రేషన్ కార్డును అప్‌లోడ్ చేయండి' } }
];

const FIR_REGISTRATION_FIELDS: ServiceField[] = [
  { id: 'complainant_name', label: 'Complainant Name', type: 'text', voiceLabel: { en: 'What is your name?', hi: 'आपका नाम क्या है?', te: 'నీ పేరేమిటి?' } },
  { id: 'incident_date', label: 'Incident Date', type: 'date', voiceLabel: { en: 'When did the incident happen?', hi: 'घटना कब हुई?', te: 'సంఘటన ఎప్పుడు జరిగింది?' } },
  { id: 'incident_location', label: 'Incident Location', type: 'text', voiceLabel: { en: 'Where did it happen?', hi: 'यह कहाँ हुआ?', te: 'ఇది ఎక్కడ జరిగింది?' } },
  { id: 'complaint_type', label: 'Type of Complaint', type: 'text', voiceLabel: { en: 'What is the nature of your complaint?', hi: 'आपकी शिकायत किस प्रकार की है?', te: 'మీ ఫిర్యాదు స్వభావం ఏమిటి?' } },
  { id: 'description', label: 'Detailed Description', type: 'textarea', voiceLabel: { en: 'Describe the incident in detail', hi: 'घटना का विस्तार से वर्णन करें', te: 'సంఘటనను వివరంగా వివరించండి' } },
  { id: 'suspect_info', label: 'Suspect Details (if any)', type: 'textarea', voiceLabel: { en: 'Any details about the suspect?', hi: 'संदिग्ध के बारे में कोई जानकारी?', te: 'అనుమానితుడి గురించి ఏవైనా వివరాలు ఉన్నాయా?' } },
  {
    id: 'evidence',
    label: 'Upload Evidence (Photo/Video)',
    type: 'file',
    requiresFile: true,
    description: 'Upload any photos or videos related to the incident that can help the investigation.',
    voiceLabel: {
      en: 'Please upload any photos or videos related to the incident that can help the investigation.',
      hi: 'कृपया घटना से संबंधित कोई भी फोटो या वीडियो अपलोड करें जो जांच में मदद कर सके।',
      te: 'దయచేసి విచారణకు సహాయపడే సంఘటనకు సంబంధించిన ఏవైనా ఫోటోలు లేదా వీడియోలను అప్‌లోడ్ చేయండి.'
    }
  }
];

const POLICE_VERIFICATION_FIELDS: ServiceField[] = [
  { id: 'full_name', label: 'Full Name', type: 'text', voiceLabel: { en: 'Please tell me your full name', hi: 'अपना पूरा नाम बताएं', te: 'దయచేసి మీ పూర్తి పేరు చెప్పండి' } },
  { id: 'purpose', label: 'Purpose of Verification', type: 'text', voiceLabel: { en: 'Why do you need police verification?', hi: 'आपको पुलिस सत्यापन की आवश्यकता क्यों है?', te: 'మీకు పోలీసు వెరిఫికేషన్ ఎందుకు అవసరం?' } },
  { id: 'address_history', label: 'Address History (Last 5 years)', type: 'textarea', voiceLabel: { en: 'Tell me your addresses for the last 5 years', hi: 'पिछले 5 वर्षों के अपने पते बताएं', te: 'గత 5 సంవత్సరాల మీ చిరునామాలను చెప్పండి' } },
  { id: 'phone', label: 'Phone Number', type: 'tel', voiceLabel: { en: 'What is your phone number?', hi: 'अपना फोन नंबर बताएं', te: 'మీ ఫోన్ నంబర్ చెప్పండి' } },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } },
  {
    id: 'id_proof',
    label: 'Upload ID Proof',
    type: 'file',
    requiresFile: true,
    description: 'Please upload your Aadhaar card or Voter ID for police verification purposes.',
    voiceLabel: {
      en: 'Please upload your Aadhaar card or Voter ID for police verification purposes.',
      hi: 'कृपया पुलिस सत्यापन के उद्देश्य से अपना आधार कार्ड या वोटर आईडी अपलोड करें।',
      te: 'దయచేసి పోలీసు వెరిఫికేషన్ కోసం మీ ఆధార్ కార్డ్ లేదా ఓటర్ ఐడిని అప్‌లోడ్ చేయండి.'
    }
  }
];

const ELECTRICITY_WATER_CONNECTION_FIELDS: ServiceField[] = [
  { id: 'applicant_name', label: 'Applicant Name', type: 'text', voiceLabel: { en: 'What is your name?', hi: 'आपका नाम क्या है?', te: 'నీ పేరేమిటి?' } },
  { id: 'connection_type', label: 'Connection Type (Electricity/Water)', type: 'text', voiceLabel: { en: 'Do you want Electricity, Water, or both?', hi: 'क्या आप बिजली, पानी या दोनों चाहते हैं?', te: 'మీకు విద్యుత్, నీరు లేదా రెండూ కావాలా?' } },
  { id: 'property_address', label: 'Property Address', type: 'textarea', voiceLabel: { en: 'What is the property address?', hi: 'संपत्ति का पता क्या है?', te: 'ఆస్తి చిరునామా ఏమిటి?' } },
  { id: 'load_required', label: 'Load Required (KW) for Electricity', type: 'number', voiceLabel: { en: 'What is the required load in kilowatts?', hi: 'किलोवाट में आवश्यक लोड क्या है?', te: 'కిలోవాట్లలో అవసరమైన లోడ్ ఎంత?' } },
  {
    id: 'property_doc',
    label: 'Upload Property Ownership Proof',
    type: 'file',
    requiresFile: true,
    description: 'Upload a copy of your tax receipt, sale deed, or patta to prove property ownership for connection.',
    voiceLabel: {
      en: 'Please upload a copy of your tax receipt, sale deed, or patta to prove property ownership for connection.',
      hi: 'कनेक्शन के लिए संपत्ति के स्वामित्व को साबित करने के लिए अपनी टैक्स रसीद, सेल डीड या पट्टे की प्रति अपलोड करें।',
      te: 'కనెక్షన్ కోసం ఆస్తి యాజమాన్యాన్ని నిరూపించడానికి మీ పన్ను రసీదు, సేల్ డీడ్ లేదా పట్టా కాపీని అప్‌లోడ్ చేయండి.'
    }
  },
  { id: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', voiceLabel: { en: 'What is your Aadhaar number?', hi: 'आपका आधार नंबर क्या है?', te: 'మీ ఆధార్ సంఖ్య ఏమిటి?' } }
];


const SERVICE_DEFINITIONS: GovernmentService[] = [
  // New & Featured Services
  {
    id: 46, name: 'Bank Account Opening', description: 'Open fresh bank account', icon: '🏦', category: 'Finance',
    fields: BANK_ACCOUNT_OPENING_FIELDS
  },
  {
    id: 47, name: 'Residence Certificate', description: 'Apply for residence/domicile proof', icon: '🏠', category: 'Identity',
    fields: RESIDENCE_CERTIFICATE_FIELDS
  },
  {
    id: 48, name: 'Health Insurance Enrollment', description: 'Enroll in state health schemes', icon: '🏥', category: 'Health',
    fields: HEALTH_INSURANCE_ENROLLMENT_FIELDS
  },
  {
    id: 49, name: 'Medical Reimbursement', description: 'Claim medical expense refund', icon: '💊', category: 'Health',
    fields: MEDICAL_REIMBURSEMENT_FIELDS
  },
  {
    id: 50, name: 'Women Welfare Schemes', description: 'Apply for women support schemes', icon: '👩', category: 'Social',
    fields: WOMEN_WELFARE_SCHEMES_FIELDS
  },
  {
    id: 51, name: 'Building Worker Registration', description: 'Register as construction worker', icon: '👷', category: 'Social',
    fields: BUILDING_WORKER_REGISTRATION_FIELDS
  },
  {
    id: 52, name: 'Housing Scheme Application', description: 'Apply for housing allotment', icon: '🏗️', category: 'Housing',
    fields: HOUSING_SCHEME_APPLICATION_FIELDS
  },
  {
    id: 53, name: 'FIR Registration', description: 'Online police complaint filing', icon: '🚔', category: 'Legal',
    fields: FIR_REGISTRATION_FIELDS
  },
  {
    id: 54, name: 'Police Verification', description: 'Apply for character/police check', icon: '👮', category: 'Legal',
    fields: POLICE_VERIFICATION_FIELDS
  },
  {
    id: 55, name: 'Electricity / Water Connection', description: 'Apply for new utility connections', icon: '🚰', category: 'Utilities',
    fields: ELECTRICITY_WATER_CONNECTION_FIELDS
  },

  // Identity & Documents
  {
    id: 1, name: 'Aadhaar Update', description: 'Update Aadhaar card details', icon: '🆔', category: 'Identity',
    fields: AADHAAR_UPDATE_FIELDS
  },
  {
    id: 2, name: 'PAN Card Application', description: 'Apply for fresh Permanent Account Number', icon: '💳', category: 'Identity',
    fields: PAN_CARD_FIELDS
  },
  {
    id: 3, name: 'Voter ID Registration', description: 'New voter registration/correction', icon: '🗳️', category: 'Identity',
    fields: VOTER_ID_FIELDS
  },
  {
    id: 4, name: 'Birth Certificate', description: 'Apply for birth registration certificate', icon: '👶', category: 'Identity',
    fields: BIRTH_CERTIFICATE_FIELDS
  },
  {
    id: 5, name: 'Caste Certificate', description: 'Obtain community/caste certificate', icon: '📜', category: 'Identity',
    fields: CASTE_CERTIFICATE_FIELDS
  },
  {
    id: 6, name: 'Income Certificate', description: 'Apply for annual income certificate', icon: '📊', category: 'Identity',
    fields: INCOME_CERTIFICATE_FIELDS
  },

  // Travel & Transportation
  {
    id: 7, name: 'Passport Application', description: 'Fresh or reissue of Indian Passport', icon: '🛂', category: 'Travel',
    fields: PASSPORT_APPLICATION_FIELDS
  },
  {
    id: 8, name: 'Driving License', description: 'New Learners or Permanent License', icon: '🚗', category: 'Transportation',
    fields: DRIVING_LICENSE_FIELDS
  },
  {
    id: 9, name: 'Vehicle Registration', description: 'New vehicle RC application', icon: '🏍️', category: 'Transportation',
    fields: VEHICLE_REGISTRATION_FIELDS
  },
  {
    id: 10, name: 'High Security HSRP', description: 'Apply for HSRP plates', icon: '🔢', category: 'Transportation',
    fields: HSRP_FIELDS
  },
  {
    id: 11, name: 'Railway Senior Citizen', description: 'Concession card for seniors', icon: '🚂', category: 'Travel',
    fields: RAILWAY_SENIOR_CITIZEN_FIELDS
  },

  // Finance & Banking
  {
    id: 12, name: 'Bank KYC Update', description: 'Update KYC in bank records', icon: '🏛️', category: 'Finance',
    fields: BANK_KYC_FIELDS
  },
  {
    id: 13, name: 'EPF Withdrawal', description: 'Withdrawal from EPF account', icon: '💰', category: 'Finance',
    fields: EPF_WITHDRAWAL_FIELDS
  },
  {
    id: 14, name: 'Income Tax Return', description: 'Assistance for ITR filing', icon: '📈', category: 'Taxation',
    fields: ITR_FILING_FIELDS
  },
  {
    id: 15, name: 'GST Registration', description: 'Apply for GST number', icon: '📝', category: 'Taxation',
    fields: GST_REGISTRATION_FIELDS
  },
  {
    id: 16, name: 'Personal Loan Mudra', description: 'Pradhan Mantri Mudra Yojana', icon: '🏦', category: 'Finance',
    fields: MUDRA_LOAN_FIELDS
  },

  // Welfare & Pensions
  {
    id: 17, name: 'Old Age Pension', description: 'Apply for monthly old age pension', icon: '👴', category: 'Pension',
    fields: OLD_AGE_PENSION_FIELDS
  },
  {
    id: 18, name: 'Widow Pension', description: 'Apply for widow support pension', icon: '👵', category: 'Pension',
    fields: WIDOW_PENSION_FIELDS
  },
  {
    id: 19, name: 'Kisan Samman Nidhi', description: 'Apply for PM-Kisan scheme', icon: '🌾', category: 'Agriculture',
    fields: KISAN_SAMMAN_NIDHI_FIELDS
  },
  {
    id: 20, name: 'Ration Card Application', description: 'New NFSA Ration Card', icon: '🍚', category: 'Rations',
    fields: RATION_CARD_FIELDS
  },

  // Education & Health
  {
    id: 21, name: 'Post-Matric Scholarship', description: 'Scholarship for SC/ST/OBC students', icon: '🎓', category: 'Education',
    fields: POST_MATRIC_SCHOLARSHIP_FIELDS
  },
  {
    id: 22, name: 'Pre-Matric Scholarship', description: 'Scholarship for school students', icon: '📚', category: 'Education',
    fields: PRE_MATRIC_SCHOLARSHIP_FIELDS
  },
  {
    id: 23, name: 'Ayushman Bharat', description: 'Apply for health insurance card', icon: '🏥', category: 'Health',
    fields: AYUSHMAN_BHARAT_FIELDS
  },
  {
    id: 24, name: 'Disability Certificate', description: 'Apply for UDID card and disability certificate', icon: '♿', category: 'Health',
    fields: DISABILITY_CERTIFICATE_FIELDS
  },

  // Employment & Business
  {
    id: 25, name: 'MGNREGA Job Card', description: 'Register for 100-day work scheme', icon: '🛠️', category: 'Employment',
    fields: MGNREGA_JOB_CARD_FIELDS
  },
  {
    id: 26, name: 'Udyam Registration', description: 'MSME Business registration', icon: '🏢', category: 'Business',
    fields: UDYAM_REGISTRATION_FIELDS
  },
  {
    id: 27, name: 'FSSAI License', description: 'Food safety license for business', icon: '🍎', category: 'Business',
    fields: FSSAI_LICENSE_FIELDS
  },

  // Utilities & Housing
  {
    id: 28, name: 'PM Awas Yojana', description: 'Apply for affordable housing scheme', icon: '🏠', category: 'Housing',
    fields: PM_AWAS_YOJANA_FIELDS
  },
  {
    id: 29, name: 'New Electricity Connection', description: 'Residential power connection', icon: '⚡', category: 'Utilities',
    fields: NEW_ELECTRICITY_CONNECTION_FIELDS
  },
  {
    id: 30, name: 'Water Pipe Connection', description: 'Apply for tap water connection', icon: '💧', category: 'Utilities',
    fields: WATER_PIPE_CONNECTION_FIELDS
  },
  {
    id: 31, name: 'Gas Connection Ujjwala', description: 'LPG connection for BPL families', icon: '🔥', category: 'Subsidy',
    fields: UJJWALA_YOJANA_FIELDS
  },

  // Agriculture & Rural
  {
    id: 32, name: 'Soil Health Card', description: 'Apply for soil testing analysis', icon: '🌱', category: 'Agriculture',
    fields: SOIL_HEALTH_CARD_FIELDS
  },
  {
    id: 33, name: 'Kisan Credit Card', description: 'Apply for agricultural credit', icon: '💳', category: 'Agriculture',
    fields: KISAN_CREDIT_CARD_FIELDS
  },
  {
    id: 34, name: 'Pesticide License', description: 'License for selling agro-inputs', icon: '🧪', category: 'Business',
    fields: PESTICIDE_LICENSE_FIELDS
  },

  // Legal & Community
  {
    id: 35, name: 'Legal Heir Certificate', description: 'Obtain legal heir document', icon: '👨‍👩‍👧', category: 'Legal',
    fields: LEGAL_HEIR_CERTIFICATE_FIELDS
  },
  {
    id: 36, name: 'Marriage Registration', description: 'Apply for marriage certificate', icon: '💍', category: 'Social',
    fields: MARRIAGE_REGISTRATION_FIELDS
  },
  {
    id: 37, name: 'Death Registration', description: 'Issue of death certificate', icon: '🕊️', category: 'Identity',
    fields: DEATH_REGISTRATION_FIELDS
  },

  // Technology & Digital
  {
    id: 38, name: 'Digital Signature Cert', description: 'Obtain DSC for e-filing', icon: '🖋️', category: 'Technology',
    fields: DIGITAL_SIGNATURE_CERT_FIELDS
  },
  {
    id: 39, name: 'Domain Registration (.in)', description: 'Register government subdomain', icon: '🌐', category: 'Technology',
    fields: DOMAIN_REGISTRATION_FIELDS
  },

  // Others
  {
    id: 40, name: 'Arms License', description: 'Apply for new or renewal of license', icon: '🛡️', category: 'Legal',
    fields: ARMS_LICENSE_FIELDS
  },
  {
    id: 41, name: 'Ex-Servicemen Identity', description: 'Issue of ID card for retirees', icon: '🎖️', category: 'Identity',
    fields: EX_SERVICEMEN_IDENTITY_FIELDS
  },
  {
    id: 42, name: 'Senior Citizen Card', description: 'State-issued senior citizen ID', icon: '👴', category: 'Identity',
    fields: SENIOR_CITIZEN_CARD_FIELDS
  },
  {
    id: 43, name: 'Transgender ID Card', description: 'NSP application for TG ID', icon: '🏳️‍🌈', category: 'Identity',
    fields: TRANSGENDER_ID_CARD_FIELDS
  },
  {
    id: 44, name: 'SC/ST Fellowship', description: 'Higher education financial aid', icon: '🎓', category: 'Education',
    fields: SC_ST_FELLOWSHIP_FIELDS
  },
  {
    id: 45, name: 'Minority Scholarship', description: 'Welfare for minority students', icon: '🌙', category: 'Education',
    fields: MINORITY_SCHOLARSHIP_FIELDS
  }
];

// Service translations for all languages
export const SERVICE_TRANSLATIONS: Record<number, Record<string, { name: string; description: string }>> = {
  1: {
    en: { name: 'Aadhaar Update', description: 'Update Aadhaar card details' },
    hi: { name: 'आधार अपडेट', description: 'आधार कार्ड विवरण अपडेट करें' },
    te: { name: 'ఆధార్ అప్‌డేట్', description: 'ఆధార్ కార్డ్ వివరాలను అప్‌డేట్ చేయండి' },
    kn: { name: 'ಆಧಾರ್ ಅಪ್‌ಡೇಟ್', description: 'ಆಧಾರ್ ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ' },
    ta: { name: 'ஆதார் புதுப்பிப்பு', description: 'ஆதார் அட்டை விவரங்களை புதுப்பிக்கவும்' },
    ml: { name: 'ആധാർ അപ്ഡേറ്റ്', description: 'ആധാർ കാർഡ് വിശദാംശങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുക' },
    mr: { name: 'आधार अपडेट', description: 'आधार कार्ड तपशील अद्यतनित करा' },
    bn: { name: 'আধার আপডেট', description: 'আধার কার্ডের বিশদ আপডেট করুন' },
    gu: { name: 'આધાર અપડેટ', description: 'આધાર કાર્ડની વિગતો અપડેટ કરો' },
    or: { name: 'ଆଧାର ଅପଡେଟ୍', description: 'ଆଧାର କାର୍ଡ ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ' },
    pa: { name: 'ਆਧਾਰ ਅੱਪਡੇਟ', description: 'ਆਧਾਰ ਕਾਰਡ ਵੇਰਵੇ ਅੱਪਡੇਟ ਕਰੋ' },
    ur: { name: 'آدھار اپ ڈیٹ', description: 'آدھار کارڈ کی تفصیلات کو اپ ڈیٹ کریں' }
  },
  2: {
    en: { name: 'PAN Card Application', description: 'Apply for fresh Permanent Account Number' },
    hi: { name: 'पैन कार्ड आवेदन', description: 'नया स्थायी खाता संख्या के लिए आवेदन करें' },
    te: { name: 'పాన్ కార్డ్ దరఖాస్తు', description: 'కొత్త శాశ్వత ఖాతా సంఖ్య కోసం దరఖాస్తు చేయండి' },
    kn: { name: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಅರ್ಜಿ', description: 'ಹೊಸ ಶಾಶ್ವತ ಖಾತೆ ಸಂಖ್ಯೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'பான் கார்டு விண்ணப்பம்', description: 'புதிய நிரந்தர கணக்கு எண்ணுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'പാൻ കാർഡ് അപേക്ഷ', description: 'പുതിയ സ്ഥിര അക്കൗണ്ട് നമ്പറിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'पॅन कार्ड अर्ज', description: 'नवीन कायम खाते क्रमांकासाठी अर्ज करा' },
    bn: { name: 'প্যান কার্ড আবেদন', description: 'নতুন স্থায়ী অ্যাকাউন্ট নম্বরের জন্য আবেদন করুন' },
    gu: { name: 'પાન કાર્ડ અરજી', description: 'નવા કાયમી ખાતા નંબર માટે અરજી કરો' },
    or: { name: 'ପାନ କାର୍ଡ ଆବେଦନ', description: 'ନୂତନ ସ୍ଥାୟୀ ଖାତା ସଂଖ୍ୟା ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਪੈਨ ਕਾਰਡ ਅਰਜ਼ੀ', description: 'ਨਵੇਂ ਸਥਾਈ ਖਾਤਾ ਨੰਬਰ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'پین کارڈ درخواست', description: 'نیا مستقل اکاؤنٹ نمبر کے لیے درخواست دیں' }
  },
  3: {
    en: { name: 'Voter ID Registration', description: 'New voter registration/correction' },
    hi: { name: 'वोटर आईडी पंजीकरण', description: 'नया मतदाता पंजीकरण/सुधार' },
    te: { name: 'ఓటరు ID నమోదు', description: 'కొత్త ఓటరు నమోదు/దిద్దుబాటు' },
    kn: { name: 'ಮತದಾರ ID ನೋಂದಣಿ', description: 'ಹೊಸ ಮತದಾರ ನೋಂದಣಿ/ತಿದ್ದುಪಡಿ' },
    ta: { name: 'வாக்காளர் அடையாள பதிவு', description: 'புதிய வாக்காளர் பதிவு/திருத்தம்' },
    ml: { name: 'വോട്ടർ ഐഡി രജിസ്ട്രേഷൻ', description: 'പുതിയ വോട്ടർ രജിസ്ട്രേഷൻ/തിരുത്തൽ' },
    mr: { name: 'मतदार ओळखपत्र नोंदणी', description: 'नवीन मतदार नोंदणी/सुधारणा' },
    bn: { name: 'ভোটার আইডি নিবন্ধন', description: 'নতুন ভোটার নিবন্ধন/সংশোধন' },
    gu: { name: 'મતદાર ID નોંધણી', description: 'નવા મતદાર નોંધણી/સુધારો' },
    or: { name: 'ଭୋଟର ID ପଞ୍ଜୀକରଣ', description: 'ନୂତନ ଭୋଟର ପଞ୍ଜୀକରଣ/ସଂଶୋଧନ' },
    pa: { name: 'ਵੋਟਰ ID ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਨਵਾਂ ਵੋਟਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ/ਸੁਧਾਰ' },
    ur: { name: 'ووٹر ID رجسٹریشن', description: 'نیا ووٹر رجسٹریشن/تصحیح' }
  },
  4: {
    en: { name: 'Birth Certificate', description: 'Apply for birth registration certificate' },
    hi: { name: 'जन्म प्रमाण पत्र', description: 'जन्म पंजीकरण प्रमाण पत्र के लिए आवेदन करें' },
    te: { name: 'జనన ధృవీకరణ పత్రం', description: 'జనన నమోదు ధృవీకరణ పత్రం కోసం దరఖాస్తు చేయండి' },
    kn: { name: 'ಜನನ ಪ್ರಮಾಣಪತ್ರ', description: 'ಜನನ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'பிறப்பு சான்றிதழ்', description: 'பிறப்பு பதிவு சான்றிதழுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'ജനന സർട്ടിഫിക്കറ്റ്', description: 'ജനന രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'जन्म दाखला', description: 'जन्म नोंदणी प्रमाणपत्रासाठी अर्ज करा' },
    bn: { name: 'জন্ম সার্টিফিকেট', description: 'জন্ম নিবন্ধন সার্টিফিকেটের জন্য আবেদন করুন' },
    gu: { name: 'જન્મ પ્રમાણપત્ર', description: 'જન્મ નોંધણી પ્રમાણપત્ર માટે અરજી કરો' },
    or: { name: 'ଜନ୍ମ ପ୍ରମାଣପତ୍ର', description: 'ଜନ୍ମ ପଞ୍ଜୀକରଣ ପ୍ରମାଣପତ୍ର ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਜਨਮ ਸਰਟੀਫਿਕੇਟ', description: 'ਜਨਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'پیدائش کا سرٹیفکیٹ', description: 'پیدائش کی رجسٹریشن سرٹیفکیٹ کے لیے درخواست دیں' }
  },
  5: {
    en: { name: 'Caste Certificate', description: 'Obtain community/caste certificate' },
    hi: { name: 'जाति प्रमाण पत्र', description: 'समुदाय/जाति प्रमाण पत्र प्राप्त करें' },
    te: { name: 'కుల ధృవీకరణ పత్రం', description: 'సంఘం/కుల ధృవీకరణ పత్రం పొందండి' },
    kn: { name: 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ', description: 'ಸಮುದಾಯ/ಜಾತಿ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪಡೆದುಕೊಳ್ಳಿ' },
    ta: { name: 'சாதி சான்றிதழ்', description: 'சமூகம்/சாதி சான்றிதழ் பெறவும்' },
    ml: { name: 'ജാതി സർട്ടിഫിക്കറ്റ്', description: 'സമുദായം/ജാതി സർട്ടിഫിക്കറ്റ് നേടുക' },
    mr: { name: 'जातीचा दाखला', description: 'समुदाय/जातीचा दाखला मिळवा' },
    bn: { name: 'জাতিগত শংসাপত্র', description: 'সম্প্রদায়/জাতিগত শংসাপত্র প্রাপ্ত করুন' },
    gu: { name: 'જ્ઞાતિનું પ્રમાણપત્ર', description: 'સમુદાય/જ્ઞાતિનું પ્રમાણપત્ર મેળવો' },
    or: { name: 'ଜାତି ପ୍ରମାଣପତ୍ର', description: 'ସମ୍ପ୍ରଦାୟ/ଜାତି ପ୍ରମାଣପତ୍ର ପ୍ରାପ୍ତ କରନ୍ତୁ' },
    pa: { name: 'ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ', description: 'ਕਮਿਊਨਿਟੀ/ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਾਪਤ ਕਰੋ' },
    ur: { name: 'ذات کا سرٹیفکیٹ', description: 'کمیونٹی/ذات کا سرٹیفکیٹ حاصل کریں' }
  },
  6: {
    en: { name: 'Income Certificate', description: 'Apply for annual income certificate' },
    hi: { name: 'आय प्रमाण पत्र', description: 'वार्षिक आय प्रमाण पत्र के लिए आवेदन करें' },
    te: { name: 'ఆదాయ ధృవీకరణ పత్రం', description: 'వార్షిక ఆదాయ ధృవీకరణ పత్రం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', description: 'ವಾರ್ಷಿಕ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'வருமான சான்றிதழ்', description: 'ஆண்டு வருமான சான்றிதழுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വരുമാന സർട്ടിഫിക്കറ്റ്', description: 'വാർഷിക വരുമാന സർട്ടിഫിക്കറ്റിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'उत्पन्न प्रमाणपत्र', description: 'वार्षिक उत्पन्न प्रमाणपत्रासाठी अर्ज करा' },
    bn: { name: 'আয় শংসাপত্র', description: 'বার্ষিক আয় শংসাপত্রের জন্য আবেদন করুন' },
    gu: { name: 'આવકનું પ્રમાણપત્ર', description: 'વાર્ષિક આવકના પ્રમાણપત્ર માટે અરજી કરો' },
    or: { name: 'ଆୟ ପ୍ରମାଣପତ୍ର', description: 'ବାର୍ଷିକ ଆୟ ପ୍ରମାଣପତ୍ର ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ', description: 'ਸਾਲਾਨਾ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'آمدنی کا سرٹیفکیٹ', description: 'سالانہ آمدنی کے سرٹیفکیٹ کے لیے درخواست دیں' }
  },
  7: {
    en: { name: 'Passport Application', description: 'Fresh or reissue of Indian Passport' },
    hi: { name: 'पासपोर्ट आवेदन', description: 'नया या भारतीय पासपोर्ट का पुनः जारी करना' },
    te: { name: 'పాస్‌పోర్ట్ దరఖాస్తు', description: 'భారతీయ పాస్‌పోర్ట్ యొక్క తాజా లేదా పునఃజారీ' },
    kn: { name: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಅರ್ಜಿ', description: 'ಹೊಸ ಅಥವಾ ಭಾರತೀಯ ಪಾಸ್‌ಪೋರ್ಟ್‌ನ ಮರು-ನೀಡಿಕೆ' },
    ta: { name: 'பாஸ்போர்ட் விண்ணப்பம்', description: 'புதிய அல்லது இந்திய பாஸ்போர்ட்டை மீண்டும் வழங்குதல்' },
    ml: { name: 'പാസ്‌പോർട്ട് അപേക്ഷ', description: 'പുതിയതോ ഇന്ത്യൻ പാസ്‌പോർട്ടിന്റെ പുനർവിതരണമോ' },
    mr: { name: 'पासपोर्ट अर्ज', description: 'नवीन किंवा भारतीय पासपोर्टचे पुन्हा जारी करणे' },
    bn: { name: 'পাসপোর্ট আবেদন', description: 'নতুন বা ভারতীয় পাসপোর্টের পুনঃইস্যু' },
    gu: { name: 'પાસપોર્ટ અરજી', description: 'નવી અથવા ભારતીય પાસપોર્ટની પુનઃ-ઇશ્યૂ' },
    or: { name: 'ପାସପୋର୍ଟ ଆବେଦନ', description: 'ନୂତନ ବା ଭାରତୀୟ ପାସପୋର୍ଟର ପୁନଃ-ପ୍ରଦାନ' },
    pa: { name: 'ਪਾਸਪੋਰਟ ਅਰਜ਼ੀ', description: 'ਨਵਾਂ ਜਾਂ ਭਾਰਤੀ ਪਾਸਪੋਰਟ ਦਾ ਮੁੜ-ਜਾਰੀ' },
    ur: { name: 'پاسپورٹ درخواست', description: 'نیا یا ہندوستانی پاسپورٹ کا دوبارہ اجراء' }
  },
  8: {
    en: { name: 'Driving License', description: 'New Learners or Permanent License' },
    hi: { name: 'ड्राइविंग लाइसेंस', description: 'नया लर्नर्स या स्थायी लाइसेंस' },
    te: { name: 'డ్రైవింగ్ లైసెన్స్', description: 'కొత్త లెర్నర్స్ లేదా శాశ్వత లైసెన్స్' },
    kn: { name: 'ಚಾಲನಾ ಪರವਾਨಗಿ', description: 'ಹೊಸ ಕಲಿಯುವವರ ಅಥವಾ ಖಾಯಂ ಪರವಾನಗಿ' },
    ta: { name: 'ஓட்டுநர் உரிமம்', description: 'புதிய கற்பவர் அல்லது நிரந்தர உரிமம்' },
    ml: { name: 'ഡ്രൈവിംഗ് ലൈസൻസ്', description: 'പുതിയ പഠിതാക്കളുടെ അല്ലെങ്കിൽ സ്ഥിരം ലൈസൻസ്' },
    mr: { name: 'ड्रायव्हिंग लायसन्स', description: 'नवीन शिकाऊ किंवा कायमस्वरूपी परवाना' },
    bn: { name: 'ড্রাইভিং লাইসেন্স', description: 'নতুন লার্নার্স বা স্থায়ী লাইসেন্স' },
    gu: { name: 'ડ્રાઇવિંગ લાઇસન્સ', description: 'નવા શીખનારાઓ અથવા કાયમી લાઇસન્સ' },
    or: { name: 'ଡ୍ରାଇଭିଂ ଲାଇସେନ୍ସ', description: 'ନୂତନ ଶିକ୍ଷାର୍ଥୀ ବା ସ୍ଥାୟୀ ଲାଇସେନ୍ସ' },
    pa: { name: 'ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ', description: 'ਨਵਾਂ ਲਰਨਰਜ਼ ਜਾਂ ਸਥਾਈ ਲਾਇਸੈਂਸ' },
    ur: { name: 'ڈرائیونگ لائسنس', description: 'نیا لرنرز یا مستقل لائسنس' }
  },
  9: {
    en: { name: 'Vehicle Registration', description: 'New vehicle RC application' },
    hi: { name: 'वाहन पंजीकरण', description: 'नया वाहन आरसी आवेदन' },
    te: { name: 'వాహన నమోదు', description: 'కొత్త వాహనం RC దరఖాస్తు' },
    kn: { name: 'ವಾಹನ ನೋಂದಣಿ', description: 'ಹೊಸ ವಾಹನ ಆರ್‌ಸಿ ಅರ್ಜಿ' },
    ta: { name: 'வாகன பதிவு', description: 'புதிய வாகன ஆர்சி விண்ணப்பம்' },
    ml: { name: 'വാഹന രജിസ്ട്രേഷൻ', description: 'പുതിയ വാഹന ആർസി അപേക്ഷ' },
    mr: { name: 'वाहन नोंदणी', description: 'नवीन वाहन आरसी अर्ज' },
    bn: { name: 'যানবাহন নিবন্ধন', description: 'নতুন যানবাহন আরসি আবেদন' },
    gu: { name: 'વાહન નોંધણી', description: 'નવા વાહન આરસી અરજી' },
    or: { name: 'ଯାନ ପଞ୍ଜୀକରଣ', description: 'ନୂତନ ଯାନ RC ଆବେଦନ' },
    pa: { name: 'ਵਾਹਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਨਵੀਂ ਵਾਹਨ ਆਰਸੀ ਅਰਜ਼ੀ' },
    ur: { name: 'گاڑی کی رجسٹریشن', description: 'نئی گاڑی آر سی درخواست' }
  },
  10: {
    en: { name: 'High Security HSRP', description: 'Apply for HSRP plates' },
    hi: { name: 'उच्च सुरक्षा एचएसआरपी', description: 'एचएसआरपी प्लेटों के लिए आवेदन करें' },
    te: { name: 'అధిక భద్రత HSRP', description: 'HSRP ప్లేట్ల కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಹೆಚ್ಚಿನ ಭದ್ರತೆಯ HSRP', description: 'HSRP ಪ್ಲೇಟ್‌ಗಳಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'உயர் பாதுகாப்பு எச்.எஸ்.ஆர்.பி', description: 'எச்.எஸ்.ஆர்.பி தட்டுகளுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'ഉയർന്ന സുരക്ഷാ എച്ച്എസ്ആർപി', description: 'എച്ച്എസ്ആർപി പ്ലേറ്റുകൾക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'उच्च सुरक्षा एचएसआरपी', description: 'एचएसआरपी प्लेट्ससाठी अर्ज करा' },
    bn: { name: 'উচ্চ নিরাপত্তা এইচএসআরপি', description: 'এইচএসআরপি প্লেটের জন্য আবেদন করুন' },
    gu: { name: 'ઉચ્ચ સુરક્ષા HSRP', description: 'HSRP પ્લેટો માટે અરજી કરો' },
    or: { name: 'ଉଚ୍ଚ ସୁରକ୍ଷା HSRP', description: 'HSRP ପ୍ଲେଟ୍ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਉੱਚ ਸੁਰੱਖਿਆ HSRP', description: 'HSRP ਪਲੇਟਾਂ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'ہائی سیکورٹی ایچ ایس آر پی', description: 'ایچ ایس آر پی پلیٹوں کے لیے درخواست دیں' }
  },
  11: {
    en: { name: 'Railway Senior Citizen', description: 'Concession card for seniors' },
    hi: { name: 'रेलवे वरिष्ठ नागरिक', description: 'वरिष्ठ नागरिकों के लिए रियायत कार्ड' },
    te: { name: 'రైల్వే సీనియర్ సిటిజన్', description: 'సీనియర్ సిటిజన్ల కోసం రాయితీ కార్డు' },
    kn: { name: 'ರೈಲ್ವೆ ಹಿರಿಯ ನಾಗರಿಕ', description: 'ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ರಿಯಾಯಿತಿ ಕಾರ್ಡ್' },
    ta: { name: 'ரயில்வே மூத்த குடிமக்கள்', description: 'மூத்த குடிமக்களுக்கான சலுகை அட்டை' },
    ml: { name: 'റെയിൽവേ സീനിയർ സിറ്റിസൺ', description: 'മുതിർന്ന പൗരന്മാർക്കുള്ള ഇളവ് കാർഡ്' },
    mr: { name: 'रेल्वे ज्येष्ठ नागरिक', description: 'ज्येष्ठ नागरिकांसाठी सवलत कार्ड' },
    bn: { name: 'রেলওয়ে সিনিয়র সিটিজেন', description: 'সিনিয়র সিটিজেনদের জন্য ছাড় কার্ড' },
    gu: { name: 'રેલ્વે વરિષ્ઠ નાગરિક', description: 'વરિષ્ઠ નાગરિકો માટે કન્સેશન કાર્ડ' },
    or: { name: 'ରେଳବାଇ ବରିଷ୍ଠ ନାଗରିକ', description: 'ବରିଷ୍ଠ ନାଗରିକଙ୍କ ପାଇଁ ରିହାତି କାର୍ଡ' },
    pa: { name: 'ਰੇਲਵੇ ਸੀਨੀਅਰ ਸਿਟੀਜ਼ਨ', description: 'ਸੀਨੀਅਰ ਨਾਗਰਿਕਾਂ ਲਈ ਰਿਆਇਤੀ ਕਾਰਡ' },
    ur: { name: 'ریلوے سینئر سٹیزن', description: 'سینئر شہریوں کے لیے رعایتی کارڈ' }
  },
  12: {
    en: { name: 'Bank KYC Update', description: 'Update KYC in bank records' },
    hi: { name: 'बैंक केवाईसी अपडेट', description: 'बैंक रिकॉर्ड में केवाईसी अपडेट करें' },
    te: { name: 'బ్యాంక్ KYC అప్‌డేట్', description: 'బ్యాంక్ రికార్డులలో KYCని అప్‌డేట్ చేయండి' },
    kn: { name: 'ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ ಅಪ್‌ಡೇಟ್', description: 'ಬ್ಯಾಂಕ್ ದಾಖಲೆಗಳಲ್ಲಿ ಕೆವೈಸಿ ನವೀಕರಿಸಿ' },
    ta: { name: 'வங்கி KYC புதுப்பிப்பு', description: 'வங்கி பதிவுகளில் KYC ஐப் புதுப்பிக்கவும்' },
    ml: { name: 'ബാങ്ക് കെവൈസി അപ്ഡേറ്റ്', description: 'ബാങ്ക് രേഖകളിൽ കെവൈസി അപ്ഡേറ്റ് ചെയ്യുക' },
    mr: { name: 'बँक केवायसी अपडेट', description: 'बँक रेकॉर्डमध्ये केवायसी अपडेट करा' },
    bn: { name: 'ব্যাঙ্ক কেওয়াইসি আপডেট', description: 'ব্যাঙ্কের রেকর্ডে কেওয়াইসি আপডেট করুন' },
    'gu': { name: 'બેંક કેવાયસી અપડેટ', description: 'બેંક રેકોર્ડમાં કેવાયસી અપડેટ કરો' },
    or: { name: 'ବ୍ୟାଙ୍କ KYC ଅପଡେଟ୍', description: 'ବ୍ୟାଙ୍କ ରେକର୍ଡରେ KYC ଅପଡେଟ୍ କରନ୍ତୁ' },
    pa: { name: 'ਬੈਂਕ ਕੇਵਾਈਸੀ ਅੱਪਡੇਟ', description: 'ਬੈਂਕ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਕੇਵਾਈਸੀ ਅੱਪਡੇਟ ਕਰੋ' },
    ur: { name: 'بینک کے وائی سی اپ ڈیٹ', description: 'بینک ریکارڈ میں کے وائی سی کو اپ ڈیٹ کریں' }
  },
  13: {
    en: { name: 'EPF Withdrawal', description: 'Withdrawal from EPF account' },
    hi: { name: 'ईपीएफ निकासी', description: 'ईपीएफ खाते से निकासी' },
    te: { name: 'EPF ఉపసంహరణ', description: 'EPF ఖాతా నుండి ఉపసంహరణ' },
    kn: { name: 'ಇಪಿಎಫ್ ಹಿಂತೆಗೆದುಕೊಳ್ಳುವಿಕೆ', description: 'ಇಪಿಎಫ್ ಖಾತೆಯಿಂದ ಹಿಂತೆಗೆದುಕೊಳ್ಳುವಿಕೆ' },
    ta: { name: 'EPF திரும்பப் பெறுதல்', description: 'EPF கணக்கிலிருந்து திரும்பப் பெறுதல்' },
    ml: { name: 'ഇപിഎഫ് പിൻവലിക്കൽ', description: 'ഇപിഎഫ് അക്കൗണ്ടിൽ നിന്ന് പിൻവലിക്കൽ' },
    mr: { name: 'ईपीएफ काढणे', description: 'ईपीएफ खात्यातून काढणे' },
    bn: { name: 'ইপিএফ উত্তোলন', description: 'ইপিএফ অ্যাকাউন্ট থেকে উত্তোলন' },
    gu: { name: 'ઇપીએફ ઉપાડ', description: 'ઇપીએફ ખાતામાંથી ઉપાડ' },
    or: { name: 'EPF ପ୍ରତ୍ୟାହାର', description: 'EPF ଖାତାରୁ ପ୍ରତ୍ୟାହାର' },
    pa: { name: 'ਈਪੀਐਫ ਕਢਵਾਉਣਾ', description: 'ਈਪੀਐਫ ਖਾਤੇ ਵਿੱਚੋਂ ਕਢਵਾਉਣਾ' },
    ur: { name: 'ای پی ایف کی واپسی', description: 'ای پی ایف اکاؤنٹ سے واپسی' }
  },
  14: {
    en: { name: 'Income Tax Return', description: 'Assistance for ITR filing' },
    hi: { name: 'आयकर रिटर्न', description: 'आईटीआर फाइलिंग के लिए सहायता' },
    te: { name: 'ఆదాయపు పన్ను రిటర్న్', description: 'ITR ఫైలింగ్ కోసం సహాయం' },
    kn: { name: 'ಆದಾಯ ತೆರಿಗೆ ರಿಟರ್ನ್', description: 'ಐಟಿಆರ್ ಫೈಲಿಂಗ್‌ಗೆ ಸಹಾಯ' },
    ta: { name: 'வருமான வரி அறிக்கை', description: 'ITR தாக்கல் செய்வதற்கான உதவி' },
    ml: { name: 'ആദായ നികുതി റിട്ടേൺ', description: 'ഐടിആർ ഫയലിംഗിനുള്ള സഹായം' },
    mr: { name: 'आयकर रिटर्न', description: 'आयटीआर फाइलिंगसाठी सहाय्य' },
    bn: { name: 'আয়কর রিটার্ন', description: 'আইটিআর ফাইলিংয়ের জন্য সহায়তা' },
    gu: { name: 'આવકવેરા રિટર્ન', description: 'આઈટીઆર ફાઇલિંગ માટે સહાય' },
    or: { name: 'ଆୟକର ରିଟର୍ଣ୍ଣ', description: 'ITR ଫାଇଲିଂ ପାଇଁ ସହାୟତା' },
    pa: { name: 'ਆਮਦਨ ਟੈਕਸ ਰਿਟਰਨ', description: 'ਆਈਟੀਆਰ ਫਾਈਲਿੰਗ ਲਈ ਸਹਾਇਤਾ' },
    ur: { name: 'انکم ٹیکس ریٹرن', description: 'آئی ٹی آر فائلنگ کے لیے معاونت' }
  },
  15: {
    en: { name: 'GST Registration', description: 'Apply for GST number' },
    hi: { name: 'जीएसटी पंजीकरण', description: 'जीएसटी नंबर के लिए आवेदन करें' },
    te: { name: 'GST నమోదు', description: 'GST నంబర్ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಜಿಎಸ್ಟಿ ನೋಂದಣಿ', description: 'ಜಿಎಸ್ಟಿ ಸಂಖ್ಯೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'ஜிஎஸ்டி பதிவு', description: 'ஜிஎஸ்டி எண்ணுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'ജിഎസ്ടി രജിസ്ട്രേഷൻ', description: 'ജിഎസ്ടി നമ്പറിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'जीएसटी नोंदणी', description: 'जीएसटी क्रमांकासाठी अर्ज करा' },
    bn: { name: 'জিএসটি নিবন্ধন', description: 'জিএসটি নম্বরের জন্য আবেদন করুন' },
    gu: { name: 'જીએસટી નોંધણી', description: 'જીએસટી નંબર માટે અરજી કરો' },
    or: { name: 'ଜିଏସଟି ପଞ୍ଜୀକରଣ', description: 'ଜିଏସଟି ନମ୍ବର ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਜੀਐਸਟੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਜੀਐਸਟੀ ਨੰਬਰ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'جی ایس ٹی رجسٹریشن', description: 'جی ایس ٹی نمبر کے لیے درخواست دیں' }
  },
  16: {
    en: { name: 'Personal Loan Mudra', description: 'Pradhan Mantri Mudra Yojana' },
    hi: { name: 'व्यक्तिगत ऋण मुद्रा', description: 'प्रधानमंत्री मुद्रा योजना' },
    te: { name: 'వ్యక్తిగత రుణం ముద్ర', description: 'ప్రధాన మంత్రి ముద్ర యోజన' },
    kn: { name: 'ವೈಯಕ್ತಿಕ ಸಾಲ ಮುದ್ರಾ', description: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಯೋಜನೆ' },
    ta: { name: 'தனிநபர் கடன் முத்ரா', description: 'பிரதம மந்திரி முத்ரா யோஜனா' },
    ml: { name: 'വ്യക്തിഗത വായ്പ മുദ്ര', description: 'പ്രധാനമന്ത്രി മുദ്ര യോജന' },
    mr: { name: 'वैयक्तिक कर्ज मुद्रा', description: 'प्रधानमंत्री मुद्रा योजना' },
    bn: { name: 'ব্যক্তিগত ঋণ মুদ্রা', description: 'প্রধানমন্ত্রী মুদ্রা যোজনা' },
    gu: { name: 'પર્સનલ લોન મુદ્રા', description: 'પ્રધાનમંત્રી મુદ્રા યોજના' },
    or: { name: 'ବ୍ୟକ୍ତିଗତ ଋଣ ମୁଦ୍ରା', description: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ମୁଦ୍ରା ଯୋଜନା' },
    pa: { name: 'ਨਿੱਜੀ ਲੋਨ ਮੁਦਰਾ', description: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਮੁਦਰਾ ਯੋਜਨਾ' },
    ur: { name: 'ذاتی قرض مدرا', description: 'پردھان منتری مدرا یوجنا' }
  },
  17: {
    en: { name: 'Old Age Pension', description: 'Apply for monthly old age pension' },
    hi: { name: 'वृद्धावस्था पेंशन', description: 'मासिक वृद्धावस्था पेंशन के लिए आवेदन करें' },
    te: { name: 'వృద్ధాప్య పింఛను', description: 'నెలవారీ వృద్ధాప్య పింఛను కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ', description: 'ಮಾಸಿಕ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'முதுமை ஓய்வூதியம்', description: 'மாதாந்திர முதுமை ஓய்வூதியத்திற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വാർദ്ധക്യകാല പെൻഷൻ', description: 'പ്രതിമാസ വാർദ്ധക്യകാല പെൻഷനായി അപേക്ഷിക്കുക' },
    mr: { name: 'वृद्धापकाळ निवृत्तीवेतन', description: 'मासिक वृद्धापकाळ निवृत्तीवेतनाचा अर्ज करा' },
    bn: { name: 'বার্ধক্য পেনশন', description: 'মাসিক বার্ধক্য পেনশনের জন্য আবেদন করুন' },
    gu: { name: 'વૃદ્ધાવસ્થા પેન્શન', description: 'માસિક વૃદ્ધાવસ્થા પેન્શન માટે અરજી કરો' },
    or: { name: 'ବାର୍ଦ୍ଧକ୍ୟ ପେନସନ', description: 'ମାସିକ ବାର୍ଦ୍ଧକ୍ୟ ପେନସନ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ', description: 'ਮਹੀਨਾਵਾਰ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'بڑھاپے کی پنشن', description: 'ماہانہ بڑھاپے کی پنشن کے لیے درخواست دیں' }
  },
  18: {
    en: { name: 'Widow Pension', description: 'Apply for widow support pension' },
    hi: { name: 'विधवा पेंशन', description: 'विधवा सहायता पेंशन के लिए आवेदन करें' },
    te: { name: 'వితంతు పింఛను', description: 'వితంతు సహాయ పింఛను కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ವಿಧವಾ ಪಿಂಚಣಿ', description: 'ವಿಧವಾ ಬೆಂಬಲ ಪಿಂಚಣಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'விதவை ஓய்வூதியம்', description: 'விதவை ஆதரவு ஓய்வூதியத்திற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വിധവ പെൻഷൻ', description: 'വിധവ പിന്തുണ പെൻഷനായി അപേക്ഷിക്കുക' },
    mr: { name: 'विधवा निवृत्तीवेतन', description: 'विधवा सहाय्य निवृत्तीवेतनाचा अर्ज करा' },
    bn: { name: 'বিধবা পেনশন', description: 'বিধবা সহায়তা পেনশনের জন্য আবেদন করুন' },
    gu: { name: 'વિધવા પેન્શન', description: 'વિધવા સહાય પેન્શન માટે અરજી કરો' },
    or: { name: 'ବିଧବା ପେନସନ', description: 'ବିଧବା ସହାୟତା ପେନସନ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਵਿਧਵਾ ਪੈਨਸ਼ਨ', description: 'ਵਿਧਵਾ ਸਹਾਇਤਾ ਪੈਨਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'بیوہ پنشن', description: 'بیوہ کی امدادی پنشن کے لیے درخواست دیں' }
  },
  19: {
    en: { name: 'Kisan Samman Nidhi', description: 'Apply for PM-Kisan scheme' },
    hi: { name: 'किसान सम्मान निधि', description: 'पीएम-किसान योजना के लिए आवेदन करें' },
    te: { name: 'కిసాన్ సమ్మాన్ నిధి', description: 'పిఎం-కిసాన్ పథకం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ', description: 'ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'கிசான் சம்மான் நிதி', description: 'பிஎம்-கிசான் திட்டத்திற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'കിസാൻ സമ്മാൻ നിധി', description: 'പിഎം-കിസാൻ പദ്ധതിക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'किसान सन्मान निधी', description: 'पीएम-किसान योजनेसाठी अर्ज करा' },
    bn: { name: 'কিষাণ সম্মান নিধি', description: 'পিএম-কিষাণ প্রকল্পের জন্য আবেদন করুন' },
    gu: { name: 'કિસાન સન્માન નિધિ', description: 'પીએમ-કિસાન યોજના માટે અરજી કરો' },
    or: { name: 'କିଷାନ ସମ୍ମାନ ନିଧି', description: 'ପିଏମ-କିଷାନ ଯୋଜନା ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ', description: 'ਪੀਐਮ-ਕਿਸਾਨ ਯੋਜਨਾ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'کسان سمان ندھی', description: 'پی ایم-کسان اسکیم کے لیے درخواست دیں' }
  },
  20: {
    en: { name: 'Ration Card Application', description: 'New NFSA Ration Card' },
    hi: { name: 'राशन कार्ड आवेदन', description: 'नया एनएफएसए राशन कार्ड' },
    te: { name: 'రేషన్ కార్డ్ దరఖాస్తు', description: 'కొత్త NFSA రేషన్ కార్డ్' },
    kn: { name: 'ಪಡಿತರ ಚೀಟಿ ಅರ್ಜಿ', description: 'ಹೊಸ ಎನ್‌ಎಫ್‌ಎಸ್‌ಎ ಪಡಿತರ ಚೀಟಿ' },
    ta: { name: 'ரேஷன் கார்டு விண்ணப்பம்', description: 'புதிய NFSA ரேஷன் கார்டு' },
    ml: { name: 'റേഷൻ കാർഡ് അപേക്ഷ', description: 'പുതിയ എൻഎഫ്എസ്എ റേഷൻ കാർഡ്' },
    mr: { name: 'रेशन कार्ड अर्ज', description: 'नवीन एनएफएसए रेशन कार्ड' },
    bn: { name: 'রেশন কার্ড আবেদন', description: 'নতুন এনএফএসএ রেশন কার্ড' },
    gu: { name: 'રેશનકાર્ડ અરજી', description: 'નવું એનએફએસએ રેશનકાર્ડ' },
    or: { name: 'ରାସନ କାର୍ଡ ଆବେଦନ', description: 'ନୂତନ NFSA ରାସନ କାର୍ଡ' },
    pa: { name: 'ਰਾਸ਼ਨ ਕਾਰਡ ਅਰਜ਼ੀ', description: 'ਨਵਾਂ ਐਨਐਫਐਸਏ ਰਾਸ਼ਨ ਕਾਰਡ' },
    ur: { name: 'راشن کارڈ کی درخواست', description: 'نیا این ایف ایس اے راشن کارڈ' }
  },
  21: {
    en: { name: 'Post-Matric Scholarship', description: 'Scholarship for SC/ST/OBC students' },
    hi: { name: 'पोस्ट-मैट्रिक छात्रवृत्ति', description: 'एससी/एसटी/ओबीसी छात्रों के लिए छात्रवृत्ति' },
    te: { name: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్', description: 'SC/ST/OBC విద్యార్థులకు స్కాలర్‌షిప్' },
    kn: { name: 'ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ', description: 'ಎಸ್‌ಸಿ/ಎಸ್‌ಟಿ/ಒಬಿಸಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ' },
    ta: { name: 'போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை', description: 'SC/ST/OBC மாணவர்களுக்கான கல்வி உதவித்தொகை' },
    ml: { name: 'പോസ്റ്റ്-മെട്രിക് സ്കോളർഷിപ്പ്', description: 'SC/ST/OBC വിദ്യാർത്ഥികൾക്കുള്ള സ്കോളർഷിപ്പ്' },
    mr: { name: 'पोस्ट-मॅट्रिक शिष्यवृत्ती', description: 'एससी/एसटी/ओबीसी विद्यार्थ्यांसाठी शिष्यवृत्ती' },
    bn: { name: 'পোস্ট-ম্যাট্রিক স্কলারশিপ', description: 'এসসি/এসটি/ওবিসি শিক্ষার্থীদের জন্য স্কলারশিপ' },
    gu: { name: 'પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ', description: 'એસસી/એસટી/ઓબીસી વિદ્યાર્થીઓ માટે શિષ્યવૃત્તિ' },
    or: { name: 'ପୋଷ୍ଟ-ମାଟ୍ରିକ୍ ସ୍କଲାରସିପ୍', description: 'SC/ST/OBC ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ସ୍କଲାରସିପ୍' },
    pa: { name: 'ਪੋਸਟ-ਮੈਟ੍ਰਿਕ ਸਕਾਲਰਸ਼ਿਪ', description: 'SC/ST/OBC ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਕਾਲਰਸ਼ਿਪ' },
    ur: { name: 'پوسٹ میٹرک اسکالرشپ', description: 'ایس سی/ایس ٹی/او بی سی طلباء کے لیے اسکالرشپ' }
  },
  22: {
    en: { name: 'Pre-Matric Scholarship', description: 'Scholarship for school students' },
    hi: { name: 'प्री-मैट्रिक छात्रवृत्ति', description: 'स्कूली छात्रों के लिए छात्रवृत्ति' },
    te: { name: 'ప్రీ-మెట్రిక్ స్కాలర్‌షిప్', description: 'పాఠశాల విద్యార్థులకు స్కాలర్‌షిప్' },
    kn: { name: 'ಪ್ರೀ-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ', description: 'ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ' },
    ta: { name: 'ப்ரீ-மெட்ரிக் கல்வி உதவித்தொகை', description: 'பள்ளி மாணவர்களுக்கான கல்வி உதவித்தொகை' },
    ml: { name: 'പ്രീ-മെട്രിക് സ്കോളർഷിപ്പ്', description: 'സ്കൂൾ വിദ്യാർത്ഥികൾക്കുള്ള സ്കോളർഷിപ്പ്' },
    mr: { name: 'प्री-मॅट्रिक शिष्यवृत्ती', description: 'शालेय विद्यार्थ्यांसाठी शिष्यवृत्ती' },
    bn: { name: 'প্রি-ম্যাট্রিক স্কলারশিপ', description: 'স্কুল শিক্ষার্থীদের জন্য স্কলারশিপ' },
    gu: { name: 'પ્રી-મેટ્રિક શિષ્યવૃત્તિ', description: 'શાળાના વિદ્યાર્થીઓ માટે શિષ્યવૃત્તિ' },
    or: { name: 'ପ୍ରି-ମାଟ୍ରିକ୍ ସ୍କଲାରସିପ୍', description: 'ସ୍କୁଲ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ସ୍କଲାରସିପ୍' },
    pa: { name: 'ਪ੍ਰੀ-ਮੈਟ੍ਰਿਕ ਸਕਾਲਰਸ਼ਿਪ', description: 'ਸਕੂਲੀ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਕਾਲਰਸ਼ਿਪ' },
    ur: { name: 'پری میٹرک اسکالرشپ', description: 'اسکول کے طلباء کے لیے اسکالرشپ' }
  },
  23: {
    en: { name: 'Ayushman Bharat', description: 'Apply for health insurance card' },
    hi: { name: 'आयुष्मान भारत', description: 'स्वास्थ्य बीमा कार्ड के लिए आवेदन करें' },
    te: { name: 'ఆయుష్మాన్ భారత్', description: 'ఆరోగ్య బీమా కార్డు కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್', description: 'ಆರೋಗ್ಯ ವಿಮಾ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'ஆயுஷ்மான் பாரத்', description: 'சுகாதார காப்பீட்டு அட்டைக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'ആയുഷ്മാൻ ഭാരത്', description: 'ആരോഗ്യ ഇൻഷുറൻസ് കാർഡിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'आयुष्मान भारत', description: 'आरोग्य विमा कार्डसाठी अर्ज करा' },
    bn: { name: 'আয়ুষ্মান ভারত', description: 'স্বাস্থ্য বীমা কার্ডের জন্য আবেদন করুন' },
    gu: { name: 'આયુષ્માન ભારત', description: 'આરોગ્ય વીમા કાર્ડ માટે અરજી કરો' },
    or: { name: 'ଆୟୁଷ୍ମାନ ଭାରତ', description: 'ସ୍ୱାସ୍ଥ୍ୟ ବୀମା କାର୍ଡ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ', description: 'ਸਿਹਤ ਬੀਮਾ ਕਾਰਡ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'آیوشمان بھارت', description: 'ہیلتھ انشورنس کارڈ کے لیے درخواست دیں' }
  },
  24: {
    en: { name: 'Disability Certificate', description: 'Apply for UDID card and disability certificate' },
    hi: { name: 'विकलांगता प्रमाण पत्र', description: 'यूडीआईडी कार्ड और विकलांगता प्रमाण पत्र के लिए आवेदन करें' },
    te: { name: 'వైకల్య ధృవీకరణ పత్రం', description: 'UDID కార్డ్ మరియు వైకల్య ధృవీకరణ పత్రం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ', description: 'ಯುಡಿಐಡಿ ಕಾರ್ಡ್ ಮತ್ತು ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'ஊனமுற்றோர் சான்றிதழ்', description: 'UDID அட்டை மற்றும் ஊனமுற்றோர் சான்றிதழுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വൈകല്യ സർട്ടിഫിക്കറ്റ്', description: 'യുഡിഐഡി കാർഡിനും വൈകല്യ സർട്ടിഫിക്കറ്റിനും അപേക്ഷിക്കുക' },
    mr: { name: 'अपंगत्व प्रमाणपत्र', description: 'यूडीआयडी कार्ड आणि अपंगत्व प्रमाणपत्रासाठी अर्ज करा' },
    bn: { name: 'প্রতিবন্ধী শংসাপত্র', description: 'ইউডিআইডি কার্ড এবং প্রতিবন্ধী শংসাপত্রের জন্য আবেদন করুন' },
    gu: { name: 'વિકલાંગતા પ્રમાણપત્ર', description: 'યુડીઆઈડી કાર્ડ અને વિકલાંગતા પ્રમાણપત્ર માટે અરજી કરો' },
    or: { name: 'ଅକ୍ଷମତା ପ୍ରମାଣପତ୍ର', description: 'UDID କାର୍ଡ ଏବଂ ଅକ୍ଷମତା ପ୍ରମାଣପତ୍ର ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਅਪੰਗਤਾ ਸਰਟੀਫਿਕੇਟ', description: 'ਯੂਡੀਆਈਡੀ ਕਾਰਡ ਅਤੇ ਅਪੰਗਤਾ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'معذوری کا سرٹیفکیٹ', description: 'یو ڈی آئی ڈی کارڈ اور معذوری کے سرٹیفکیٹ کے لیے درخواست دیں' }
  },
  25: {
    en: { name: 'MGNREGA Job Card', description: 'Register for 100-day work scheme' },
    hi: { name: 'मनरेगा जॉब कार्ड', description: '100-दिवसीय कार्य योजना के लिए पंजीकरण करें' },
    te: { name: 'MGNREGA జాబ్ కార్డ్', description: '100-రోజుల పని పథకం కోసం నమోదు చేసుకోండి' },
    kn: { name: 'ಎಂಜಿಎನ್‌ಆರ್‌ಇಜಿಎ ಜಾಬ್ ಕಾರ್ಡ್', description: '100-ದಿನಗಳ ಕೆಲಸದ ಯೋಜನೆಗೆ ನೋಂದಾಯಿಸಿ' },
    ta: { name: 'எம்ஜிஎன்ஆர்இஜிஏ வேலை அட்டை', description: '100-நாள் வேலை திட்டத்திற்கு பதிவு செய்யவும்' },
    ml: { name: 'എംജിഎൻആർഇജിഎ ജോബ് കാർഡ്', description: '100 ദിവസത്തെ തൊഴിൽ പദ്ധതിക്കായി രജിസ്റ്റർ ചെയ്യുക' },
    mr: { name: 'मनरेगा जॉब कार्ड', description: '100-दिवसीय कार्य योजनेसाठी नोंदणी करा' },
    bn: { name: 'এমজিএনআরইজিএ জব কার্ড', description: '১০০ দিনের কাজের প্রকল্পের জন্য নিবন্ধন করুন' },
    gu: { name: 'મનરેગા જોબ કાર્ડ', description: '100-દિવસીય કાર્ય યોજના માટે નોંધણી કરો' },
    or: { name: 'MGNREGA ଜବ୍ କାର୍ଡ', description: '୧୦୦-ଦିନିଆ କାର୍ଯ୍ୟ ଯୋଜନା ପାଇଁ ପଞ୍ଜୀକରଣ କରନ୍ତୁ' },
    pa: { name: 'ਮਨਰੇਗਾ ਜੌਬ ਕਾਰਡ', description: '100-ਦਿਨਾਂ ਦੀ ਕੰਮ ਸਕੀਮ ਲਈ ਰਜਿਸਟਰ ਕਰੋ' },
    ur: { name: 'منریگا جاب کارڈ', description: '100 دن کی ورک اسکیم کے لیے رجسٹر کریں' }
  },
  26: {
    en: { name: 'Udyam Registration', description: 'MSME Business registration' },
    hi: { name: 'उद्यम पंजीकरण', description: 'एमएसएमई व्यापार पंजीकरण' },
    te: { name: 'ఉద్యమ్ రిజిస్ట్రేషన్', description: 'MSME వ్యాపార నమోదు' },
    kn: { name: 'ಉದ್ಯಮ್ ನೋಂದಣಿ', description: 'ಎಂಎಸ್‌ಎಂಇ ವ್ಯಾಪಾರ ನೋಂದಣಿ' },
    ta: { name: 'உத்யம் பதிவு', description: 'எம்எஸ்எம்இ வணிகப் பதிவு' },
    ml: { name: 'ഉദ്യം രജിസ്ട്രേഷൻ', description: 'എംഎസ്എംഇ ബിസിനസ് രജിസ്ട്രേഷൻ' },
    mr: { name: 'उद्यम नोंदणी', description: 'एमएसएमई व्यवसाय नोंदणी' },
    bn: { name: 'উদ্যম নিবন্ধন', description: 'এমএসএমই ব্যবসা নিবন্ধন' },
    gu: { name: 'ઉદ્યમ નોંધણી', description: 'એમએસએમઇ બિઝનેસ નોંધણી' },
    or: { name: 'ଉଦ୍ୟମ ପଞ୍ଜୀକରଣ', description: 'MSME ବ୍ୟବସାୟ ପଞ୍ଜୀକରଣ' },
    pa: { name: 'ਉੱਦਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'MSME ਵਪਾਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ' },
    ur: { name: 'ادیم رجسٹریشن', description: 'ایم ایس ایم ای بزنس رجسٹریشن' }
  },
  27: {
    en: { name: 'FSSAI License', description: 'Food safety license for business' },
    hi: { name: 'एफएसएसएआई लाइसेंस', description: 'व्यापार के लिए खाद्य सुरक्षा लाइसेंस' },
    te: { name: 'FSSAI లైసెన్స్', description: 'వ్యాపారం కోసం ఆహార భద్రత లైసెన్స్' },
    kn: { name: 'ಎಫ್‌ಎಸ್‌ಎಸ್‌ಎಐ ಪರವਾਨಗಿ', description: 'ವ್ಯವಹಾರಕ್ಕಾಗಿ ಆಹಾರ ಸುರಕ್ಷತಾ ಪರವਾਨಗಿ' },
    ta: { name: 'FSSAI உரிமம்', description: 'வணிகத்திற்கான உணவு பாதுகாப்பு உரிமம்' },
    ml: { name: 'എഫ്എസ്എസ്എഐ ലൈസൻസ്', description: 'ബിസിനസ്സിനായുള്ള ഭക്ഷ്യ സുരക്ഷാ ലൈസൻസ്' },
    mr: { name: 'एफएसएसएआय परवाना', description: 'व्यवसायासाठी अन्न सुरक्षा परवाना' },
    bn: { name: 'এফএসএসএআই লাইসেন্স', description: 'ব্যবসার জন্য খাদ্য নিরাপত্তা লাইসেন্স' },
    gu: { name: 'FSSAI લાઇસન્સ', description: 'વ્યવસાય માટે ખાદ્ય સુરક્ષા લાઇસન્સ' },
    or: { name: 'FSSAI ଲାଇସେନ୍ସ', description: 'ବ୍ୟବସାୟ ପାଇଁ ଖାଦ୍ୟ ସୁରକ୍ଷା ଲାଇସେନ୍ସ' },
    pa: { name: 'FSSAI ਲਾਇਸੈਂਸ', description: 'ਵਪਾਰ ਲਈ ਭੋਜਨ ਸੁਰੱਖਿਆ ਲਾਇਸੈਂਸ' },
    ur: { name: 'ایف ایس ایس اے آئی لائسنس', description: 'کاروبار کے لیے فوڈ سیفٹی لائسنس' }
  },
  28: {
    en: { name: 'PM Awas Yojana', description: 'Apply for affordable housing scheme' },
    hi: { name: 'पीएम आवास योजना', description: 'किफायती आवास योजना के लिए आवेदन करें' },
    te: { name: 'పిఎం ఆవాస్ యోజన', description: 'సరసమైన గృహ పథకం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಪಿಎಂ ಆವಾಸ್ ಯೋಜನೆ', description: 'ಕೈಗೆಟುಕುವ ವಸತಿ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'பிஎம் ஆவாஸ் யோஜனா', description: 'மலிவு விலை வீட்டுத் திட்டத்திற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'പിഎം ആവാസ് യോജന', description: 'താങ്ങാനാവുന്ന ഭവന പദ്ധതിക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'पीएम आवास योजना', description: 'परवडणाऱ्या गृहनिर्माण योजनेसाठी अर्ज करा' },
    bn: { name: 'পিএম আবাস যোজনা', description: 'সাশ্রয়ী মূল্যের আবাসন প্রকল্পের জন্য আবেদন করুন' },
    gu: { name: 'પીએમ આવાસ યોજના', description: 'સસ્તું આવાસ યોજના માટે અરજી કરો' },
    or: { name: 'ପିଏମ ଆବାସ ଯୋଜନା', description: 'ଶସ୍ତା ଗୃହ ଯୋଜନା ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਪੀਐਮ ਆਵਾਸ ਯੋਜਨਾ', description: 'ਕਿਫਾਇਤੀ ਹਾਊਸਿੰਗ ਸਕੀਮ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'پی ایم آواس یوجنا', description: 'سستی ہاؤسنگ اسکیم کے لیے درخواست دیں' }
  },
  29: {
    en: { name: 'New Electricity Connection', description: 'Residential power connection' },
    hi: { name: 'नया बिजली कनेक्शन', description: 'आवासीय बिजली कनेक्शन' },
    te: { name: 'కొత్త విద్యుత్ కనెక్షన్', description: 'నివాస విద్యుత్ కనెక్షన్' },
    kn: { name: 'ಹೊಸ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ', description: 'ವಸತಿ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ' },
    ta: { name: 'புதிய மின்சார இணைப்பு', description: 'குடியிருப்பு மின் இணைப்பு' },
    ml: { name: 'പുതിയ വൈദ്യുതി കണക്ഷൻ', description: 'റെസിഡൻഷ്യൽ പവർ കണക്ഷൻ' },
    mr: { name: 'नवीन वीज जोडणी', description: 'निवासी वीज जोडणी' },
    bn: { name: 'নতুন বিদ্যুৎ সংযোগ', description: 'আবাসিক বিদ্যুৎ সংযোগ' },
    gu: { name: 'નવું વીજળી કનેક્શન', description: 'રહેણાંક પાવર કનેક્શન' },
    or: { name: 'ନୂତନ ବିଦ୍ୟୁତ୍ ସଂଯୋଗ', description: 'ଆବାସିକ ବିଦ୍ୟୁତ୍ ସଂଯୋଗ' },
    pa: { name: 'ਨਵਾਂ ਬਿਜਲੀ ਕਨੈਕਸ਼ਨ', description: 'ਰਿਹਾਇਸ਼ੀ ਪਾਵਰ ਕਨੈਕਸ਼ਨ' },
    ur: { name: 'نیا بجلی کنکشن', description: 'رہائشی بجلی کنکশন' }
  },
  30: {
    en: { name: 'Water Pipe Connection', description: 'Apply for tap water connection' },
    hi: { name: 'पानी का पाइप कनेक्शन', description: 'नल के पानी के कनेक्शन के लिए आवेदन करें' },
    te: { name: 'నీటి పైపు కనెక్షన్', description: 'పంపు నీటి కనెక్షన్ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ನೀರಿನ ಪೈಪ್ ಸಂಪರ್ಕ', description: ' ನಲ್ಲಿ ನೀರಿನ ಸಂಪರ್ಕಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'தண்ணீர் குழாய் இணைப்பு', description: 'குழாய் நீர் இணைப்புக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വെള്ള പൈപ്പ് കണക്ഷൻ', description: 'ടാപ്പ് വെള്ള കണക്ഷനായി അപേക്ഷിക്കുക' },
    mr: { name: 'पाण्याची पाईप जोडणी', description: 'नळाच्या पाण्याच्या जोडणीसाठी अर्ज करा' },
    bn: { name: 'জল পাইপ সংযোগ', description: 'কলের জল সংযোগের জন্য আবেদন করুন' },
    gu: { name: 'પાણીની પાઇપ કનેક્શન', description: 'નળના પાણીના કનેક્શન માટે અરજી કરો' },
    or: { name: 'ଜଳ ପାଇପ୍ ସଂଯୋଗ', description: 'ଟ୍ୟାପ୍ ଜଳ ସଂଯୋଗ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਪਾਣੀ ਦੀ ਪਾਈਪ ਕਨੈਕਸ਼ਨ', description: 'ਟੂਟੀ ਦੇ ਪਾਣੀ ਦੇ ਕਨੈਕਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'پانی کا پائپ کنکشن', description: 'نل کے پانی کے کنکشن کے لیے درخواست دیں' }
  },
  31: {
    en: { name: 'Gas Connection Ujjwala', description: 'LPG connection for BPL families' },
    hi: { name: 'गैस कनेक्शन उज्ज्वला', description: 'बीपीएल परिवारों के लिए एलपीजी कनेक्शन' },
    te: { name: 'గ్యాస్ కనెక్షన్ ఉజ్వల', description: 'BPL కుటుంబాలకు LPG కనెక్షన్' },
    kn: { name: 'ಗ್ಯಾಸ್ ಸಂಪರ್ಕ ಉಜ್ವಲ', description: 'ಬಿಪಿಎಲ್ ಕುಟುಂಬಗಳಿಗೆ ಎಲ್‌ಪಿಜಿ ಸಂಪರ್ಕ' },
    ta: { name: 'எரிவாயு இணைப்பு உஜ்வாலா', description: 'பிபிஎல் குடும்பங்களுக்கான எல்பிஜி இணைப்பு' },
    ml: { name: 'ഗ്യാസ് കണക്ഷൻ ഉജ്ജ്വല', description: 'ബിപിഎൽ കുടുംബങ്ങൾക്കുള്ള എൽപിജി കണക്ഷൻ' },
    mr: { name: 'गॅस कनेक्शन उज्ज्वला', description: 'बीपीएल कुटुंबांसाठी एलपीजी कनेक्शन' },
    bn: { name: 'গ্যাস সংযোগ উজ্জ্বলা', description: 'বিপিএল পরিবারের জন্য এলপিজি সংযোগ' },
    gu: { name: 'ગેસ કનેક્શન ઉજ્જવલા', description: 'બીપીએલ પરિવારો માટે એલપીજી કનેક્શન' },
    or: { name: 'ଗ୍ୟାସ୍ ସଂଯୋଗ ଉଜ୍ଜ୍ୱଳା', description: 'BPL ପରିବାର ପାଇଁ LPG ସଂଯୋଗ' },
    pa: { name: 'ਗੈਸ ਕਨੈਕਸ਼ਨ ਉਜਵਲਾ', description: 'ਬੀਪੀਐਲ ਪਰਿਵਾਰਾਂ ਲਈ ਐਲਪੀਜੀ ਕਨੈਕਸ਼ਨ' },
    ur: { name: 'گیس کنکشن اجولا', description: 'بی پی ایل خاندانوں کے لیے ایل پی جی کنکشن' }
  },
  32: {
    en: { name: 'Soil Health Card', description: 'Apply for soil testing analysis' },
    hi: { name: 'मृदा स्वास्थ्य कार्ड', description: 'मृदा परीक्षण विश्लेषण के लिए आवेदन करें' },
    te: { name: 'నేల ఆరోగ్య కార్డు', description: 'నేల పరీక్ష విశ్లేషణ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್', description: 'ಮಣ್ಣು ಪರೀಕ್ಷಾ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'மண் சுகாதார அட்டை', description: 'மண் பரிசோதனை பகுப்பாய்விற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'മണ്ണ് ആരോഗ്യ കാർഡ്', description: 'മണ്ണ് പരിശോധന വിശകലനത്തിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'मृदा आरोग्य कार्ड', description: 'मृदा चाचणी विश्लेषणासाठी अर्ज करा' },
    bn: { name: 'মাটি স্বাস্থ্য কার্ড', description: 'মাটি পরীক্ষা বিশ্লেষণের জন্য আবেদন করুন' },
    gu: { name: 'જમીન આરોગ્ય કાર્ડ', description: 'જમીન પરીક્ષણ વિશ્લેષણ માટે અરજી કરો' },
    or: { name: 'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ', description: 'ମୃତ୍ତିକା ପରୀକ୍ଷଣ ବିଶ୍ଳେଷଣ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ', description: 'ਮਿੱਟੀ ਪਰਖ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'مٹی کی صحت کا کارڈ', description: 'مٹی کی جانچ کے تجزیے کے لیے درخواست دیں' }
  },
  33: {
    en: { name: 'Kisan Credit Card', description: 'Apply for agricultural credit' },
    hi: { name: 'किसान क्रेडिट कार्ड', description: 'कृषि ऋण के लिए आवेदन करें' },
    te: { name: 'కిసాన్ క్రెడిట్ కార్డ్', description: 'వ్యవసాయ రుణం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್', description: 'ಕೃಷಿ ಸಾಲಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'கிசான் கிரெடிட் கார்டு', description: 'விவசாய கடனுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ്', description: 'കാർഷിക വായ്പയ്ക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'किसान क्रेडिट कार्ड', description: 'कृषी कर्जासाठी अर्ज करा' },
    bn: { name: 'কিষাণ ক্রেডিট কার্ড', description: 'কৃষি ঋণের জন্য আবেদন করুন' },
    gu: { name: 'કિસાન ક્રેડિટ કાર્ડ', description: 'કૃષિ ધિરાણ માટે અરજી કરો' },
    or: { name: 'କିଷାନ କ୍ରେଡିଟ୍ କାର୍ଡ', description: 'କୃଷି ଋଣ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ', description: 'ਖੇਤੀਬਾੜੀ ਕਰਜ਼ੇ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'کسان کریڈٹ کارڈ', description: 'زرعی قرض کے لیے درخواست دیں' }
  },
  34: {
    en: { name: 'Pesticide License', description: 'License for selling agro-inputs' },
    hi: { name: 'कीटनाशक लाइसेंस', description: 'कृषि-इनपुट बेचने का लाइसेंस' },
    te: { name: 'పురుగుమందుల లైసెన్స్', description: 'వ్యవసాయ-ఇన్‌పుట్‌లను విక్రయించడానికి లైసెన్స్' },
    kn: { name: 'ಕೀಟನಾಶಕ ಪರವಾನಗಿ', description: 'ಕೃಷಿ-ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು ಪರವานಗಿ' },
    ta: { name: 'பூச்சிக்கொல்லி உரிமம்', description: 'விவசாய உள்ளீடுகளை விற்பனை செய்வதற்கான உரிமம்' },
    ml: { name: 'കീടനാശിനി ലൈസൻസ്', description: 'കാർഷിക ഇൻപുട്ടുകൾ വിൽക്കുന്നതിനുള്ള ലൈസൻസ്' },
    mr: { name: 'कीटकनाशक परवाना', description: 'कृषी-इनपुट विकण्याचा परवाना' },
    bn: { name: 'কীটনাশক লাইসেন্স', description: 'কৃষি-ইনপুট বিক্রির লাইসেন্স' },
    gu: { name: 'જંતુનાશક લાઇસન્સ', description: 'કૃષિ-ઇનપુટ્સ વેચવા માટેનું લાઇસન્સ' },
    or: { name: 'କୀଟନାଶକ ଲାଇସେନ୍ସ', description: 'କୃଷି-ଇନପୁଟ୍ ବିକ୍ରୟ ପାଇଁ ଲାଇସେନ୍ସ' },
    pa: { name: 'ਕੀਟਨਾਸ਼ਕ ਲਾਇਸੈਂਸ', description: 'ਖੇਤੀ-ਇਨਪੁਟਸ ਵੇਚਣ ਦਾ ਲਾਇਸੈਂਸ' },
    ur: { name: 'کیڑے مار دوا کا لائسنس', description: 'زرعی ان پٹ فروخت کرنے کا لائسنس' }
  },
  35: {
    en: { name: 'Legal Heir Certificate', description: 'Obtain legal heir document' },
    hi: { name: 'कानूनी उत्तराधिकारी प्रमाण पत्र', description: 'कानूनी उत्तराधिकारी दस्तावेज़ प्राप्त करें' },
    te: { name: 'చట్టపరమైన వారసుల ధృవీకరణ పత్రం', description: 'చట్టపరమైన వారసుల పత్రాన్ని పొందండి' },
    kn: { name: 'ಕಾನೂನುಬದ್ಧ ಉತ್ತರಾಧಿಕಾರಿ ಪ್ರಮಾಣಪತ್ರ', description: 'ಕಾನೂನುಬದ್ಧ ಉತ್ತರಾಧಿಕಾರಿ ದಾಖಲೆಯನ್ನು ಪಡೆದುಕೊಳ್ಳಿ' },
    ta: { name: 'சட்டப்பூர்வ வாரிசு சான்றிதழ்', description: 'சட்டப்பூர்வ வாரிசு ஆவணத்தைப் பெறுங்கள்' },
    ml: { name: 'നിയമപരമായ അവകാശ സർട്ടിഫിക്കറ്റ്', description: 'നിയമപരമായ അവകാശ രേഖ നേടുക' },
    mr: { name: 'कायदेशीर वारस प्रमाणपत्र', description: 'कायदेशीर वारस दस्तऐवज मिळवा' },
    bn: { name: 'আইনী উত্তরাধিকারী শংসাপত্র', description: 'আইনী উত্তরাধিকারী নথি প্রাপ্ত করুন' },
    gu: { name: 'કાનૂની વારસદાર પ્રમાણપત્ર', description: 'કાનૂની વારસદાર દસ્તાવેજ મેળવો' },
    or: { name: 'ଆଇନଗତ ଉତ୍ତରାଧିକାରୀ ପ୍ରମାଣପତ୍ର', description: 'ଆଇନଗତ ଉତ୍ତରାଧିକାରୀ ଦଲିଲ ପ୍ରାପ୍ତ କରନ୍ତୁ' },
    pa: { name: 'ਕਾਨੂੰਨੀ ਵਾਰਸ ਸਰਟੀਫਿਕੇਟ', description: 'ਕਾਨੂੰਨੀ ਵਾਰਸ ਦਸਤਾਵੇਜ਼ ਪ੍ਰਾਪਤ ਕਰੋ' },
    ur: { name: 'قانونی وارث کا سرٹیفکیٹ', description: 'قانونی وارث کی دستاویز حاصل کریں' }
  },
  36: {
    en: { name: 'Marriage Registration', description: 'Apply for marriage certificate' },
    hi: { name: 'विवाह पंजीकरण', description: 'विवाह प्रमाण पत्र के लिए आवेदन करें' },
    te: { name: 'వివాహ నమోదు', description: 'వివాహ ధృవీకరణ పత్రం కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಮದುವೆ ನೋಂದಣಿ', description: 'ಮದುವೆ ಪ್ರಮಾಣಪತ್ರಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'திருமண பதிவு', description: 'திருமண சான்றிதழுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വിവാഹ രജിസ്ട്രേഷൻ', description: 'വിവാഹ സർട്ടിഫിക്കറ്റിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'विवाह नोंदणी', description: 'विवाह प्रमाणपत्रासाठी अर्ज करा' },
    bn: { name: 'বিবাহ নিবন্ধন', description: 'বিবাহের সার্টিফিকেটের জন্য আবেদন করুন' },
    gu: { name: 'લગ્ન નોંધણી', description: 'લગ્ન પ્રમાણપત્ર માટે અરજી કરો' },
    or: { name: 'ବିବାହ ପଞ୍ଜୀକରଣ', description: 'ବିବାହ ପ୍ରମାଣପତ୍ର ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਵਿਆਹ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਵਿਆਹ ਸਰਟੀਫਿਕੇਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'شادی کی رجسٹریشن', description: 'شادی کے سرٹیفکیٹ کے لیے درخواست دیں' }
  },
  37: {
    en: { name: 'Death Registration', description: 'Issue of death certificate' },
    hi: { name: 'मृत्यु पंजीकरण', description: 'मृत्यु प्रमाण पत्र जारी करना' },
    te: { name: 'మరణ నమోదు', description: 'మరణ ధృవీకరణ పత్రం జారీ' },
    kn: { name: 'ಮರಣ ನೋಂದಣಿ', description: 'ಮರಣ ಪ್ರಮಾಣಪತ್ರದ ನೀಡಿಕೆ' },
    ta: { name: 'இறப்பு பதிவு', description: 'இறப்பு சான்றிதழ் வழங்குதல்' },
    ml: { name: 'മരണ രജിസ്ട്രേഷൻ', description: 'മരണ സർട്ടിഫിക്കറ്റ് നൽകൽ' },
    mr: { name: 'मृत्यू नोंदणी', description: 'मृत्यू प्रमाणपत्राचे वितरण' },
    bn: { name: 'মৃত্যু নিবন্ধন', description: 'মৃত্যু সার্টিফিকেট প্রদান' },
    gu: { name: 'મૃત્યુ નોંધણી', description: 'મૃત્યુ પ્રમાણપત્રની રજૂઆત' },
    or: { name: 'ମୃତ୍ୟୁ ପଞ୍ଜୀକରଣ', description: 'ମୃତ୍ୟୁ ପ୍ରମାଣପତ୍ର ପ୍ରଦାନ' },
    pa: { name: 'ਮੌਤ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਮੌਤ ਸਰਟੀਫਿਕੇਟ ਜਾਰੀ ਕਰਨਾ' },
    ur: { name: 'موت کی رجسٹریشن', description: 'موت کا سرٹیفکیٹ جاری کرنا' }
  },
  38: {
    en: { name: 'Digital Signature Cert', description: 'Obtain DSC for e-filing' },
    hi: { name: 'डिजिटल हस्ताक्षर प्रमाणपत्र', description: 'ई-फाइलिंग के लिए डीएससी प्राप्त करें' },
    te: { name: 'డిజిటల్ సంతకం సర్టిఫికేట్', description: 'ఇ-ఫైలింగ్ కోసం DSCని పొందండి' },
    kn: { name: 'ಡಿಜಿಟಲ್ ಸಹಿ ಪ್ರಮಾಣಪತ್ರ', description: 'ಇ-ಫೈಲಿಂಗ್‌ಗಾಗಿ ಡಿಎಸ್‌ಸಿ ಪಡೆದುಕೊಳ್ಳಿ' },
    ta: { name: 'டிஜிட்டல் கையொப்ப சான்றிதழ்', description: 'இ-ஃபைலிங்கிற்கான டிஎஸ்சி பெறவும்' },
    ml: { name: 'ഡിജിറ്റൽ സിഗ്നേച്ചർ സർട്ടിഫിക്കറ്റ്', description: 'ഇ-ഫയലിംഗിനായി ഡിഎസ്‌സി നേടുക' },
    mr: { name: 'डिजिटल स्वाक्षरी प्रमाणपत्र', description: 'ई-फायलिंगसाठी डीएससी मिळवा' },
    bn: { name: 'ডিজিটাল স্বাক্ষর সার্টিফিকেট', description: 'ই-ফাইলিংয়ের জন্য ডিএসসি প্রাপ্ত করুন' },
    gu: { name: 'ડિજિટલ સિગ્નેચર સર્ટિફિકેટ', description: 'ઇ-ફાઇલિંગ માટે ડીએસસી મેળવો' },
    or: { name: 'ଡିଜିଟାଲ୍ ସ୍ଵାକ୍ଷର ପ୍ରମାଣପତ୍ର', description: 'ଇ-ଫାଇଲିଂ ପାଇଁ DSC ପ୍ରାପ୍ତ କରନ୍ତୁ' },
    pa: { name: 'ਡਿਜੀਟਲ ਦਸਤਖਤ ਸਰਟੀਫਿਕੇਟ', description: 'ਈ-ਫਾਈਲਿੰਗ ਲਈ ਡੀਐਸਸੀ ਪ੍ਰਾਪਤ ਕਰੋ' },
    ur: { name: 'ڈیجیٹل دستخطی سرٹیفکیٹ', description: 'ای فائلنگ کے لیے ڈی ایس سی حاصل کریں' }
  },
  39: {
    en: { name: 'Domain Registration (.in)', description: 'Register government subdomain' },
    hi: { name: 'डोमेन पंजीकरण (.in)', description: 'सरकारी सबडोमेन पंजीकृत करें' },
    te: { name: 'డొమైన్ నమోదు (.in)', description: 'ప్రభుత్వ సబ్‌డొమైన్‌ను నమోదు చేయండి' },
    kn: { name: 'ಡೊಮೇನ್ ನೋಂದಣಿ (.in)', description: 'ಸರ್ಕಾರಿ ಸಬ್‌ಡೊಮೇನ್ ನೋಂದಾಯಿಸಿ' },
    ta: { name: 'டொமைன் பதிவு (.in)', description: 'அரசு துணை டொமைனைப் பதிவு செய்யவும்' },
    ml: { name: 'ഡൊമെയ്ൻ രജിസ്ട്രേഷൻ (.in)', description: 'സർക്കാർ സബ്ഡൊമെയ്ൻ രജിസ്റ്റർ ചെയ്യുക' },
    mr: { name: 'डोमेन नोंदणी (.in)', description: 'सरकारी सबडोमेन नोंदणी करा' },
    bn: { name: 'ডোমেন নিবন্ধন (.in)', description: 'সরকারি সাবডোমেন নিবন্ধন করুন' },
    gu: { name: 'ડોમેન નોંધણી (.in)', description: 'સરકારી સબડોમેન રજીસ્ટર કરો' },
    or: { name: 'ଡୋମେନ୍ ପଞ୍ଜୀକରଣ (.in)', description: 'ସରକାରୀ ସବଡୋମେନ୍ ପଞ୍ଜୀକରଣ କରନ୍ତୁ' },
    pa: { name: 'ਡੋਮੇਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ (.in)', description: 'ਸਰਕਾਰੀ ਸਬਡੋਮੇਨ ਰਜਿਸਟਰ ਕਰੋ' },
    ur: { name: 'ڈومین رجسٹریشن (.in)', description: 'سرکاری سب ڈومین رجسٹر کریں' }
  },
  40: {
    en: { name: 'Arms License', description: 'Apply for new or renewal of license' },
    hi: { name: 'शस्त्र लाइसेंस', description: 'नए या लाइसेंस के नवीनीकरण के लिए आवेदन करें' },
    te: { name: 'ఆయుధాల లైసెన్స్', description: 'కొత్త లేదా లైసెన్స్ పునరుద్ధరణ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಶಸ್ತ್ರಾಸ್ತ್ರ ಪರವಾನಗಿ', description: 'ಹೊಸ ಅಥವಾ ಪರವಾನಗಿ ನವೀಕರಣಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'ஆயுத உரிமம்', description: 'புதிய அல்லது உரிமத்தை புதுப்பிக்க விண்ணப்பிக்கவும்' },
    ml: { name: 'ആയുധ ലൈസൻസ്', description: 'പുതിയതോ ലൈസൻസ് പുതുക്കുന്നതിനോ അപേക്ഷിക്കുക' },
    mr: { name: 'शस्त्र परवाना', description: 'नवीन किंवा परवान्याच्या नूतनीकरणासाठी अर्ज करा' },
    bn: { name: 'অস্ত্র লাইসেন্স', description: 'নতুন বা লাইসেন্স নবায়নের জন্য আবেদন করুন' },
    gu: { name: 'શસ્ત્ર લાઇસન્સ', description: 'નવા અથવા લાઇસન્સના નવીકરણ માટે અરજી કરો' },
    or: { name: 'ଅସ୍ତ୍ର ଲାଇସେନ୍ସ', description: 'ନୂତନ ବା ଲାଇସେନ୍ସର ନବୀକରଣ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਹਥਿਆਰ ਲਾਇਸੈਂਸ', description: 'ਨਵੇਂ ਜਾਂ ਲਾਇਸੈਂਸ ਦੇ ਨਵੀਨੀਕਰਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'اسلحہ لائسنس', description: 'نئے یا لائسنس کی تجدید کے لیے درخواست دیں' }
  },
  41: {
    en: { name: 'Ex-Servicemen Identity', description: 'Issue of ID card for retirees' },
    hi: { name: 'पूर्व सैनिक पहचान', description: 'सेवानिवृत्त लोगों के लिए आईडी कार्ड जारी करना' },
    te: { name: 'మాజీ సైనికుల గుర్తింపు', description: 'పదవీ విరమణ చేసినవారికి ID కార్డ్ జారీ' },
    kn: { name: 'ಮಾಜಿ ಸೈನಿಕರ ಗುರುತು', description: 'ನಿವೃತ್ತರಿಗೆ ಗುರುತಿನ ಚೀಟಿ ನೀಡಿಕೆ' },
    ta: { name: 'முன்னாள் ராணுவத்தினர் அடையாளம்', description: 'ஓய்வு பெற்றவர்களுக்கான அடையாள அட்டை வழங்குதல்' },
    ml: { name: 'വിമുക്തഭടന്മാരുടെ ഐഡന്റിറ്റി', description: 'വിരമിച്ചവർക്കുള്ള ഐഡി കാർഡ് നൽകൽ' },
    mr: { name: 'माजी सैनिक ओळख', description: 'निवृत्तांसाठी ओळखपत्र जारी करणे' },
    bn: { name: 'প্রাক্তন সৈনিক পরিচয়', description: 'অবসরপ্রাপ্তদের জন্য আইডি কার্ড প্রদান' },
    gu: { name: 'ભૂતપૂર્વ સૈનિકોની ઓળખ', description: 'નિવૃત્ત લોકો માટે આઈડી કાર્ડ જારી કરવું' },
    or: { name: 'ପୂର୍ବତନ ସୈନିକ ପରିଚୟ', description: 'ଅବସରପ୍ରାପ୍ତଙ୍କ ପାଇଁ ପରିଚୟ ପତ୍ର ପ୍ରଦାନ' },
    pa: { name: 'ਸਾਬਕਾ ਸੈਨਿਕਾਂ ਦੀ ਪਛਾਣ', description: 'ਸੇਵਾਮੁਕਤ ਲੋਕਾਂ ਲਈ ਆਈਡੀ ਕਾਰਡ ਜਾਰੀ ਕਰਨਾ' },
    ur: { name: 'سابق فوجی کی شناخت', description: 'ریٹائر ہونے والوں کے لیے شناختی کارڈ کا اجراء' }
  },
  42: {
    en: { name: 'Senior Citizen Card', description: 'State-issued senior citizen ID' },
    hi: { name: 'वरिष्ठ नागरिक कार्ड', description: 'राज्य-जारी वरिष्ठ नागरिक आईडी' },
    te: { name: 'సీనియర్ సిటిజన్ కార్డ్', description: 'రాష్ట్ర-జారీ చేసిన సీనియర్ సిటిజన్ ID' },
    kn: { name: 'ಹಿರಿಯ ನಾಗರಿಕ ಕಾರ್ಡ್', description: 'ರಾಜ್ಯ-ನೀಡಿದ ಹಿರಿಯ ನಾಗರಿಕ ಐಡಿ' },
    ta: { name: 'மூத்த குடிமக்கள் அட்டை', description: 'மாநிலம் வழங்கிய மூத்த குடிமக்கள் அடையாள அட்டை' },
    ml: { name: 'സീനിയർ സിറ്റിസൺ കാർഡ്', description: 'സംസ്ഥാനം നൽകുന്ന സീനിയർ സിറ്റിസൺ ഐഡി' },
    mr: { name: 'ज्येष्ठ नागरिक कार्ड', description: 'राज्य-जारी ज्येष्ठ नागरिक ओळखपत्र' },
    bn: { name: 'সিনিয়র সিটিজেন কার্ড', description: 'রাজ্য-জারি করা সিনিয়র সিটিজেন আইডি' },
    gu: { name: 'વરિષ્ઠ નાગરિક કાર્ડ', description: 'રાજ્ય દ્વારા જારી કરાયેલ વરિષ્ઠ નાગરિક આઈડી' },
    or: { name: 'ବରିଷ୍ଠ ନାଗରିକ କାର୍ଡ', description: 'ରାଜ୍ୟ-ପ୍ରଦତ୍ତ ବରିଷ୍ଠ ନାଗରିକ ପରିଚୟପତ୍ର' },
    pa: { name: 'ਸੀਨੀਅਰ ਸਿਟੀਜ਼ਨ ਕਾਰਡ', description: 'ਰਾਜ ਦੁਆਰਾ ਜਾਰੀ ਸੀਨੀਅਰ ਸਿਟੀਜ਼ਨ ਆਈਡੀ' },
    ur: { name: 'سینئر سٹیزن کارڈ', description: 'ریاست کا جاری کردہ سینئر سٹیزن شناختی کارڈ' }
  },
  43: {
    en: { name: 'Transgender ID Card', description: 'NSP application for TG ID' },
    hi: { name: 'ट्रांसजेंडर आईडी कार्ड', description: 'टीजी आईडी के लिए एनएसपी आवेदन' },
    te: { name: 'ట్రాన్స్‌జెండర్ ID కార్డ్', description: 'TG ID కోసం NSP దరఖాస్తు' },
    kn: { name: 'ಟ್ರಾನ್ಸ್ಜೆಂಡರ್ ಐಡಿ ಕಾರ್ಡ್', description: 'ಟಿಜಿ ಐಡಿಗಾಗಿ ಎನ್‌ಎಸ್‌ಪಿ ಅರ್ಜಿ' },
    ta: { name: 'திருநங்கைகள் அடையாள அட்டை', description: 'டிஜி ஐடிக்கான என்எஸ்பி விண்ணப்பம்' },
    ml: { name: 'ട്രാൻസ്‌ജെൻഡർ ഐഡി കാർഡ്', description: 'ടിജി ഐഡിക്കുള്ള എൻഎസ്പി അപേക്ഷ' },
    mr: { name: 'ट्रान्सजेंडर ओळखपत्र', description: 'टीजी आयडीसाठी एनएसपी अर्ज' },
    bn: { name: 'ট্রান্সজেন্ডার আইডি কার্ড', description: 'টিজি আইডির জন্য এনএসপি আবেদন' },
    gu: { name: 'ટ્રાન્સજેન્ડર આઈડી કાર્ડ', description: 'ટીજી આઈડી માટે એનએસપી અરજી' },
    or: { name: 'ଟ୍ରାନ୍ସଜେଣ୍ଡର ପରିଚୟ ପତ୍ର', description: 'TG ID ପାଇଁ NSP ଆବେଦନ' },
    pa: { name: 'ਟਰਾਂਸਜੈਂਡਰ ਆਈਡੀ ਕਾਰਡ', description: 'ਟੀਜੀ ਆਈਡੀ ਲਈ ਐਨਐਸਪੀ ਅਰਜ਼ੀ' },
    ur: { name: 'ٹرانس جینڈر شناختی کارڈ', description: 'ٹی جی آئی ڈی کے لیے این ایس پی درخواست' }
  },
  44: {
    en: { name: 'SC/ST Fellowship', description: 'Higher education financial aid' },
    hi: { name: 'एससी/एसटी फेलोशिप', description: 'उच्च शिक्षा वित्तीय सहायता' },
    te: { name: 'SC/ST ఫెలోషిప్', description: 'ఉన్నత విద్య ఆర్థిక సహాయం' },
    kn: { name: 'ಎಸ್‌ಸಿ/ಎಸ್‌ಟಿ ಫೆಲೋಶಿಪ್', description: 'ಉನ್ನತ ಶಿಕ್ಷಣ ಹಣಕಾಸು ನೆರವು' },
    ta: { name: 'SC/ST ஃபெலோஷிப்', description: 'உயர்கல்வி நிதி உதவி' },
    ml: { name: 'എസ്‌സി/എസ്ടി ഫെലോഷിപ്പ്', description: 'ഉന്നത വിദ്യാഭ്യാസ സാമ്പത്തിക സഹായം' },
    mr: { name: 'एससी/एसटी फेलोशिप', description: 'उच्च शिक्षण आर्थिक सहाय्य' },
    bn: { name: 'এসসি/এসটি ফেলোশিপ', description: 'উচ্চশিক্ষা আর্থিক সহায়তা' },
    gu: { name: 'એસસી/એસટી ફેલોશિપ', description: 'ઉચ્ચ શિક્ષણ નાણાકીય સહાય' },
    or: { name: 'SC/ST ଫେଲୋସିପ୍', description: 'ଉଚ୍ଚଶିକ୍ଷା ଆର୍ଥିକ ସହାୟତା' },
    pa: { name: 'SC/ST ਫੈਲੋਸ਼ਿਪ', description: 'ਉੱਚ ਸਿੱਖਿਆ ਵਿੱਤੀ ਸਹਾਇਤਾ' },
    ur: { name: 'ایس سی/ایس ٹی فیلوشپ', description: 'اعلیٰ تعلیم کی مالی امداد' }
  },
  45: {
    en: { name: 'Minority Scholarship', description: 'Welfare for minority students' },
    hi: { name: 'अल्पसंख्यक छात्रवृत्ति', description: 'अल्पसंख्यक छात्रों के लिए कल्याण' },
    te: { name: 'మైనారిటీ స్కాలర్‌షిప్', description: 'మైనారిటీ విద్యార్థుల సంక్షేమం' },
    kn: { name: 'ಅಲ್ಪಸಂಖ್ಯಾತ ವಿದ್ಯಾರ್ಥಿವೇತನ', description: 'ಅಲ್ಪಸಂಖ್ಯಾತ ವಿದ್ಯಾರ್ಥಿಗಳ ಕಲ್ಯಾಣ' },
    ta: { name: 'சிறுபான்மையினர் கல்வி உதவித்தொகை', description: 'சிறுபான்மை மாணவர்களுக்கான நலன்' },
    ml: { name: 'ന്യൂനപക്ഷ സ്കോളർഷിപ്പ്', description: 'ന്യൂനപക്ഷ വിദ്യാർത്ഥികളുടെ ക്ഷേമം' },
    mr: { name: 'अल्पसंख्याक शिष्यवृत्ती', description: 'अल्पसंख्याक विद्यार्थ्यांसाठी कल्याण' },
    bn: { name: 'সংখ্যালঘু স্কলারশিপ', description: 'সংখ্যালঘু শিক্ষার্থীদের জন্য কল্যাণ' },
    gu: { name: 'લઘુમતી શિષ્યવૃત્તિ', description: 'લઘુમતી વિદ્યાર્થીઓ માટે કલ્યાણ' },
    or: { name: 'ଅଳ୍ପସଂଖ୍ୟକ ସ୍କଲାରସିପ୍', description: 'ଅଳ୍ପସଂଖ୍ୟକ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ କଲ୍ୟାଣ' },
    pa: { name: 'ਘੱਟ ਗਿਣਤੀ ਸਕਾਲਰਸ਼ਿਪ', description: 'ਘੱਟ ਗਿਣਤੀ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਭਲਾਈ' },
    ur: { name: 'اقلیتی اسکالرشپ', description: 'اقلیتی طلباء کی فلاح و بہبود' }
  },
  46: {
    en: { name: 'Bank Account Opening', description: 'Open fresh bank account' },
    hi: { name: 'बैंक खाता खोलना', description: 'नया बैंक खाता खोलें' },
    te: { name: 'బ్యాంక్ ఖాతా తెరవడం', description: 'కొత్త బ్యాంక్ ఖాతాను తెరవండి' },
    kn: { name: 'ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯುವಿಕೆ', description: 'ಹೊಸ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ತೆರೆಯಿರಿ' },
    ta: { name: 'வங்கி கணக்கு தொடங்குதல்', description: 'புதிய வங்கி கணக்கைத் தொடங்கவும்' },
    ml: { name: 'ബാങ്ക് അക്കൗണ്ട് തുറക്കൽ', description: 'പുതിയ ബാങ്ക് അക്കൗണ്ട് തുറക്കുക' },
    mr: { name: 'बँक खाते उघडणे', description: 'नवीन बँक खाते उघडा' },
    bn: { name: 'ব্যাঙ্ক অ্যাকাউন্ট খোলা', description: 'নতুন ব্যাঙ্ক অ্যাকাউন্ট খুলুন' },
    gu: { name: 'બેંક ખાતું ખોલાવવું', description: 'નવું બેંક ખાતું ખોલો' },
    or: { name: 'ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟ୍ ଖୋଲିବା', description: 'ନୂତନ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟ୍ ଖୋଲନ୍ତୁ' },
    pa: { name: 'ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ', description: 'ਨਵਾਂ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹੋ' },
    ur: { name: 'بینک اکاؤنٹ کھولنا', description: 'نیا بینک اکاؤنٹ کھولیں' }
  },
  47: {
    en: { name: 'Residence Certificate', description: 'Apply for residence/domicile proof' },
    hi: { name: 'निवास प्रमाण पत्र', description: 'निवास/अधिवास प्रमाण के लिए आवेदन करें' },
    te: { name: 'నివాస ధృవీకరణ పత్రం', description: 'నివాస/స్థానికత నిరూపణ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ', description: 'ನಿವಾಸ ಪುರಾವೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'இருப்பிடச் சான்றிதழ்', description: 'இருப்பிடச் சான்றுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'താമസ സർട്ടിഫിക്കറ്റ്', description: 'താമസ തെളിവിനായി അപേക്ഷിക്കുക' },
    mr: { name: 'रहिवासी दाखला', description: 'रहिवासी पुराव्यासाठी अर्ज करा' },
    bn: { name: 'বসবাস সার্টিফিকেট', description: 'বসবাসের প্রমাণের জন্য আবেদন করুন' },
    gu: { name: 'રહેઠાણનું પ્રમાણપત્ર', description: 'રહેઠાણના પુરાવા માટે અરજી કરો' },
    or: { name: 'ନିବାସ ପ୍ରମାଣପତ୍ର', description: 'ନିବାସ ପ୍ରମାଣ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਰਿਹਾਇਸ਼ੀ ਸਰਟੀਫਿਕੇਟ', description: 'ਰਿਹਾਇਸ਼ ਦੇ ਸਬੂਤ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'رہائشی سرٹیفکیٹ', description: 'رہائش کے ثبوت کے لیے درخواست دیں' }
  },
  48: {
    en: { name: 'Health Insurance Enrollment', description: 'Enroll in state health schemes' },
    hi: { name: 'स्वास्थ्य बीमा नामांकन', description: 'राज्य स्वास्थ्य योजनाओं में नामांकन करें' },
    te: { name: 'ఆరోగ్య భీమా నమోదు', description: 'రాష్ట్ర ఆరోగ్య పథకాలలో నమోదు చేసుకోండి' },
    kn: { name: 'ಆರೋಗ್ಯ ವಿಮೆ ದಾಖಲಾತಿ', description: 'ರಾಜ್ಯ ಆರೋಗ್ಯ ಯೋಜನೆಗಳಿಗೆ ಸೇರಿಕೊಳ್ಳಿ' },
    ta: { name: 'காப்பீட்டு பதிவு', description: 'அரசு சுகாதாரத் திட்டங்களில் சேரவும்' },
    ml: { name: 'ആരോഗ്യ ഇൻഷുറൻസ് എൻറോൾമെന്റ്', description: 'സംസ്ഥാന ആരോഗ്യ പദ്ധതികളിൽ ചേരുക' },
    mr: { name: 'आरोग्य विमा नोंदणी', description: 'राज्य आरोग्य योजनांमध्ये नोंदणी करा' },
    bn: { name: 'স্বাস্থ্য বীমা তালিকাভুক্তি', description: 'রাজ্য স্বাস্থ্য স্কিমগুলিতে তালিকাভুক্ত হন' },
    gu: { name: 'આરોગ્ય વીમા નોંધણી', description: 'રાજ્યની આરોગ્ય યોજનાઓમાં નોંધણી કરો' },
    or: { name: 'ସ୍ୱାସ୍ଥ୍ୟ ବୀମା ପଞ୍ଜୀକରଣ', description: 'ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନାରେ ନାମ ଲେଖାନ୍ତୁ' },
    pa: { name: 'ਸਿਹਤ ਬੀਮਾ ਨਾਮਾਂਕਣ', description: 'ਰਾਜ ਦੀਆਂ ਸਿਹਤ ਸਕੀਮਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ' },
    ur: { name: 'ہیلتھ انشورنس اندراج', description: 'ریاستی صحت کی اسکیموں میں اندراج کریں' }
  },
  49: {
    en: { name: 'Medical Reimbursement', description: 'Claim medical expense refund' },
    hi: { name: 'चिकित्सा प्रतिपूर्ति', description: 'चिकित्सा व्यय वापसी का दावा करें' },
    te: { name: 'వైద్య రీయింబర్స్మెంట్', description: 'వైద్య ఖర్చుల రీఫండ్ క్లెయిమ్ చేయండి' },
    kn: { name: 'ವೈದ್ಯಕೀಯ ಪ್ರತಿपूर्ती', description: 'ವೈದ್ಯಕೀಯ ವೆಚ್ಚ ಮರುಪಾವತಿ ಪಡೆಯಿರಿ' },
    ta: { name: 'மருத்துவத் திருப்பிச் செலுத்துதல்', description: 'மருத்துவச் செலவுத் திரும்பப் பெற விண்ணப்பிக்கவும்' },
    ml: { name: 'മെഡിക്കൽ റീഇംബേഴ്‌സ്‌മെന്റ്', description: 'വൈദ്യശാസ്ത്ര ചെലവ് തിരികെ ലഭിക്കാൻ ക്ലെയിം ചെയ്യുക' },
    mr: { name: 'वैद्यकीय प्रतिपूर्ती', description: 'वैद्यकीय खर्चाच्या परताव्यासाठी अर्ज करा' },
    bn: { name: 'চিকিৎসা সংক্রান্ত প্রতিদান', description: 'চিকিৎসা খরচের রিফান্ডের জন্য আবেদন করুন' },
    gu: { name: 'તબીબી ભરપાઈ', description: 'તબીબી ખર્ચના રિફંડ માટે ક્લેમ કરો' },
    or: { name: 'ଡାକ୍ତରୀ ପ୍ରତିପୂର୍ତ୍ତି', description: 'ଡାକ୍ତରୀ ଖର୍ଚ୍ଚ ଫେରସ୍ତ ପାଇଁ ଦାବି କରନ୍ତୁ' },
    pa: { name: 'ਮੈਡੀਕਲ ਅਦਾਇਗੀ', description: 'ਮੈਡੀਕਲ ਖਰਚੇ ਵਾਪਸ ਲੈਣ ਦਾ ਦਾਅਵਾ ਕਰੋ' },
    ur: { name: 'طبی معاوضہ', description: 'طبی اخراجات کی واپسی کا دعویٰ کریں' }
  },
  50: {
    en: { name: 'Women Welfare Schemes', description: 'Apply for women support schemes' },
    hi: { name: 'महिला कल्याण योजनाएं', description: 'महिला सहायता योजनाओं के लिए आवेदन करें' },
    te: { name: 'మహిళా సంక్షేమ పథకాలు', description: 'మహిళా సహాయక పథకాల కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಮಹಿಳಾ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು', description: 'ಮಹಿಳಾ ಬೆಂಬಲ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'மகளிர் நலத் திட்டங்கள்', description: 'மகளிர் உதவித் திட்டங்களுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വനിതാ ക്ഷേമ പദ്ധതികൾ', description: 'വനിതാ സഹായ പദ്ധതികൾക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'महिला कल्याण योजना', description: 'महिला आधार योजनांसाठी अर्ज करा' },
    bn: { name: 'মহিলা কল্যাণ প্রকল্প', description: 'মহিলা সহায়তা প্রকল্পের জন্য আবেদন করুন' },
    gu: { name: 'મહિલા કલ્યાણ યોજનાઓ', description: 'મહિલા સહાય યોજનાઓ માટે અરજી કરો' },
    or: { name: 'ମହିଳା କଲ୍ୟାଣ ଯୋଜନା', description: 'ମହିଳା ସହାୟତା ଯୋଜନା ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਮਹਿਲਾ ਭਲਾਈ ਸਕੀਮਾਂ', description: 'ਮਹਿਲਾ ਸਹਾਇਤਾ ਸਕੀਮਾਂ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'خواتین کی بہبود کی اسکیمیں', description: 'خواتین کی امدادی اسکیموں کے لیے درخواست دیں' }
  },
  51: {
    en: { name: 'Building Worker Registration', description: 'Register as construction worker' },
    hi: { name: 'भवन निर्माण श्रमिक पंजीकरण', description: 'निर्माण श्रमिक के रूप में पंजीकरण करें' },
    te: { name: 'భవన నిర్మాణ కార్మికుల నమోదు', description: 'నిర్మాణ కార్మికుడిగా నమోదు చేసుకోండి' },
    kn: { name: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರ ನೋಂದಣಿ', description: 'ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕರಾಗಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಿ' },
    ta: { name: 'கட்டுமானத் தொழிலாளர் பதிவு', description: 'கட்டுமானத் தொழிலாளராகப் பதிவு செய்யுங்கள்' },
    ml: { name: 'കെട്ടിട നിർമ്മാണ തൊഴിലാളി രജിസ്ട്രേഷൻ', description: 'നിർമ്മാണ തൊഴിലാളിയായി രജിസ്റ്റർ ചെയ്യുക' },
    mr: { name: 'बांधकाम कामगार नोंदणी', description: 'बांधकाम कामगार म्हणून नोंदणी करा' },
    bn: { name: 'নির্মাণ শ্রমিক নিবন্ধন', description: 'নির্মাণ শ্রমিক হিসেবে নিবন্ধন করুন' },
    gu: { name: 'બાંધકામ શ્રમિક નોંધણી', description: 'બાંધકામ શ્રમિક તરીકે નોંધણી કરો' },
    or: { name: 'ନିର୍ମାଣ ଶ୍ରମିକ ପଞ୍ଜୀକରଣ', description: 'ନିର୍ମାଣ ଶ୍ରମିକ ଭାବରେ ପଞ୍ଜୀକୃତ ହୁଅନ୍ତୁ' },
    pa: { name: 'ਬਿਲਡਿੰਗ ਵਰਕਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਉਸਾਰੀ ਕਾਮੇ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ' },
    ur: { name: 'بلڈنگ ورکر رجسٹریشن', description: 'تعمیراتی کارکن کے طور پر رجسٹر ہوں' }
  },
  52: {
    en: { name: 'Housing Scheme Application', description: 'Apply for housing allotment' },
    hi: { name: 'आवास योजना आवेदन', description: 'आवास आवंटन के लिए आवेदन करें' },
    te: { name: 'గృహ నిర్మాణ పథకం దరఖాస్తు', description: 'గృహ కేటాయింపు కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ವಸತಿ ಯೋಜನೆ ಅರ್ಜಿ', description: 'ಮನೆ ಹಂಚಿಕೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'வீட்டு வசதித் திட்ட விண்ணப்பம்', description: 'வீடு ஒதுக்கீட்டிற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'ഭവന പദ്ധതി അപേക്ഷ', description: 'വീട് ಅലോട്ട്‌മെന്റിനായി ಅപേക്ഷിക്കുക' },
    mr: { name: 'गृहनिर्माण योजना अर्ज', description: 'घर वाटपासाठी अर्ज करा' },
    bn: { name: 'গৃহায়ন প্রকল্প আবেদন', description: 'ঘর বরাদ্দের জন্য আবেদন করুন' },
    gu: { name: 'આવાસ યોજના અરજી', description: 'આવાસ ફાળવણી માટે અરજી કરો' },
    or: { name: 'ଗୃହ ନିର୍ମାଣ ଯୋଜନା ଆବେଦନ', description: 'ଘର ବଣ୍ଟନ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਹਾਊਸਿੰਗ ਸਕੀਮ ਅਰਜ਼ੀ', description: 'ਘਰ ਦੀ ਅਲਾਟਮੈਂਟ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'ہاؤسنگ اسکیم کی درخواست', description: 'گھر کی الاٹمنٹ کے لیے درخواست دیں' }
  },
  53: {
    en: { name: 'FIR Registration', description: 'Online police complaint filing' },
    hi: { name: 'एफआईआर पंजीकरण', description: 'ऑनलाइन पुलिस शिकायत दर्ज करना' },
    te: { name: 'FIR నమోదు', description: 'ఆన్‌లైన్ పోలీసు ఫిర్యాదు నమోదు' },
    kn: { name: 'FIR ನೋಂದಣಿ', description: 'ಆನ್‌ಲೈನ್ ಪೊಲೀಸ್ ದೂರು ದಾಖಲಿಸುವುದು' },
    ta: { name: 'எஃப்ஐஆர் பதிவு', description: 'ஆன்லைன் போலீஸ் புகார் தாக்கல்' },
    ml: { name: 'എഫ്ഐആർ രജിസ്ട്രേഷൻ', description: 'ഓൺലൈൻ പോലീസ് പരാതി നൽകൽ' },
    mr: { name: 'एफआयआर नोंदणी', description: 'ऑनलाइन पोलिस तक्रार नोंदवणे' },
    bn: { name: 'এফআইআর নিবন্ধন', description: 'অনলাইন পুলিশ অভিযোগ দায়ের' },
    gu: { name: 'એફઆઈઆર નોંધણી', description: 'ઓનલાઇન પોલીસ ફરિયાદ નોંધાવવી' },
    or: { name: 'FIR ପଞ୍ଜୀକରଣ', description: 'ଅନଲାଇନ୍ ପୋଲିସ୍ ଅଭିଯୋଗ ଦାଖଲ' },
    pa: { name: 'ਐਫਆਈਆਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', description: 'ਆਨਲਾਈਨ ਪੁਲਿਸ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨਾ' },
    ur: { name: 'ایف آئی آر رجسٹریشن', description: 'آن لائن پولیس شکایت درج کرنا' }
  },
  54: {
    en: { name: 'Police Verification', description: 'Apply for character/police check' },
    hi: { name: 'पुलिस सत्यापन', description: 'चरित्र/पुलिस जांच के लिए आवेदन करें' },
    te: { name: 'పోలీసు వెరిఫికేషన్', description: 'క్యారెక్టర్/పోలీసు తనిఖీ కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ', description: 'ಪೊಲೀಸ್ ಪರಿಶೀಲನೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'காவல்துறை சரிபார்ப்பு', description: 'காவல்துறை சரிபார்ப்பிற்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'പോലീസ് വെരിഫിക്കേഷൻ', description: 'പോലീസ് പരിശോധനയ്ക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'पोलिस पडताळणी', description: 'चारित्र्य पडताळणीसाठी अर्ज करा' },
    bn: { name: 'পুলিশ যাচাইকরণ', description: 'চরিত্র যাচাইয়ের জন্য আবেদন করুন' },
    gu: { name: 'પોલીસ વેરિફિકેશન', description: 'પોલીસ તપાસ માટે અરજી કરો' },
    or: { name: 'ପୋଲିସ୍ ଯାଞ୍ଚ', description: 'ପୋଲିସ୍ ଯାଞ୍ଚ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਪੁਲਿਸ ਵੈਰੀਫਿਕੇਸ਼ਨ', description: 'ਚਰਿੱਤਰ ਦੀ ਪੜਤਾਲ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'پولیس ویریفیکیشن', description: 'کردار کی جانچ کے لیے درخواست دیں' }
  },
  55: {
    en: { name: 'Electricity / Water Connection', description: 'Apply for new utility connections' },
    hi: { name: 'बिजली / पानी कनेक्शन', description: 'नए उपयोगिता कनेक्शन के लिए आवेदन करें' },
    te: { name: 'విద్యుత్ / నీటి కనెక్షన్', description: 'కొత్త యుటిలిటీ కనెక్షన్ల కోసం దరఖాస్తు చేసుకోండి' },
    kn: { name: 'ವಿದ್ಯುತ್ / ನೀರಿನ ಸಂಪರ್ಕ', description: 'ಹೊಸ ಯುಟಿಲಿಟಿ ಸಂಪರ್ಕಗಳಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
    ta: { name: 'மின்சாரம் / குடிநீர் இணைப்பு', description: 'புதிய பயன்பாட்டு இணைப்புகளுக்கு விண்ணப்பிக்கவும்' },
    ml: { name: 'വൈദ്യുതി / ജല കണക്ഷൻ', description: 'പുതിയ കണക്ഷനുകൾക്കായി അപേക്ഷിക്കുക' },
    mr: { name: 'वीज / पाणी कनेक्शन', description: 'नवीन कनेक्शनसाठी अर्ज करा' },
    bn: { name: 'বিদ্যুৎ / জল সংযোগ', description: 'নতুন সংযোগের জন্য আবেদন করুন' },
    gu: { name: 'વીજળી / પાણી કનેક્શન', description: 'નવા કનેક્શન માટે અરજી કરો' },
    or: { name: 'ବିଦ୍ୟୁତ୍ / ଜଳ ସଂଯୋଗ', description: 'ନୂତନ ସଂଯୋଗ ପାଇଁ ଆବେଦନ କରନ୍ତୁ' },
    pa: { name: 'ਬਿਜਲੀ / ਪਾਣੀ ਕੁਨੈਕਸ਼ਨ', description: 'ਨਵੇਂ ਕੁਨੈਕਸ਼ਨਾਂ ਲਈ ਅਰਜ਼ੀ ਦਿਓ' },
    ur: { name: 'بجلی / پانی کا کنکشن', description: 'نئے کنکشن کے لیے درخواست دیں' }
  }
};

// Helper function to get translated service
export function getTranslatedService(service: GovernmentService, languageCode: string): GovernmentService {
  const translation = SERVICE_TRANSLATIONS[service.id]?.[languageCode];
  if (translation) {
    return {
      ...service,
      name: translation.name,
      description: translation.description
    };
  }
  return service;
}

export const GOVERNMENT_SERVICES: GovernmentService[] = SERVICE_DEFINITIONS.map(service => {
  const fields = [...service.fields];
  const midIndex = Math.floor(fields.length / 2);
  fields.splice(midIndex, 0, APPLICANT_PHOTO_FIELD);
  return {
    ...service,
    fields
  };
});

export const SERVICE_CATEGORIES = [
  'Identity', 'Taxation', 'Travel', 'Transportation', 'Finance', 'Subsidy', 'Employment', 'Pension', 'Health', 'Education', 'Social', 'Rations', 'Legal', 'Housing', 'Utilities', 'Agriculture', 'Business', 'Technology',
];

export const LANGUAGE_OPTIONS = [
  { code: 'en-IN', name: 'English', label: 'English' },
  { code: 'hi-IN', name: 'Hindi', label: 'हिन्दी' },
  { code: 'te-IN', name: 'Telugu', label: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', label: 'ಕನ್ನಡ' },
  { code: 'ta-IN', name: 'Tamil', label: 'தமிழ்' },
  { code: 'ml-IN', name: 'Malayalam', label: 'മലയാളം' },
];

export interface SubmittedService {
  id: string;
  serviceId: number;
  serviceName: string;
  qrCode: string;
  qrUrl?: string;
  status?: 'submitted' | 'under_review' | 'processing' | 'completed' | 'ready_for_collection' | 'collected' | 'rejected';
  statusLabel?: string;
  submittedAt: number;
  expiresAt: number;
  userDetails: Record<string, string>;
  viewedBy?: string[];
  isExpired?: boolean;
  adminNotes?: string;
  statusHistory?: Array<{
    status: string;
    changedAt: number;
    changedBy?: string;
    notes?: string;
  }>;
}


export interface QRCodeData {
  submissionId: string;
  serviceName: string;
  submittedAt: number;
  userInfo: {
    name: string;
    email: string;
    phone: string;
  };
}
