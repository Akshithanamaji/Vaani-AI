'use client';

import React from 'react';

interface DocumentCardProps {
  serviceId: number;
  serviceName: string;
  userDetails: Record<string, string>;
  submissionId: string;
  status: string;
}

// Generate a random-looking but consistent ID based on submission ID
const generateDocNumber = (submissionId: string, prefix: string): string => {
  const hash = submissionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num = (hash * 12345) % 1000000000000;
  return `${prefix}${num.toString().padStart(12, '0')}`;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  serviceId,
  serviceName,
  userDetails,
  submissionId,
  status
}) => {
  const name = userDetails.name || userDetails.full_name || userDetails.printed_name || userDetails.applicant_name || 'Applicant Name';
  const dob = userDetails.dob || userDetails.date_of_birth || '01/01/1990';
  const gender = userDetails.gender || 'Not Specified';
  const address = [
    userDetails.house_name,
    userDetails.street_area,
    userDetails.village_city || userDetails.city || userDetails.village,
    userDetails._district,
    userDetails._state,
    userDetails.pincode
  ].filter(Boolean).join(', ') || 'Address on Record';
  const mobile = userDetails.mobile || userDetails.phone || userDetails.mobile_number || '9XXXXXXXXX';
  const fatherName = userDetails.father_name || userDetails.fathers_name || userDetails.parent_name || "Father's Name";

  // Common card wrapper styles
  const cardStyles = "w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl border-2";
  const headerStyles = "text-center py-3 text-white font-bold";
  const bodyStyles = "p-4 space-y-2";
  const labelStyles = "text-[10px] text-gray-500 uppercase tracking-wider";
  const valueStyles = "text-sm font-semibold text-gray-800";
  const photoPlaceholder = (
    <div className="w-20 h-24 bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400 text-xs">
      PHOTO
    </div>
  );

  // Service-specific card templates
  const renderCard = () => {
    switch (serviceId) {
      // 1. Aadhaar Card
      case 1:
        return (
          <div className={`${cardStyles} border-orange-300 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-orange-500 to-orange-600`}>
              <div className="text-lg">🆔 AADHAAR CARD</div>
              <div className="text-xs opacity-90">Unique Identification Authority of India</div>
            </div>
            <div className={bodyStyles}>
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                  <div><span className={labelStyles}>Gender:</span> <span className={valueStyles}>{gender}</span></div>
                </div>
              </div>
              <div className="pt-2 border-t mt-2">
                <div className={labelStyles}>Address:</div>
                <div className="text-xs text-gray-700">{address}</div>
              </div>
              <div className="text-center mt-3 py-2 bg-orange-50 rounded-lg">
                <div className={labelStyles}>Aadhaar Number</div>
                <div className="text-xl font-mono font-bold tracking-widest text-orange-700">
                  {generateDocNumber(submissionId, '').slice(0, 12).replace(/(\d{4})/g, '$1 ').trim()}
                </div>
              </div>
            </div>
          </div>
        );

      // 2. PAN Card
      case 2:
        return (
          <div className={`${cardStyles} border-blue-300 bg-gradient-to-br from-blue-50 to-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-blue-600 to-blue-800`}>
              <div className="text-lg">💳 PAN CARD</div>
              <div className="text-xs opacity-90">Income Tax Department, Govt. of India</div>
            </div>
            <div className={bodyStyles}>
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Father's Name:</span> <span className={valueStyles}>{fatherName}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                </div>
              </div>
              <div className="text-center mt-3 py-2 bg-blue-50 rounded-lg">
                <div className={labelStyles}>Permanent Account Number</div>
                <div className="text-xl font-mono font-bold tracking-widest text-blue-700">
                  {generateDocNumber(submissionId, 'ABCDE').slice(0, 10)}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>🔒 Digitally Verified</span>
                <span>Valid: Lifetime</span>
              </div>
            </div>
          </div>
        );

      // 3. Voter ID
      case 3:
        return (
          <div className={`${cardStyles} border-purple-300 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-purple-600 to-indigo-600`}>
              <div className="text-lg">🗳️ VOTER ID CARD</div>
              <div className="text-xs opacity-90">Election Commission of India</div>
            </div>
            <div className={bodyStyles}>
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Father's Name:</span> <span className={valueStyles}>{fatherName}</span></div>
                  <div><span className={labelStyles}>Gender:</span> <span className={valueStyles}>{gender}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                </div>
              </div>
              <div className="text-center mt-3 py-2 bg-purple-50 rounded-lg">
                <div className={labelStyles}>EPIC Number</div>
                <div className="text-xl font-mono font-bold tracking-widest text-purple-700">
                  {generateDocNumber(submissionId, 'XYZ').slice(0, 10)}
                </div>
              </div>
            </div>
          </div>
        );

      // 4. Birth Certificate
      case 4:
        return (
          <div className={`${cardStyles} border-pink-300 bg-gradient-to-br from-pink-50 to-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-pink-500 to-rose-500`}>
              <div className="text-lg">👶 BIRTH CERTIFICATE</div>
              <div className="text-xs opacity-90">Registrar of Births & Deaths</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-pink-50 p-2 rounded">
                  <div className={labelStyles}>Child's Name</div>
                  <div className={valueStyles}>{name}</div>
                </div>
                <div className="bg-pink-50 p-2 rounded">
                  <div className={labelStyles}>Date of Birth</div>
                  <div className={valueStyles}>{dob}</div>
                </div>
              </div>
              <div className="bg-pink-50 p-2 rounded text-center">
                <div className={labelStyles}>Place of Birth</div>
                <div className={valueStyles}>{userDetails.place_of_birth || userDetails._district || 'Hospital/Home'}</div>
              </div>
              <div className="text-center py-2 border-t">
                <div className={labelStyles}>Registration Number</div>
                <div className="text-lg font-mono font-bold text-pink-600">
                  BC/{generateDocNumber(submissionId, '').slice(0, 8)}/2024
                </div>
              </div>
            </div>
          </div>
        );

      // 5. Caste Certificate
      case 5:
        return (
          <div className={`${cardStyles} border-amber-300 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-amber-500 to-yellow-500`}>
              <div className="text-lg">📜 CASTE CERTIFICATE</div>
              <div className="text-xs opacity-90">Revenue Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center border-b pb-3">
                <div className={labelStyles}>This is to certify that</div>
                <div className="text-lg font-bold text-amber-700">{name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-50 p-2 rounded text-center">
                  <div className={labelStyles}>Caste</div>
                  <div className={valueStyles}>{userDetails.caste || userDetails.community || 'As per Record'}</div>
                </div>
                <div className="bg-amber-50 p-2 rounded text-center">
                  <div className={labelStyles}>Sub-Caste</div>
                  <div className={valueStyles}>{userDetails.sub_caste || 'N/A'}</div>
                </div>
              </div>
              <div className="text-center py-2 bg-amber-50 rounded">
                <div className={labelStyles}>Certificate Number</div>
                <div className="font-mono font-bold text-amber-600">
                  CC/{generateDocNumber(submissionId, '').slice(0, 10)}
                </div>
              </div>
            </div>
          </div>
        );

      // 6. Income Certificate
      case 6:
        return (
          <div className={`${cardStyles} border-green-300 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-600 to-emerald-600`}>
              <div className="text-lg">📊 INCOME CERTIFICATE</div>
              <div className="text-xs opacity-90">Revenue Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center">
                <div className={labelStyles}>Name of Applicant</div>
                <div className="text-lg font-bold text-green-700">{name}</div>
              </div>
              <div className="bg-green-50 p-3 rounded text-center">
                <div className={labelStyles}>Annual Income</div>
                <div className="text-2xl font-bold text-green-600">₹{userDetails.annual_income || userDetails.income || '2,50,000'}</div>
              </div>
              <div className="text-center py-2 border-t">
                <div className={labelStyles}>Certificate Number</div>
                <div className="font-mono font-bold text-green-600">
                  IC/{generateDocNumber(submissionId, '').slice(0, 10)}
                </div>
              </div>
            </div>
          </div>
        );

      // 7. Passport
      case 7:
        return (
          <div className={`${cardStyles} border-blue-900 bg-gradient-to-br from-blue-900 to-blue-800`}>
            <div className="text-center py-4">
              <div className="text-3xl mb-1">🛂</div>
              <div className="text-lg text-yellow-400 font-bold">PASSPORT</div>
              <div className="text-xs text-blue-300">Republic of India</div>
            </div>
            <div className="bg-white m-2 rounded-lg p-4 space-y-2">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1 text-xs">
                  <div><span className="text-gray-500">Name:</span> <span className="font-bold">{name.toUpperCase()}</span></div>
                  <div><span className="text-gray-500">DOB:</span> <span className="font-bold">{dob}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="font-bold">{gender}</span></div>
                  <div><span className="text-gray-500">Place:</span> <span className="font-bold">{userDetails._district || 'INDIA'}</span></div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className={labelStyles}>Passport Number</div>
                <div className="text-lg font-mono font-bold tracking-widest text-blue-900">
                  {generateDocNumber(submissionId, 'P').slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        );

      // 8. Driving License
      case 8:
        return (
          <div className={`${cardStyles} border-red-300 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-red-600 to-red-700`}>
              <div className="text-lg">🚗 DRIVING LICENSE</div>
              <div className="text-xs opacity-90">Transport Department</div>
            </div>
            <div className={bodyStyles}>
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                  <div><span className={labelStyles}>Blood Group:</span> <span className={valueStyles}>{userDetails.blood_group || 'O+'}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-red-50 p-2 rounded text-center">
                  <div className={labelStyles}>Issue Date</div>
                  <div className="text-xs font-bold">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="bg-red-50 p-2 rounded text-center">
                  <div className={labelStyles}>Valid Till</div>
                  <div className="text-xs font-bold">{new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-center mt-2 py-2 bg-red-50 rounded">
                <div className={labelStyles}>DL Number</div>
                <div className="font-mono font-bold text-red-600">
                  {userDetails._state?.slice(0, 2).toUpperCase() || 'IN'}-{generateDocNumber(submissionId, '').slice(0, 13)}
                </div>
              </div>
            </div>
          </div>
        );

      // 9. Vehicle Registration (RC)
      case 9:
        return (
          <div className={`${cardStyles} border-gray-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-gray-700 to-gray-900`}>
              <div className="text-lg">🏍️ REGISTRATION CERTIFICATE</div>
              <div className="text-xs opacity-90">Regional Transport Office</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="bg-yellow-100 p-3 rounded-lg text-center border-2 border-yellow-400">
                <div className={labelStyles}>Registration Number</div>
                <div className="text-2xl font-mono font-black tracking-widest">
                  {userDetails._state?.slice(0, 2).toUpperCase() || 'MH'}-{Math.floor(Math.random() * 99).toString().padStart(2, '0')}-{String.fromCharCode(65 + Math.floor(Math.random() * 26))}{String.fromCharCode(65 + Math.floor(Math.random() * 26))}-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center"><div className={labelStyles}>Owner</div><div className="text-xs font-bold">{name}</div></div>
                <div className="text-center"><div className={labelStyles}>Vehicle Class</div><div className="text-xs font-bold">{userDetails.vehicle_type || 'LMV'}</div></div>
              </div>
            </div>
          </div>
        );

      // 10. HSRP
      case 10:
        return (
          <div className={`${cardStyles} border-yellow-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-yellow-500 to-amber-500`}>
              <div className="text-lg">🔢 HIGH SECURITY REGISTRATION PLATE</div>
            </div>
            <div className="p-4 text-center">
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                <div className="text-3xl font-mono font-black tracking-widest">
                  {userDetails._state?.slice(0, 2).toUpperCase() || 'DL'}-00-XX-0000
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                ✓ Chromium Hologram ✓ Laser Branding ✓ IND Emblem
              </div>
            </div>
          </div>
        );

      // 11. Railway Senior Citizen Concession
      case 11:
        return (
          <div className={`${cardStyles} border-orange-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-orange-600 to-red-600`}>
              <div className="text-lg">🚂 RAILWAY CONCESSION CARD</div>
              <div className="text-xs opacity-90">Indian Railways</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Age:</span> <span className={valueStyles}>{userDetails.age || '60+'}</span></div>
                  <div><span className={labelStyles}>Concession:</span> <span className="text-green-600 font-bold">40% OFF</span></div>
                </div>
              </div>
              <div className="text-center py-2 bg-orange-50 rounded">
                <div className={labelStyles}>Card Number</div>
                <div className="font-mono font-bold text-orange-600">
                  IRSC/{generateDocNumber(submissionId, '').slice(0, 10)}
                </div>
              </div>
            </div>
          </div>
        );

      // 12. Bank KYC
      case 12:
        return (
          <div className={`${cardStyles} border-blue-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-blue-700 to-blue-900`}>
              <div className="text-lg">🏛️ KYC VERIFICATION</div>
              <div className="text-xs opacity-90">Know Your Customer</div>
            </div>
            <div className="p-4 text-center space-y-3">
              <div className="text-5xl">✅</div>
              <div className="text-lg font-bold text-green-600">KYC VERIFIED</div>
              <div className={valueStyles}>{name}</div>
              <div className="bg-blue-50 p-3 rounded">
                <div className={labelStyles}>Reference Number</div>
                <div className="font-mono font-bold text-blue-600">KYC{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 13. EPF
      case 13:
        return (
          <div className={`${cardStyles} border-indigo-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-indigo-600 to-purple-600`}>
              <div className="text-lg">💰 EPF WITHDRAWAL</div>
              <div className="text-xs opacity-90">EPFO India</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Withdrawal Approved</div>
                <div className="text-2xl font-bold text-green-600">₹{userDetails.amount || '50,000'}</div>
              </div>
              <div className="bg-indigo-50 p-2 rounded">
                <div className={labelStyles}>UAN</div>
                <div className="font-mono font-bold">{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 14. ITR
      case 14:
        return (
          <div className={`${cardStyles} border-green-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-700 to-green-900`}>
              <div className="text-lg">📈 ITR ACKNOWLEDGEMENT</div>
              <div className="text-xs opacity-90">Income Tax Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center">
                <div className={labelStyles}>Assessee Name</div>
                <div className={valueStyles}>{name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className={labelStyles}>AY</div>
                  <div className="font-bold">2024-25</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className={labelStyles}>Status</div>
                  <div className="font-bold text-green-600">Filed</div>
                </div>
              </div>
              <div className="text-center py-2 bg-green-50 rounded">
                <div className={labelStyles}>Acknowledgement Number</div>
                <div className="font-mono font-bold text-green-700">{generateDocNumber(submissionId, '').slice(0, 15)}</div>
              </div>
            </div>
          </div>
        );

      // 15. GST Registration
      case 15:
        return (
          <div className={`${cardStyles} border-teal-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-teal-600 to-cyan-600`}>
              <div className="text-lg">📝 GST REGISTRATION</div>
              <div className="text-xs opacity-90">Goods & Services Tax</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-center">
                <div className={labelStyles}>Trade Name</div>
                <div className={valueStyles}>{userDetails.business_name || name}</div>
              </div>
              <div className="text-center py-3 bg-teal-50 rounded-lg">
                <div className={labelStyles}>GSTIN</div>
                <div className="text-lg font-mono font-bold tracking-wider text-teal-700">
                  {(userDetails._state?.slice(0, 2).toUpperCase() || '27')}{generateDocNumber(submissionId, 'ABCDE').slice(0, 13)}Z
                </div>
              </div>
            </div>
          </div>
        );

      // 16. Mudra Loan
      case 16:
        return (
          <div className={`${cardStyles} border-orange-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-orange-500 to-yellow-500`}>
              <div className="text-lg">🏦 MUDRA LOAN SANCTION</div>
              <div className="text-xs opacity-90">Pradhan Mantri Mudra Yojana</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Loan Sanctioned</div>
                <div className="text-2xl font-bold text-green-600">₹{userDetails.loan_amount || '2,00,000'}</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className={labelStyles}>Category</div>
                <div className="font-bold text-orange-600">{userDetails.mudra_category || 'SHISHU'}</div>
              </div>
            </div>
          </div>
        );

      // 17. Old Age Pension
      case 17:
        return (
          <div className={`${cardStyles} border-purple-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-purple-600 to-violet-600`}>
              <div className="text-lg">👴 OLD AGE PENSION</div>
              <div className="text-xs opacity-90">Social Welfare Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Age:</span> <span className={valueStyles}>{userDetails.age || '65'}</span></div>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded text-center">
                <div className={labelStyles}>Monthly Pension</div>
                <div className="text-xl font-bold text-green-600">₹{userDetails.pension_amount || '1,000'}/month</div>
              </div>
              <div className="text-center py-2 bg-purple-50 rounded">
                <div className={labelStyles}>Pension ID</div>
                <div className="font-mono font-bold text-purple-600">OAP/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 18. Widow Pension
      case 18:
        return (
          <div className={`${cardStyles} border-rose-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-rose-600 to-pink-600`}>
              <div className="text-lg">👵 WIDOW PENSION</div>
              <div className="text-xs opacity-90">Social Welfare Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded text-center">
                <div className={labelStyles}>Monthly Pension</div>
                <div className="text-xl font-bold text-green-600">₹{userDetails.pension_amount || '1,500'}/month</div>
              </div>
              <div className="text-center py-2 bg-rose-50 rounded">
                <div className={labelStyles}>Pension ID</div>
                <div className="font-mono font-bold text-rose-600">WP/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 19. PM-Kisan
      case 19:
        return (
          <div className={`${cardStyles} border-green-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-600 to-lime-600`}>
              <div className="text-lg">🌾 PM-KISAN SAMMAN NIDHI</div>
              <div className="text-xs opacity-90">Ministry of Agriculture</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Annual Benefit</div>
                <div className="text-2xl font-bold text-green-600">₹6,000/year</div>
                <div className="text-xs text-gray-500">(₹2,000 x 3 installments)</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className={labelStyles}>Farmer ID</div>
                <div className="font-mono font-bold text-green-700">PMK{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 20. Ration Card
      case 20:
        return (
          <div className={`${cardStyles} border-amber-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-amber-600 to-orange-600`}>
              <div className="text-lg">🍚 RATION CARD</div>
              <div className="text-xs opacity-90">Food & Civil Supplies Dept.</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Head of Family:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Card Type:</span> <span className="font-bold text-orange-600">{userDetails.card_type || 'BPL'}</span></div>
                  <div><span className={labelStyles}>Members:</span> <span className={valueStyles}>{userDetails.family_members || '4'}</span></div>
                </div>
              </div>
              <div className="text-center py-2 bg-amber-50 rounded">
                <div className={labelStyles}>Ration Card Number</div>
                <div className="font-mono font-bold text-amber-700">RC/{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 21-22. Scholarships
      case 21:
      case 22:
        return (
          <div className={`${cardStyles} border-indigo-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-indigo-600 to-blue-600`}>
              <div className="text-lg">🎓 {serviceId === 21 ? 'POST-MATRIC' : 'PRE-MATRIC'} SCHOLARSHIP</div>
              <div className="text-xs opacity-90">Ministry of Social Justice</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Scholarship Amount</div>
                <div className="text-2xl font-bold text-green-600">₹{serviceId === 21 ? '15,000' : '5,000'}/year</div>
              </div>
              <div className="bg-indigo-50 p-2 rounded">
                <div className={labelStyles}>Application ID</div>
                <div className="font-mono font-bold text-indigo-700">{serviceId === 21 ? 'PMS' : 'PRMS'}{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 23. Ayushman Bharat
      case 23:
        return (
          <div className={`${cardStyles} border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50`}>
            <div className={`${headerStyles} bg-gradient-to-r from-cyan-600 to-blue-600`}>
              <div className="text-lg">🏥 AYUSHMAN BHARAT</div>
              <div className="text-xs opacity-90">PM-JAY Health Card</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Family ID:</span> <span className={valueStyles}>{userDetails.family_id || 'FAM123456'}</span></div>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded text-center">
                <div className={labelStyles}>Health Coverage</div>
                <div className="text-xl font-bold text-green-600">₹5,00,000/family/year</div>
              </div>
              <div className="text-center py-2 bg-cyan-50 rounded">
                <div className={labelStyles}>ABHA Number</div>
                <div className="font-mono font-bold text-cyan-700">{generateDocNumber(submissionId, '').slice(0, 14)}</div>
              </div>
            </div>
          </div>
        );

      // 24. Disability Certificate
      case 24:
        return (
          <div className={`${cardStyles} border-blue-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-blue-600 to-indigo-600`}>
              <div className="text-lg">♿ DISABILITY CERTIFICATE</div>
              <div className="text-xs opacity-90">UDID - Unique Disability ID</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Disability:</span> <span className={valueStyles}>{userDetails.disability_type || 'As Certified'}</span></div>
                  <div><span className={labelStyles}>Percentage:</span> <span className="font-bold text-blue-600">{userDetails.disability_percentage || '40'}%</span></div>
                </div>
              </div>
              <div className="text-center py-2 bg-blue-50 rounded">
                <div className={labelStyles}>UDID Number</div>
                <div className="font-mono font-bold text-blue-700">UDID{generateDocNumber(submissionId, '').slice(0, 14)}</div>
              </div>
            </div>
          </div>
        );

      // 25. MGNREGA Job Card
      case 25:
        return (
          <div className={`${cardStyles} border-brown-400 bg-white`} style={{ borderColor: '#8B4513' }}>
            <div className={`${headerStyles}`} style={{ background: 'linear-gradient(to right, #8B4513, #A0522D)' }}>
              <div className="text-lg">🛠️ MGNREGA JOB CARD</div>
              <div className="text-xs opacity-90">100 Days Employment Guarantee</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Village:</span> <span className={valueStyles}>{userDetails.village || userDetails._district}</span></div>
                </div>
              </div>
              <div className="text-center py-2 rounded" style={{ backgroundColor: '#FFF8DC' }}>
                <div className={labelStyles}>Job Card Number</div>
                <div className="font-mono font-bold" style={{ color: '#8B4513' }}>
                  {userDetails._state?.slice(0, 2).toUpperCase() || 'IN'}-{generateDocNumber(submissionId, '').slice(0, 15)}
                </div>
              </div>
            </div>
          </div>
        );

      // 26. Udyam Registration
      case 26:
        return (
          <div className={`${cardStyles} border-emerald-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-emerald-600 to-green-600`}>
              <div className="text-lg">🏢 UDYAM REGISTRATION</div>
              <div className="text-xs opacity-90">MSME Certification</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{userDetails.enterprise_name || name}</div>
              <div className="bg-emerald-100 p-3 rounded">
                <div className={labelStyles}>Enterprise Type</div>
                <div className="font-bold text-emerald-700">{userDetails.enterprise_type || 'Micro Enterprise'}</div>
              </div>
              <div className="bg-emerald-50 p-2 rounded">
                <div className={labelStyles}>Udyam Registration Number</div>
                <div className="font-mono font-bold text-emerald-700">UDYAM-{userDetails._state?.slice(0, 2).toUpperCase() || 'IN'}-00-{generateDocNumber(submissionId, '').slice(0, 7)}</div>
              </div>
            </div>
          </div>
        );

      // 27. FSSAI License
      case 27:
        return (
          <div className={`${cardStyles} border-green-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-700 to-lime-600`}>
              <div className="text-lg">🍎 FSSAI LICENSE</div>
              <div className="text-xs opacity-90">Food Safety & Standards Authority</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{userDetails.business_name || name}</div>
              <div className="bg-green-50 p-3 rounded">
                <div className={labelStyles}>License Type</div>
                <div className="font-bold text-green-700">{userDetails.license_type || 'State License'}</div>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <div className={labelStyles}>FSSAI License Number</div>
                <div className="font-mono font-bold text-green-800">{generateDocNumber(submissionId, '').slice(0, 14)}</div>
              </div>
            </div>
          </div>
        );

      // 28. PM Awas Yojana
      case 28:
        return (
          <div className={`${cardStyles} border-orange-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-orange-600 to-red-600`}>
              <div className="text-lg">🏠 PM AWAS YOJANA</div>
              <div className="text-xs opacity-90">Housing for All</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Subsidy Approved</div>
                <div className="text-2xl font-bold text-green-600">₹{userDetails.subsidy_amount || '2,67,000'}</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className={labelStyles}>Application ID</div>
                <div className="font-mono font-bold text-orange-700">PMAY{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 29. Electricity Connection
      case 29:
        return (
          <div className={`${cardStyles} border-yellow-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-yellow-500 to-amber-500`}>
              <div className="text-lg">⚡ ELECTRICITY CONNECTION</div>
              <div className="text-xs opacity-90">Power Distribution Company</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-yellow-100 p-3 rounded">
                <div className={labelStyles}>Consumer Number</div>
                <div className="text-xl font-mono font-bold text-yellow-700">{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-yellow-50 p-2 rounded">
                  <div className={labelStyles}>Load</div>
                  <div className="font-bold">{userDetails.load || '3 KW'}</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className={labelStyles}>Category</div>
                  <div className="font-bold">{userDetails.category || 'Domestic'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      // 30. Water Connection
      case 30:
        return (
          <div className={`${cardStyles} border-blue-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-blue-500 to-cyan-500`}>
              <div className="text-lg">💧 WATER CONNECTION</div>
              <div className="text-xs opacity-90">Water Supply Department</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-blue-100 p-3 rounded">
                <div className={labelStyles}>Consumer Number</div>
                <div className="text-xl font-mono font-bold text-blue-700">WC{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className={labelStyles}>Connection Type</div>
                <div className="font-bold">{userDetails.connection_type || 'Residential'}</div>
              </div>
            </div>
          </div>
        );

      // 31. Ujjwala Gas Connection
      case 31:
        return (
          <div className={`${cardStyles} border-red-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-red-500 to-orange-500`}>
              <div className="text-lg">🔥 UJJWALA GAS CONNECTION</div>
              <div className="text-xs opacity-90">PM Ujjwala Yojana</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded text-center">
                <div className={labelStyles}>LPG Consumer Number</div>
                <div className="text-xl font-mono font-bold text-red-700">{generateDocNumber(submissionId, '').slice(0, 17)}</div>
              </div>
              <div className="text-xs text-center text-green-600 font-bold">✓ Free Connection + First Refill</div>
            </div>
          </div>
        );

      // 32. Soil Health Card
      case 32:
        return (
          <div className={`${cardStyles} border-lime-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-lime-600 to-green-600`}>
              <div className="text-lg">🌱 SOIL HEALTH CARD</div>
              <div className="text-xs opacity-90">Ministry of Agriculture</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="bg-lime-100 p-2 rounded"><div className="font-bold">N</div>High</div>
                <div className="bg-lime-100 p-2 rounded"><div className="font-bold">P</div>Medium</div>
                <div className="bg-lime-100 p-2 rounded"><div className="font-bold">K</div>Low</div>
              </div>
              <div className="bg-lime-50 p-2 rounded">
                <div className={labelStyles}>Card Number</div>
                <div className="font-mono font-bold text-lime-700">SHC{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 33. Kisan Credit Card
      case 33:
        return (
          <div className={`${cardStyles} border-green-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-600 to-emerald-600`}>
              <div className="text-lg">💳 KISAN CREDIT CARD</div>
              <div className="text-xs opacity-90">Agricultural Credit</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded text-center">
                <div className={labelStyles}>Credit Limit</div>
                <div className="text-xl font-bold text-green-600">₹{userDetails.credit_limit || '3,00,000'}</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className={labelStyles}>KCC Number</div>
                <div className="font-mono font-bold text-green-700">{generateDocNumber(submissionId, '').slice(0, 16)}</div>
              </div>
            </div>
          </div>
        );

      // 34. Pesticide License
      case 34:
        return (
          <div className={`${cardStyles} border-purple-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-purple-600 to-violet-600`}>
              <div className="text-lg">🧪 PESTICIDE LICENSE</div>
              <div className="text-xs opacity-90">Agriculture Department</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{userDetails.shop_name || name}</div>
              <div className="bg-purple-50 p-2 rounded">
                <div className={labelStyles}>License Number</div>
                <div className="font-mono font-bold text-purple-700">PL/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
              <div className="text-xs text-gray-600">Valid for 5 years from issue</div>
            </div>
          </div>
        );

      // 35. Legal Heir Certificate
      case 35:
        return (
          <div className={`${cardStyles} border-gray-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-gray-700 to-gray-900`}>
              <div className="text-lg">👨‍👩‍👧 LEGAL HEIR CERTIFICATE</div>
              <div className="text-xs opacity-90">Revenue Department</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className="border-b pb-2">
                <div className={labelStyles}>Deceased Name</div>
                <div className={valueStyles}>{userDetails.deceased_name || 'As per Record'}</div>
              </div>
              <div>
                <div className={labelStyles}>Legal Heir</div>
                <div className={valueStyles}>{name}</div>
                <div className="text-xs text-gray-500">{userDetails.relationship || 'Son/Daughter'}</div>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <div className={labelStyles}>Certificate Number</div>
                <div className="font-mono font-bold text-gray-700">LHC/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 36. Marriage Certificate
      case 36:
        return (
          <div className={`${cardStyles} border-pink-400 bg-gradient-to-br from-pink-50 to-red-50`}>
            <div className={`${headerStyles} bg-gradient-to-r from-pink-500 to-red-500`}>
              <div className="text-lg">💍 MARRIAGE CERTIFICATE</div>
              <div className="text-xs opacity-90">Registrar of Marriages</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className="text-4xl">💑</div>
              <div className="flex justify-center gap-4">
                <div>
                  <div className={labelStyles}>Bride</div>
                  <div className={valueStyles}>{userDetails.bride_name || name}</div>
                </div>
                <div className="text-2xl text-pink-400">&</div>
                <div>
                  <div className={labelStyles}>Groom</div>
                  <div className={valueStyles}>{userDetails.groom_name || 'Partner Name'}</div>
                </div>
              </div>
              <div className="bg-pink-100 p-2 rounded">
                <div className={labelStyles}>Registration Number</div>
                <div className="font-mono font-bold text-pink-700">MR/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 37. Death Certificate
      case 37:
        return (
          <div className={`${cardStyles} border-gray-500 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-gray-800 to-gray-900`}>
              <div className="text-lg">🕊️ DEATH CERTIFICATE</div>
              <div className="text-xs opacity-90">Registrar of Births & Deaths</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div>
                <div className={labelStyles}>Name of Deceased</div>
                <div className={valueStyles}>{userDetails.deceased_name || name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <div className={labelStyles}>Date of Death</div>
                  <div className="text-xs font-bold">{userDetails.date_of_death || 'As per Record'}</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className={labelStyles}>Age</div>
                  <div className="text-xs font-bold">{userDetails.age_at_death || 'N/A'}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className={labelStyles}>Registration Number</div>
                <div className="font-mono font-bold text-gray-700">DC/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 38. Digital Signature Certificate
      case 38:
        return (
          <div className={`${cardStyles} border-blue-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-blue-700 to-indigo-700`}>
              <div className="text-lg">🖋️ DIGITAL SIGNATURE CERTIFICATE</div>
              <div className="text-xs opacity-90">Certifying Authority</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className="text-4xl">🔐</div>
              <div className={valueStyles}>{name}</div>
              <div className="bg-blue-100 p-3 rounded">
                <div className={labelStyles}>DSC Class</div>
                <div className="font-bold text-blue-700">{userDetails.dsc_class || 'Class 3'}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className={labelStyles}>Certificate ID</div>
                <div className="font-mono font-bold text-blue-700 text-xs">{generateDocNumber(submissionId, 'DSC')}</div>
              </div>
              <div className="text-xs text-gray-500">Valid for 2 years</div>
            </div>
          </div>
        );

      // 39. Domain Registration
      case 39:
        return (
          <div className={`${cardStyles} border-cyan-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-cyan-600 to-blue-600`}>
              <div className="text-lg">🌐 DOMAIN REGISTRATION</div>
              <div className="text-xs opacity-90">.IN Registry</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className="bg-cyan-100 p-4 rounded-lg">
                <div className={labelStyles}>Domain Name</div>
                <div className="text-xl font-bold text-cyan-700">{userDetails.domain_name || 'example'}.gov.in</div>
              </div>
              <div className="text-xs text-gray-600">
                <div>Registrant: {name}</div>
                <div>Valid: 2 Years</div>
              </div>
            </div>
          </div>
        );

      // 40. Arms License
      case 40:
        return (
          <div className={`${cardStyles} border-red-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-red-700 to-red-900`}>
              <div className="text-lg">🛡️ ARMS LICENSE</div>
              <div className="text-xs opacity-90">District Magistrate</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Address:</span> <span className="text-xs">{userDetails._district}</span></div>
                </div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className={labelStyles}>License Number</div>
                <div className="font-mono font-bold text-red-700">AL/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 41. Ex-Servicemen ID
      case 41:
        return (
          <div className={`${cardStyles} border-green-500 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-green-700 to-green-900`}>
              <div className="text-lg">🎖️ EX-SERVICEMEN IDENTITY CARD</div>
              <div className="text-xs opacity-90">Ministry of Defence</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>Rank:</span> <span className={valueStyles}>{userDetails.rank || 'Retired'}</span></div>
                  <div><span className={labelStyles}>Service:</span> <span className={valueStyles}>{userDetails.service || 'Army'}</span></div>
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className={labelStyles}>Service Number</div>
                <div className="font-mono font-bold text-green-700">ESM/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 42. Senior Citizen Card
      case 42:
        return (
          <div className={`${cardStyles} border-purple-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-purple-600 to-violet-600`}>
              <div className="text-lg">👴 SENIOR CITIZEN CARD</div>
              <div className="text-xs opacity-90">Social Welfare Department</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                  <div><span className={labelStyles}>Age:</span> <span className="font-bold text-purple-600">{userDetails.age || '60+'}</span></div>
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className={labelStyles}>Card Number</div>
                <div className="font-mono font-bold text-purple-700">SC/{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 43. Transgender ID
      case 43:
        return (
          <div className={`${cardStyles} border-pink-400 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50`}>
            <div className={`${headerStyles}`} style={{ background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)' }}>
              <div className="text-lg">🏳️‍🌈 TRANSGENDER ID CARD</div>
              <div className="text-xs opacity-90">National Portal for TG Persons</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {photoPlaceholder}
                <div className="flex-1 space-y-1">
                  <div><span className={labelStyles}>Name:</span> <span className={valueStyles}>{name}</span></div>
                  <div><span className={labelStyles}>DOB:</span> <span className={valueStyles}>{dob}</span></div>
                </div>
              </div>
              <div className="bg-purple-100 p-2 rounded text-center">
                <div className={labelStyles}>TG ID Number</div>
                <div className="font-mono font-bold text-purple-700">TG{generateDocNumber(submissionId, '').slice(0, 12)}</div>
              </div>
            </div>
          </div>
        );

      // 44. SC/ST Fellowship
      case 44:
        return (
          <div className={`${cardStyles} border-indigo-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-indigo-600 to-purple-600`}>
              <div className="text-lg">🎓 SC/ST FELLOWSHIP</div>
              <div className="text-xs opacity-90">UGC Fellowship</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Fellowship Amount</div>
                <div className="text-2xl font-bold text-green-600">₹31,000/month</div>
              </div>
              <div className="bg-indigo-50 p-2 rounded">
                <div className={labelStyles}>Fellowship ID</div>
                <div className="font-mono font-bold text-indigo-700">SCST{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // 45. Minority Scholarship
      case 45:
        return (
          <div className={`${cardStyles} border-teal-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-teal-600 to-cyan-600`}>
              <div className="text-lg">🌙 MINORITY SCHOLARSHIP</div>
              <div className="text-xs opacity-90">Ministry of Minority Affairs</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className={labelStyles}>Scholarship Amount</div>
                <div className="text-2xl font-bold text-green-600">₹{userDetails.scholarship_amount || '10,000'}/year</div>
              </div>
              <div className="bg-teal-50 p-2 rounded">
                <div className={labelStyles}>Application ID</div>
                <div className="font-mono font-bold text-teal-700">MIN{generateDocNumber(submissionId, '').slice(0, 10)}</div>
              </div>
            </div>
          </div>
        );

      // Default card for any unhandled service
      default:
        return (
          <div className={`${cardStyles} border-gray-400 bg-white`}>
            <div className={`${headerStyles} bg-gradient-to-r from-gray-600 to-gray-800`}>
              <div className="text-lg">📋 {serviceName.toUpperCase()}</div>
              <div className="text-xs opacity-90">Government of India</div>
            </div>
            <div className="p-4 space-y-3 text-center">
              <div className={valueStyles}>{name}</div>
              <div className="bg-gray-100 p-3 rounded">
                <div className={labelStyles}>Application Status</div>
                <div className="text-xl font-bold text-green-600">✓ APPROVED</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className={labelStyles}>Reference Number</div>
                <div className="font-mono font-bold text-gray-700">{generateDocNumber(submissionId, 'REF').slice(0, 15)}</div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Only show for completed/ready states
  if (!['completed', 'ready_for_collection'].includes(status)) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Generated Document Preview</h3>
        <p className="text-xs text-gray-500">This is how the issued document will look</p>
      </div>
      <div className="transform hover:scale-[1.02] transition-transform">
        {renderCard()}
      </div>
    </div>
  );
};
