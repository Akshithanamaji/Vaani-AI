import { NextRequest, NextResponse } from 'next/server';
import {
  getSubmission,
  viewSubmission,
  updateSubmissionDetails,
  updateSubmissionFields,
  updateSubmissionStatus,
  submissions,
  isSubmissionFinal,
  STATUS_LABELS,
  SubmissionStatus,
  reloadDB
} from '@/lib/submission-db';

/**
 * GET /api/submissions/[id]
 * Retrieve submission details
 * Query params:
 *   - viewer: who is viewing (admin, user, etc)
 *   - role: admin or user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Reload from disk to ensure we have latest data
    reloadDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Track viewer (get from query or header)
    const viewerId = (request.nextUrl.searchParams.get('viewer') || 'user') as string;
    const role = (request.nextUrl.searchParams.get('role') || 'user') as string;

    // Mark as viewed
    const submission = viewSubmission(id, viewerId);

    if (!submission) {
      return NextResponse.json(
        {
          error: 'Submission not found',
          message: 'This submission does not exist or has been deleted.',
        },
        { status: 404 }
      );
    }

    // Check if in final state (collected/rejected) — still return full data for display
    const isFinal = isSubmissionFinal(submission);
    if (isFinal) {
      return NextResponse.json(
        {
          success: true,
          submission: {
            id: submission.id,
            serviceId: submission.serviceId,
            serviceName: submission.serviceName,
            userDetails: submission.userDetails,
            submittedAt: submission.submittedAt,
            status: submission.status,
            statusLabel: STATUS_LABELS[submission.status],
            statusHistory: submission.statusHistory || [],
            isExpired: true,
            viewedBy: submission.viewedBy || [],
            modifiedAt: submission.modifiedAt,
            adminNotes: submission.adminNotes,
          },
        },
        { status: 200 } // return 200 so the page always shows the submission
      );
    }

    console.log('[API] Submission retrieved:', id, 'by', viewerId, 'role:', role);

    return NextResponse.json(
      {
        success: true,
        submission: {
          id: submission.id,
          serviceId: submission.serviceId,
          serviceName: submission.serviceName,
          userDetails: submission.userDetails,
          submittedAt: submission.submittedAt,
          status: submission.status,
          statusLabel: STATUS_LABELS[submission.status],
          statusHistory: submission.statusHistory || [],
          isExpired: submission.isExpired,
          viewedBy: submission.viewedBy || [],
          modifiedAt: submission.modifiedAt,
          adminNotes: submission.adminNotes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error retrieving submission:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve submission' },
      { status: 500 }
    );
  }
}

import { addNotification } from '@/lib/notification-store';

/**
 * PATCH /api/submissions/[id]
 * Update submission (admin only)
 * Modes:
 *  - mode === 'save': update fields only (no status change)
 *  - mode === 'status': change status and notify user
 *  - default: update fields and optionally change status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { updates = {}, adminId = 'admin', adminKey, mode, newStatus, notes } = body;

    // Basic admin authentication - only required for other modes, not for status-only updates
    // Status-only updates are considered "safe" as they just notify users
    if (mode !== 'status') {
      const expectedKey = process.env.ADMIN_SECRET_KEY || process.env.NEXT_PUBLIC_ADMIN_KEY;
      if (expectedKey && adminKey !== expectedKey) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // STATUS MODE: change status and notify user
    if (mode === 'status' && newStatus) {
      const submission = updateSubmissionStatus(id, newStatus as SubmissionStatus, adminId, notes);

      if (!submission) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }

      // Send notification to user based on status
      let userEmail = submission.userDetails.email || submission.userDetails.userEmail;
      if (userEmail) {
        // Normalize email: trim and lowercase
        userEmail = userEmail.trim().toLowerCase();
      }

      console.log('[API] Status update - attempting to notify:', {
        submissionId: id,
        userEmail,
        newStatus,
        hasEmail: !!userEmail,
        userDetails: Object.keys(submission.userDetails)
      });

      if (userEmail) {
        const notificationMessages: Record<SubmissionStatus, { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }> = {
          submitted: { title: 'Application Submitted', message: `Your ${submission.serviceName} application has been submitted. Our team will review it shortly.`, type: 'info' },
          under_review: { title: 'Application Under Review', message: `Your ${submission.serviceName} application is now under review by our team.`, type: 'info' },
          processing: { title: 'Application Processing', message: `Your ${submission.serviceName} application is being processed. We're preparing your documents.`, type: 'info' },
          completed: { title: 'Application Completed', message: `Your ${submission.serviceName} documents are completed and ready! Please come and collect your card/document from the office.`, type: 'success' },
          ready_for_collection: { title: '✅ Your Card/Form is Ready! Come Collect Now', message: `Your ${submission.serviceName} is ready for collection!\n\n📍 Please visit the office to collect your card/document.\n⏰ Office hours: Monday-Friday, 9 AM - 5 PM\n\nBring your application ID for reference.`, type: 'success' },
          collected: { title: 'Document Collected', message: `Your ${submission.serviceName} document has been collected successfully. Thank you for using our service!`, type: 'success' },
          rejected: { title: 'Application Rejected', message: `Your ${submission.serviceName} application was rejected. ${notes || 'Please contact the office for details and guidance on next steps.'}`, type: 'error' },
        };

        const notification = notificationMessages[newStatus as SubmissionStatus];
        if (notification) {
          try {
            addNotification({
              userEmail,
              title: notification.title,
              message: notification.message,
              type: notification.type as 'info' | 'success' | 'warning' | 'error',
              serviceName: submission.serviceName,
              submissionId: submission.id,
            });
            console.log('[API] Notification sent successfully to:', userEmail);
          } catch (notifError) {
            console.error('[API] Failed to send notification:', notifError);
          }
        } else {
          console.warn('[API] No notification message found for status:', newStatus);
        }
      } else {
        console.warn('[API] No user email found - cannot send notification. userDetails:', submission.userDetails);
      }

      console.log('[API] Submission status changed:', id, 'to', newStatus);

      return NextResponse.json(
        {
          success: true,
          message: `Status changed to ${STATUS_LABELS[newStatus as SubmissionStatus]}.`,
          submission: {
            id: submission.id,
            serviceName: submission.serviceName,
            status: submission.status,
            statusLabel: STATUS_LABELS[submission.status],
            statusHistory: submission.statusHistory,
            isExpired: submission.isExpired,
            modifiedAt: submission.modifiedAt,
          },
        },
        { status: 200 }
      );
    }

    // SAVE MODE: only update fields, do not change status
    if (mode === 'save') {
      const submission = updateSubmissionFields(id, updates, adminId);

      if (!submission) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }

      console.log('[API] Submission fields saved by admin:', id);

      return NextResponse.json(
        {
          success: true,
          message: 'Submission details saved successfully.',
          submission: {
            id: submission.id,
            serviceName: submission.serviceName,
            userDetails: submission.userDetails,
            isExpired: submission.isExpired,
            modifiedAt: submission.modifiedAt,
            viewedBy: submission.viewedBy,
          },
        },
        { status: 200 }
      );
    }

    // DEFAULT MODE: update fields and optionally set to ready_for_collection
    const submission = updateSubmissionDetails(id, updates, adminId, 'ready_for_collection' as SubmissionStatus);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const userEmail = submission.userDetails.email || submission.userDetails.userEmail;
    if (userEmail) {
      addNotification({
        userEmail,
        title: '✅ Your Card/Form is Ready! Come Collect Now',
        message: `Your ${submission.serviceName} is ready for collection!\n\n📍 Please visit the office to collect your card/document.\n⏰ Office hours: Monday-Friday, 9 AM - 5 PM\n\nBring your application ID for reference.`,
        type: 'success',
        serviceName: submission.serviceName,
        submissionId: submission.id,
      });
    }

    console.log('[API] Submission updated, user notified:', id);

    return NextResponse.json(
      {
        success: true,
        message: 'Application processed and ready for collection.',
        submission: {
          id: submission.id,
          serviceName: submission.serviceName,
          userDetails: submission.userDetails,
          status: submission.status,
          statusLabel: STATUS_LABELS[submission.status],
          isExpired: submission.isExpired,
          modifiedAt: submission.modifiedAt,
          viewedBy: submission.viewedBy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

