// Submission database - in-memory with file persistence
import fs from 'fs';
import path from 'path';
import os from 'os';

// Application status workflow
export type SubmissionStatus =
  | 'submitted'           // Initial state when user submits
  | 'under_review'        // Admin has opened and is reviewing
  | 'processing'          // Admin is processing the application
  | 'completed'           // Processing completed, document ready
  | 'ready_for_collection' // User notified to collect
  | 'collected'           // User has collected - FINAL STATE
  | 'rejected';           // Application rejected - FINAL STATE

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  processing: 'Processing',
  completed: 'Completed',
  ready_for_collection: 'Ready for Collection',
  collected: 'Collected',
  rejected: 'Rejected'
};

export const STATUS_LABELS_HI: Record<SubmissionStatus, string> = {
  submitted: 'जमा किया गया',
  under_review: 'समीक्षाधीन',
  processing: 'प्रक्रिया में',
  completed: 'पूर्ण',
  ready_for_collection: 'संग्रह के लिए तैयार',
  collected: 'एकत्र किया गया',
  rejected: 'अस्वीकृत'
};

export const STATUS_LABELS_TE: Record<SubmissionStatus, string> = {
  submitted: 'సమర్పించబడింది',
  under_review: 'సమీక్షలో ఉంది',
  processing: 'ప్రాసెసింగ్',
  completed: 'పూర్తయింది',
  ready_for_collection: 'సేకరణకు సిద్ధంగా ఉంది',
  collected: 'సేకరించబడింది',
  rejected: 'తిరస్కరించబడింది'
};

export interface Submission {
  id: string;
  serviceId: number;
  serviceName: string;
  userDetails: Record<string, string>;
  qrCode: string;
  submittedAt: number;
  createdAt: number;
  modifiedAt: number;
  /** Application status - controls the workflow */
  status: SubmissionStatus;
  /** Only true when status is 'collected' or 'rejected' */
  isExpired: boolean;
  expiresAt: number;
  notifiedExpiry?: boolean;
  viewedBy?: string[]; // Track who viewed it
  /** Admin notes/comments */
  adminNotes?: string;
  /** When status was last changed */
  statusChangedAt?: number;
  /** History of status changes */
  statusHistory?: Array<{
    status: SubmissionStatus;
    changedAt: number;
    changedBy?: string;
    notes?: string;
  }>;
}

// Store submissions in memory with file persistence
export let submissions: Map<string, Submission> = new Map();

// Use project's data directory for cross-platform compatibility
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = process.env.SUBMISSION_DB_FILE || path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('[SubmissionDB] Created data directory:', DATA_DIR);
    }
  } catch (error) {
    console.error('[SubmissionDB] Error creating data directory:', error);
  }
}

/**
 * Initialize database - load from file if exists
 */
export function initializeDB() {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      submissions = new Map(parsed);
      console.log('[SubmissionDB] Loaded', submissions.size, 'submissions from disk at:', DB_FILE);
    } else {
      console.log('[SubmissionDB] No existing database found, starting fresh at:', DB_FILE);
    }
  } catch (error) {
    console.error('[SubmissionDB] Error loading database:', error);
  }
}

/**
 * Save database to file
 */
export function saveDB() {
  try {
    ensureDataDir();
    const data = Array.from(submissions.entries());
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('[SubmissionDB] Saved', submissions.size, 'submissions to disk');
  } catch (error) {
    console.error('[SubmissionDB] Error saving database:', error);
  }
}

/**
 * Reload database from disk - ensures in-memory map is synced with file
 * Call this before reading data in API endpoints
 */
export function reloadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      submissions = new Map(parsed);
      console.log('[SubmissionDB] Reloaded', submissions.size, 'submissions from disk');
    }
  } catch (error) {
    console.error('[SubmissionDB] Error reloading database:', error);
  }
}

// Auto-initialize database when module loads
initializeDB();

/**
 * Create a new submission
 */
export function createSubmission(
  serviceName: string,
  serviceId: number,
  userDetails: Record<string, string>
): Submission {
  const id = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours from now

  const qrCode = Buffer.from(
    JSON.stringify({ id, serviceName, submittedAt: now })
  ).toString('base64');

  const submission: Submission = {
    id,
    serviceId,
    serviceName,
    userDetails,
    qrCode,
    submittedAt: now,
    createdAt: now,
    modifiedAt: now,
    expiresAt,
    status: 'submitted',
    isExpired: false,
    viewedBy: [],
    statusHistory: [{
      status: 'submitted',
      changedAt: now,
      notes: 'Application submitted by user'
    }]
  };

  submissions.set(id, submission);
  saveDB();

  console.log('[SubmissionDB] Created submission:', id);
  return submission;
}

