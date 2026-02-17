import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, getMessagesByUser, getMessagesByService, markMessagesAsRead } from '@/lib/message-store';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');
        const serviceId = searchParams.get('serviceId');

        let messages: any[] = [];
        if (userEmail && serviceId) {
            // Get conversation between specific user and specific service
            const allUserMsgs = getMessagesByUser(userEmail);
            messages = allUserMsgs.filter((m: any) => m.serviceId === parseInt(serviceId));
        } else if (userEmail) {
            messages = getMessagesByUser(userEmail);
        } else if (serviceId) {
            messages = getMessagesByService(parseInt(serviceId));
        }

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sender, content, serviceId, serviceName, userEmail } = body;

        if (!sender || !content || !serviceId || !serviceName || !userEmail) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const message = sendMessage({ sender, content, serviceId: parseInt(serviceId), serviceName, userEmail });
        return NextResponse.json({ success: true, message });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userEmail, serviceId, role } = body;

        if (!userEmail || !serviceId || !role) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        markMessagesAsRead(userEmail, parseInt(serviceId), role);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to mark messages as read' }, { status: 500 });
    }
}

