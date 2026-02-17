# Email Setup Guide for GovVoice Portal

## Overview
This application now sends real OTP emails using Resend, a reliable email delivery service.

## Setup Instructions

### Step 1: Get a Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (no credit card required)
3. Verify your email address
4. Navigate to **API Keys** section
5. Click **Create API Key**
6. Copy your API key

### Step 2: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `your_resend_api_key_here` with your actual Resend API key:
   ```
   RESEND_API_KEY=re_123456789abcdefghijklmnop
   ```

### Step 3: Email Domain Configuration

**For Testing (Free Tier):**
- Resend provides a test domain: `onboarding@resend.dev`
- This is already configured in `.env.local`
- You can send emails to **any email address** for testing

**For Production (Custom Domain):**
1. Add your domain in Resend dashboard
2. Verify DNS records
3. Update `.env.local`:
   ```
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Step 4: Restart the Development Server

After updating `.env.local`, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## How It Works

1. User enters their email address
2. System generates a 6-digit OTP
3. API route (`/api/send-otp`) sends a beautifully formatted email
4. User receives the OTP in their inbox
5. User enters the OTP to verify and login

## Email Features

✅ Professional HTML email template
✅ Responsive design (mobile-friendly)
✅ Purple gradient branding matching your app
✅ Clear OTP display
✅ 10-minute expiration notice
✅ Security information

## Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify the email address is correct
- Check Resend dashboard for delivery status
- Ensure API key is correctly set in `.env.local`

**API Error?**
- Restart the dev server after changing `.env.local`
- Check browser console for error messages
- Verify Resend API key is valid

## Free Tier Limits

Resend free tier includes:
- 3,000 emails per month
- 100 emails per day
- Perfect for development and testing!

## Next Steps

Once configured, your users will receive professional OTP emails instantly!
