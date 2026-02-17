# Quick Resend Setup - Get Emails Working NOW!

## The Problem
You currently have a Google API key, but we need a Resend API key to send emails.

## The Solution (5 minutes)

### 1️⃣ Go to Resend
Open this link: **https://resend.com/signup**

### 2️⃣ Sign Up (Choose One)
- Click "Continue with GitHub" (FASTEST - 30 seconds)
- OR use your email address

### 3️⃣ Get Your API Key
After signing in:
1. You'll see the dashboard
2. Look for "API Keys" in the left menu
3. Click "Create API Key"
4. Name it: "VaaniAi"
5. Click "Create"
6. **COPY THE KEY** - it looks like: `re_abc123def456...`

### 4️⃣ Update .env.local
Open your `.env.local` file and replace this line:
```
RESEND_API_KEY=AIzaSyCtONoGbE4jnCuQjomrRrQkMv5VeN9C_38
```

With your new key:
```
RESEND_API_KEY=re_your_key_here
```

### 5️⃣ Restart Server
In your terminal:
- Press `Ctrl+C` to stop the server
- Run: `npm run dev`

### 6️⃣ Test It!
1. Go to http://localhost:3000
2. Click "Get Started"
3. Enter YOUR REAL EMAIL
4. Click "Send OTP"
5. **CHECK YOUR EMAIL INBOX!** 📧

## What You'll Receive

A beautiful email with:
- Purple gradient header with "GovVoice" branding
- Your 6-digit OTP in large numbers
- Professional design
- 10-minute expiration notice

## Free Forever
- 3,000 emails per month FREE
- 100 emails per day FREE
- No credit card needed
- Perfect for your needs!

---

**That's it!** Once you add the correct key, emails will be sent automatically to any email address you enter.