/**
 * Get submission by ID
 */
export function getSubmission(id: string): Submission | null {
  const submission = submissions.get(id);

  if (!submission) {
    console.log('[SubmissionDB] Submission not found:', id);
    return null;
  }

  return submission;
}

/**
 * Update submission status
 */
export function updateSubmissionStatus(
  id: string,
  newStatus: SubmissionStatus,
  adminId: string = 'unknown',
  notes?: string
): Submission | null {
  const submission = submissions.get(id);

  if (!submission) {
    return null;
  }

  const now = Date.now();

  // Add to status history
  if (!submission.statusHistory) {
    submission.statusHistory = [];
  }
  submission.statusHistory.push({
    status: newStatus,
    changedAt: now,
    changedBy: adminId,
    notes: notes
  });

  submission.status = newStatus;
  submission.statusChangedAt = now;
  submission.modifiedAt = now;
  if (notes) {
    submission.adminNotes = notes;
  }

  // Mark as expired when status is ready_for_collection, collected or rejected
  if (newStatus === 'ready_for_collection' || newStatus === 'collected' || newStatus === 'rejected') {
    submission.isExpired = true;
  }

  // Track who modified
  if (!submission.viewedBy) submission.viewedBy = [];
  if (!submission.viewedBy.includes(adminId)) {
    submission.viewedBy.push(adminId);
  }

  submissions.set(id, submission);
  saveDB();

  console.log('[SubmissionDB] Status updated:', id, '->', newStatus, 'by', adminId);
  return submission;
}

/**
 * Update submission details and optionally change status
 * Used when admin updates user details
 */
export function updateSubmissionDetails(
  id: string,
  updates: Partial<Record<string, string>>,
  adminId: string = 'unknown',
  newStatus?: SubmissionStatus,
  notes?: string
): Submission | null {
  const submission = submissions.get(id);

  if (!submission) {
    return null;
  }

  // Update user details, filtering out undefined values
  const filteredUpdates: Record<string, string> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      filteredUpdates[key] = value;
    }
  }
  submission.userDetails = { ...submission.userDetails, ...filteredUpdates };
  submission.modifiedAt = Date.now();

  // Track who viewed/modified
  if (!submission.viewedBy) submission.viewedBy = [];
  if (!submission.viewedBy.includes(adminId)) {
    submission.viewedBy.push(adminId);
  }

  // Update status if provided
  if (newStatus && newStatus !== submission.status) {
    if (!submission.statusHistory) {
      submission.statusHistory = [];
    }
    submission.statusHistory.push({
      status: newStatus,
      changedAt: Date.now(),
      changedBy: adminId,
      notes: notes
    });
    submission.status = newStatus;
    submission.statusChangedAt = Date.now();

    // Mark as expired only when collected or rejected
    if (newStatus === 'collected' || newStatus === 'rejected') {
      submission.isExpired = true;
    }
  }

  if (notes) {
    submission.adminNotes = notes;
  }

  submissions.set(id, submission);
  saveDB();

  console.log('[SubmissionDB] Updated submission:', id, 'by', adminId, newStatus ? `status: ${newStatus}` : '');
  return submission;
}

/**
 * Update submission fields without forcing expiry or generating any document.
 * Used when admin clicks "Save" to store edits but not yet apply and notify.
 */
export function updateSubmissionFields(
  id: string,
  updates: Partial<Record<string, string>>,
  adminId: string = 'unknown'
): Submission | null {
  const submission = submissions.get(id);

  if (!submission) {
    return null;
  }

  const filteredUpdates: Record<string, string> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      filteredUpdates[key] = value;
    }
  }

  submission.userDetails = { ...submission.userDetails, ...filteredUpdates };
  submission.modifiedAt = Date.now();

  if (!submission.viewedBy) submission.viewedBy = [];
  if (!submission.viewedBy.includes(adminId)) {
    submission.viewedBy.push(adminId);
  }

  submissions.set(id, submission);
  saveDB();

  console.log('[SubmissionDB] Updated submission fields (no expiry):', id, 'by', adminId);
  return submission;
}

