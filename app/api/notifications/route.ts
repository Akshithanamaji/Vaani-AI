import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markAsRead, clearAll, addNotification } from '@/lib/notification-store';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        let userEmail = searchParams.get('userEmail');

        console.log('[NotificationsAPI] GET - Looking for email:', userEmail);

        if (!userEmail) {
            return NextResponse.json({ success: false, error: 'Missing userEmail' }, { status: 400 });
        }

        // Normalize email: trim and lowercase
        userEmail = userEmail.trim().toLowerCase();
        
        const notifications = getNotifications(userEmail);
        console.log('[NotificationsAPI] Found', notifications.length, 'notifications for:', userEmail);
        
        return NextResponse.json({ success: true, notifications });
    } catch (error) {
        console.error('[NotificationsAPI] Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userEmail, title, message, type, serviceName } = body;

        if (!userEmail || !title || !message) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const notification = addNotification({ userEmail, title, message, type: type || 'info', serviceName });
        return NextResponse.json({ success: true, notification });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, userEmail, action } = body;

        if (action === 'clearAll' && userEmail) {
            clearAll(userEmail);
        } else if (id) {
            markAsRead(id);
        } else {
            return NextResponse.json({ success: false, error: 'Missing id or userEmail/action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 });
    }
}
