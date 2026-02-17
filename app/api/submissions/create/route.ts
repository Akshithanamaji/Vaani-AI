import { NextRequest, NextResponse } from 'next/server';
import { createSubmission, getStats, STATUS_LABELS } from '@/lib/submission-db';

/**
 * POST /api/submissions/create
 * Create a new submission and return QR code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceName, serviceId, userDetails } = body;

    if (!serviceName || !userDetails) {
      return NextResponse.json(
        { error: 'serviceName and userDetails are required' },
        { status: 400 }
      );
    }

    // Create submission in database
    const submission = createSubmission(serviceName, serviceId || 0, userDetails);

    // Generate backend QR code URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`;
    
    const qrUrl = `${baseUrl}/submission/${submission.id}`;

    console.log('[API] Submission created:', submission.id);

    return NextResponse.json(
      {
        success: true,
        submission: {
          id: submission.id,
          serviceId: submission.serviceId,
          serviceName: submission.serviceName,
          qrCode: submission.qrCode,
          qrUrl, // URL that will be in QR code
          status: submission.status,
          statusLabel: STATUS_LABELS[submission.status],
          submittedAt: submission.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/submissions/create
 * Health check
 */
export async function GET(request: NextRequest) {
  const stats = getStats();
  return NextResponse.json({ status: 'ok', stats });
}
