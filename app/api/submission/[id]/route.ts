import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Extract the submission ID from the URL path.
    // The path is expected to be /submission/[id]
    const pathParts = request.nextUrl.pathname.split('/');
    const submissionId = pathParts[pathParts.length - 1];

    if (!submissionId) {
        return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // In a real application, you would fetch the submission details from a database here.
    // Since the current implementation uses in-memory storage on the client/frontend utils, 
    // and we don't have a shared database, verifying via an API route that purely relies on client-side memory
    // won't work if the server restarts or for a new request context.

    // However, for the purpose of this task (redirecting a scanned QR code to a details page),
    // we should render a page component. This route handler is likely not the right place for a page render 
    // if we want to show a UI. We should use a page.tsx at app/submission/[id]/page.tsx.

    // If this was an API endpoint to get data:
    // const submission = getQRSubmission(submissionId); // This wouldn't work across server instances/restarts without a DB.

    // For now, let's assume we are just redirecting or this is a placeholder. 
    // BUT the user wants to SCAN the QR code and see the user submitted form.

    // So we need a page to display the details.
    return NextResponse.redirect(new URL(`/submission/${submissionId}`, request.url));
}
