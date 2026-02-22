import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, saveDB, reloadDB } from '@/lib/submission-db';
import { addNotification } from '@/lib/notification-store';

/**
 * GET /api/submissions/user
 * List submissions for a specific user email
 */
export async function GET(request: NextRequest) {
    try {
        // Reload from disk to ensure we have latest data
        reloadDB();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const allSubmissions = getAllSubmissions(true); // Include expired for check
        const userSubmissions = allSubmissions.filter(s =>
            s.userDetails.email === email || s.userDetails.userEmail === email
        );

        // Check for natural expiry notification
        let needsSave = false;
        userSubmissions.forEach(s => {
            const isNaturallyExpired = s.expiresAt < Date.now();
            const wasViewedByAdmin = (s.viewedBy?.length || 0) > 0;

            if (isNaturallyExpired && !wasViewedByAdmin && !s.notifiedExpiry) {
                addNotification({
                    userEmail: email,
                    title: 'Application Expired',
                    message: `Admin didn't check your form for ${s.serviceName} within 24 hours. Your form has expired, please fill it again.`,
                    type: 'warning',
                    serviceName: s.serviceName
                });
                s.notifiedExpiry = true;
                needsSave = true;
            }
        });

        if (needsSave) {
            saveDB();
        }

        return NextResponse.json({
            success: true,
            submissions: userSubmissions
        });
    } catch (error) {
        console.error('[API] Error fetching user submissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user submissions' },
            { status: 500 }
        );
    }
}

