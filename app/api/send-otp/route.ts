import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name, phone } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.warn('[Email] Resend API key not configured - development mode');
      return NextResponse.json(
        { error: 'Email service not configured', development: true },
        { status: 503 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Vaani Ai <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email,
      subject: 'Your OTP for Vaani Ai - Government Services Portal',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Vaani Ai</h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Voice-Based Government Services</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Verification Code</h2>
                        <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                          Hello ${name || 'User'},<br><br>
                          Thank you for using our voice-based government services portal. Below are the details you provided and your unique verification code:
                        </p>

                        <!-- User Details Section -->
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #4f46e5;">
                          <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                          <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                          <p style="margin: 0; color: #1f2937; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                        </div>
                        
                        <!-- OTP Box -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <div style="background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); border: 2px solid #4f46e5; border-radius: 12px; padding: 30px; display: inline-block;">
                                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                                <p style="margin: 0; color: #4f46e5; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                          <strong style="color: #1f2937;">Important:</strong> This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                          This is an automated message from Vaani Ai - Voice-Based Government Services
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © 2024 Vaani Ai. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      // Return a more descriptive error if possible
      const errorMessage = (error as any).message || 'Failed to send email';
      return NextResponse.json(
        { error: errorMessage, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
