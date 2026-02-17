# 🔑 Getting Your Resend API Key

## ⚠️ Important Note
The API key currently in your `.env.local` file appears to be a Google API key (starts with `AIzaSy...`).

For email sending, you need a **Resend API key** which starts with `re_`.

## 📝 Step-by-Step Guide to Get Resend API Key

### Step 1: Sign Up for Resend
1. Go to: **https://resend.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Create an account using:
   - Your email address
   - GitHub account (recommended - faster)
   - Google account

### Step 2: Verify Your Email
1. Check your email inbox
2. Click the verification link
3. Complete the verification

### Step 3: Get Your API Key
1. After logging in, you'll see the dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g., "VaaniAi Development")
5. Select permissions: **"Full Access"** or **"Sending Access"**
6. Click **"Create"**
7. **COPY THE KEY IMMEDIATELY** - it starts with `re_`
   - Example: `re_123abc456def789ghi012jkl345mno678`

### Step 4: Update Your .env.local File
1. Open `.env.local` in your project
2. Replace the current RESEND_API_KEY value with your new key:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   ```
3. Save the file
4. Restart your dev server

### Step 5: Test Email Sending
1. Go to http://localhost:3000
2. Click "Get Started"
3. Enter your REAL email address
4. Click "Send OTP"
5. Check your email inbox! 📧

## 🆓 Free Tier Benefits
- **3,000 emails per month** - FREE
- **100 emails per day** - FREE
- No credit card required
- Perfect for development and small projects

## 📧 Email Domain Options

### For Testing (Immediate - No Setup)
```
FROM_EMAIL=onboarding@resend.dev
```
- Works immediately
- Can send to ANY email address
- Perfect for development

### For Production (Requires Domain Verification)
```
FROM_EMAIL=noreply@yourdomain.com
```
- Requires adding your domain in Resend
- Requires DNS verification
- Better for production use

## 🔍 How to Verify It's Working

After setting up:
1. The yellow "Email service not configured" box will NOT appear
2. You'll receive actual emails in your inbox
3. The email will have a beautiful purple design with your OTP

## ❓ Troubleshooting

**Still seeing the yellow box?**
- Make sure the API key starts with `re_`
- Restart the dev server after changing `.env.local`
- Check for typos in the API key

**Not receiving emails?**
- Check spam/junk folder
- Verify the email address is correct
- Check Resend dashboard for delivery logs

**API Key Invalid?**
- Make sure you copied the entire key
- No extra spaces before or after the key
- Key should start with `re_`

## 🎯 Current Status

✅ Server is running
✅ Environment file exists
⚠️ Need to replace with correct Resend API key
⏳ Then emails will work automatically!

---

**Need help?** The Resend documentation is excellent: https://resend.com/docs