/**
 * After admin apply/update: mark submission status as ready_for_collection
 * @deprecated Use updateSubmissionStatus instead
 */
export function setSubmissionApproved(
  id: string
): Submission | null {
  return updateSubmissionStatus(id, 'ready_for_collection', 'admin', 'Application approved');
}

/**
 * Get submission by ID for document view (allowed even when expired if document was generated)
 */
export function getSubmissionForDocument(id: string): Submission | null {
  return submissions.get(id) || null;
}

/**
 * View submission (track viewer but don't expire)
 */
export function viewSubmission(id: string, viewerId: string = 'unknown'): Submission | null {
  const submission = submissions.get(id);

  if (!submission) {
    return null;
  }

  // Track viewer
  if (!submission.viewedBy) submission.viewedBy = [];
  if (!submission.viewedBy.includes(viewerId)) {
    submission.viewedBy.push(viewerId);
  }

  saveDB();
  console.log('[SubmissionDB] Submission viewed by:', viewerId);
  return submission;
}

/**
 * Check if submission is in a final state (collected or rejected)
 */
export function isSubmissionFinal(submission: Submission): boolean {
  return submission.status === 'collected' || submission.status === 'rejected';
}

/**
 * Get active (non-final) submissions
 */
function getActiveSubmissions(): Submission[] {
  return Array.from(submissions.values()).filter(s => !isSubmissionFinal(s));
}

/**
 * Get all submissions
 * @param includeCompleted - if false, excludes collected/rejected submissions
 */
export function getAllSubmissions(includeCompleted: boolean = false): Submission[] {
  markFinalAsExpired();

  const results = Array.from(submissions.values());

  if (!includeCompleted) {
    return results.filter(s => !isSubmissionFinal(s));
  }

  return results;
}

/**
 * Get submissions for a service
 * @param includeCompleted - if false, excludes collected/rejected submissions
 */
export function getServiceSubmissions(serviceId: number, includeCompleted: boolean = false): Submission[] {
  markFinalAsExpired();

  const results = Array.from(submissions.values())
    .filter(s => s.serviceId === serviceId)
    .sort((a, b) => b.submittedAt - a.submittedAt);

  if (!includeCompleted) {
    return results.filter(s => !isSubmissionFinal(s));
  }

  return results;
}

/**
 * Mark submission as viewed only (don't expire)
 */
export function markAsViewed(id: string, viewerId: string = 'admin'): void {
  const submission = submissions.get(id);
  if (submission) {
    if (!submission.viewedBy) {
      submission.viewedBy = [];
    }
    if (!submission.viewedBy.includes(viewerId)) {
      submission.viewedBy.push(viewerId);
      saveDB();
    }
  }
}

/**
 * Mark final submissions (collected/rejected) as expired
 */
function markFinalAsExpired(): void {
  let updatedCount = 0;

  submissions.forEach((submission: Submission) => {
    if (isSubmissionFinal(submission) && !submission.isExpired) {
      submission.isExpired = true;
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    saveDB();
    console.log('[SubmissionDB] Marked', updatedCount, 'completed submissions as expired');
  }
}

/**
 * Delete submission (admin only)
 */
export function deleteSubmission(id: string): boolean {
  const result = submissions.delete(id);
  if (result) {
    saveDB();
    console.log('[SubmissionDB] Deleted submission:', id);
  }
  return result;
}

/**
 * Export all submissions as JSON
 */
export function exportAllSubmissions(): string {
  markFinalAsExpired();
  const data = Array.from(submissions.values());
  return JSON.stringify(data, null, 2);
}

/**
 * Get statistics by status
 */
export function getStats() {
  markFinalAsExpired();

  const allSubmissions = Array.from(submissions.values());
  const activeCount = allSubmissions.filter(s => !isSubmissionFinal(s)).length;
  const completedCount = allSubmissions.filter(s => isSubmissionFinal(s)).length;

  // Count by status
  const byStatus: Record<string, number> = {};
  allSubmissions.forEach(s => {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
  });

  return {
    total: allSubmissions.length,
    active: activeCount,
    completed: completedCount,
    byStatus,
    lastUpdated: new Date().toISOString(),
  };
}

// Initialize on import
if (typeof window === 'undefined') {
  // Server-side only
  initializeDB();
}
