import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, getServiceSubmissions, STATUS_LABELS, reloadDB } from '@/lib/submission-db';

/**
 * GET /api/submissions/list
 * List submissions with optional service filtering
 */
export async function GET(request: NextRequest) {
    try {
        // Reload from disk to ensure we have latest data
        reloadDB();

        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('serviceId');

        let submissions;
        if (serviceId) {
            submissions = getServiceSubmissions(parseInt(serviceId), true);
        } else {
            submissions = getAllSubmissions(true);
        }

        return NextResponse.json({
            success: true,
            submissions: submissions.map(s => ({
                id: s.id,
                serviceId: s.serviceId,
                serviceName: s.serviceName,
                userDetails: s.userDetails,
                qrCode: s.qrCode,
                submittedAt: s.submittedAt,
                status: s.status,
                statusLabel: STATUS_LABELS[s.status],
                isExpired: s.isExpired,
                viewedBy: s.viewedBy || [],
                statusHistory: s.statusHistory || [],
                adminNotes: s.adminNotes
            }))
        });
    } catch (error) {
        console.error('[API] Error listing submissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submissions' },
            { status: 500 }
        );
    }
}
