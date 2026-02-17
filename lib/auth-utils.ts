// In-memory storage for OTP and user sessions (no database needed)
const otpStore: Record<string, { code: string; email: string; timestamp: number }> = {};
const userSessions: Record<string, { email: string; createdAt: number }> = {};

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP and send email (email is optional for development)
export async function storeOTP(email: string, name?: string, phone?: string): Promise<{ otp: string; emailSent: boolean }> {
  const otp = generateOTP();
  otpStore[email] = {
    code: otp,
    email,
    timestamp: Date.now(),
  };

  let emailSent = false;

  // Try to send email via API
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, name, phone }),
    });

    if (response.ok) {
      console.log(`[OTP] Email sent to ${email}`);
      emailSent = true;
    } else {
      console.error('[OTP] Failed to send email via API');
    }
  } catch (error) {
    console.error('[OTP] Email delivery error:', error);
  }

  return { otp, emailSent };
}

// Verify OTP
export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore[email];

  if (!stored) {
    return false;
  }

  // OTP valid for 10 minutes
  const isExpired = Date.now() - stored.timestamp > 10 * 60 * 1000;

  if (isExpired) {
    delete otpStore[email];
    return false;
  }

  const isValid = stored.code === otp;

  if (isValid) {
    delete otpStore[email];
    // Create session
    const sessionId = `session_${Date.now()}_${Math.random()}`;
    userSessions[sessionId] = {
      email,
      createdAt: Date.now(),
    };
    localStorage.setItem('auth_session', sessionId);
  }

  return isValid;
}

// Get current user session
export function getCurrentSession(): { email: string; sessionId: string } | null {
  const sessionId = localStorage.getItem('auth_session');
  if (!sessionId || !userSessions[sessionId]) {
    return null;
  }

  return {
    email: userSessions[sessionId].email,
    sessionId,
  };
}

// Logout
export function logout(): void {
  const sessionId = localStorage.getItem('auth_session');
  if (sessionId) {
    delete userSessions[sessionId];
    localStorage.removeItem('auth_session');
  }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
