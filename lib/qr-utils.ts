// QR Code generation and management utilities
import type { SubmittedService, QRCodeData } from './government-services';

// In-memory storage for QR codes (24-hour expiry)
const qrStorage: Map<string, SubmittedService> = new Map();

/**
 * Generate a unique submission ID
 */
export function generateSubmissionId(): string {
  return `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create QR code data and store it with 24-hour expiry
 */
export function createQRSubmission(
  serviceName: string,
  userDetails: Record<string, string>,
  serviceId: number = 0
): SubmittedService {
  const submissionId = generateSubmissionId();
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours from now

  const qrData: QRCodeData = {
    submissionId,
    serviceName,
    submittedAt: now,
    userInfo: {
      name: userDetails.name || 'Anonymous',
      email: userDetails.email || '',
      phone: userDetails.phone || '',
    },
  };

  const qrCode = btoa(JSON.stringify(qrData)); // Base64 encode for URL safety

  const submission: SubmittedService = {
    id: submissionId,
    serviceId,
    serviceName,
    qrCode,
    expiresAt,
    submittedAt: now,
    userDetails,
  };

  // Store in memory
  qrStorage.set(submissionId, submission);

  // Cleanup expired entries
  cleanupExpiredQRCodes();

  return submission;
}

/**
 * Retrieve QR code data by submission ID
 */
export function getQRSubmission(submissionId: string): SubmittedService | null {
  const submission = qrStorage.get(submissionId);

  if (!submission) {
    return null;
  }

  // Check if expired
  if (submission.expiresAt < Date.now()) {
    qrStorage.delete(submissionId);
    return null;
  }

  return submission;
}

/**
 * Decode QR code string back to data
 */
export function decodeQRCode(qrCode: string): QRCodeData | null {
  try {
    const decoded = atob(qrCode);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Get all active QR submissions (for admin dashboard)
 */
export function getAllActiveSubmissions(): SubmittedService[] {
  cleanupExpiredQRCodes();
  return Array.from(qrStorage.values()).sort(
    (a, b) => b.submittedAt - a.submittedAt
  );
}

/**
 * Remove expired QR codes from storage
 */
function cleanupExpiredQRCodes(): void {
  const now = Date.now();
  const expiredIds: string[] = [];

  qrStorage.forEach((submission, id) => {
    if (submission.expiresAt < now) {
      expiredIds.push(id);
    }
  });

  expiredIds.forEach((id) => qrStorage.delete(id));
}

/**
 * Generate QR code URL for scanning (using QR API)
 * This generates a URL that when scanned will direct to the submission details page
 */
export function generateQRImageUrl(submissionId: string): string {
  // Get the base URL (default to localhost for development, in production use environment variable)
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Create the submission details URL
  const detailsUrl = `${baseUrl}/submission/${submissionId}`;
  
  // Using qrserver.com for QR code generation (free and no auth required)
  const encodedUrl = encodeURIComponent(detailsUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
}

/**
 * Format time remaining for QR code expiry
 */
export function getTimeRemaining(expiresAt: number): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = Date.now();
  const remaining = expiresAt - now;

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, isExpired: false };
}

/**
 * Verify QR code hasn't expired
 */
export function isQRCodeValid(expiresAt: number): boolean {
  return expiresAt > Date.now();
}

/**
 * Export all data to JSON (for admin backup)
 */
export function exportAllSubmissions(): string {
  const submissions = getAllActiveSubmissions();
  return JSON.stringify(submissions, null, 2);
}
