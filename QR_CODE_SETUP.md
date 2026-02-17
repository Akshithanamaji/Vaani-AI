# QR Code Submission System - Setup Guide

## Overview

After submitting an application form, the system generates a QR code that can be scanned to retrieve the submitted details. The QR code is valid for **24 hours** from the time of submission.

## How QR Code Works

1. **User submits form** → Application is saved to backend database
2. **QR code is generated** → Contains a link to view submission details
3. **QR code is scanned** → Mobile device opens the submission details page
4. **Details are displayed** → Shows all submitted information with countdown timer

## Important: Mobile Access Setup

### Problem
When you first run this app locally on `localhost:3000`, scanning the QR code from a mobile device **will NOT work** because:
- `localhost` refers to the computer itself
- Mobile devices cannot access `localhost` on your computer
- The QR code needs to point to your computer's network IP address

### Solution: Use Your Network IP Address

#### Step 1: Find Your Computer's IP Address

**On Windows (PowerShell):**
```powershell
ipconfig
```
Look for "IPv4 Address" (usually something like `192.168.x.x`)

**On Mac/Linux:**
```bash
ifconfig
```

#### Step 2: Update Environment Variable

Edit `.env.local` and set:
```
NEXT_PUBLIC_BASE_URL=http://YOUR_IP_ADDRESS:3000
```

Example:
```
NEXT_PUBLIC_BASE_URL=http://192.168.1.60:3000
```

#### Step 3: Restart Dev Server

```bash
npm run dev
```

#### Step 4: Access from Desktop

Instead of `localhost:3000`, access the app at:
```
http://YOUR_IP_ADDRESS:3000
```

Example: `http://192.168.1.60:3000`

Now when you submit a form and scan the QR code from your mobile device, it will work!

---

## QR Code Features

### 24-Hour Expiry
- QR codes are automatically valid for 24 hours from submission
- After 24 hours, the link returns a "410 Gone" status
- Attempting to view an expired submission shows an error message

### Admin Modifications
- Admins can view and modify submissions at any time
- Once an admin modifies a submission, it **immediately expires**
- This prevents further viewing/modifications after admin review

### Viewer Tracking
- Each time someone views a submission, they're recorded in the system
- Viewing DOES NOT trigger expiry (only admin modification does)
- Useful for audit trails

---

## Testing the QR Code Feature Locally

### For Desktop Testing
1. Access `http://localhost:3000` or `http://YOUR_IP:3000`
2. Fill out a form and submit
3. QR code appears with countdown timer
4. Click the QR code or copy the URL and open in a new tab
5. Submission details page loads with all submitted data

### For Mobile Testing
1. Set `NEXT_PUBLIC_BASE_URL` to your IP address (see above)
2. On your mobile device, visit `http://YOUR_IP:3000`
3. Fill out a form and submit
4. Point your phone camera at the QR code
5. Tap the notification that appears (iOS) or follow the link (Android)
6. Submission details page loads on your phone

---

## API Endpoints Reference

### Create Submission
```
POST /api/submissions/create
Content-Type: application/json

{
  "serviceName": "PAN Card",
  "serviceId": 2,
  "userDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}

Response 201:
{
  "success": true,
  "submission": {
    "id": "SUB_1770305827100_3b86ygwk1",
    "serviceName": "PAN Card",
    "qrUrl": "http://YOUR_IP:3000/submission/SUB_1770305827100_3b86ygwk1",
    "expiresAt": 1770392227100,
    "submittedAt": 1770305827100
  }
}
```

### Get Submission Details
```
GET /api/submissions/{submissionId}?viewer=user

Response 200:
{
  "success": true,
  "submission": {
    "id": "SUB_1770305827100_3b86ygwk1",
    "serviceName": "PAN Card",
    "userDetails": { ... },
    "timeRemaining": 86400000,
    "hoursRemaining": 24,
    "minutesRemaining": 0,
    "isExpired": false,
    "viewedBy": ["user"]
  }
}

Response 404: Submission not found
Response 410: Submission expired
```

### Admin Modify Submission
```
PATCH /api/submissions/{submissionId}
Content-Type: application/json
Authorization: ADMIN_SECRET_KEY

{
  "updates": {
    "name": "Updated Name",
    "email": "new@example.com"
  },
  "adminId": "admin_user",
  "adminKey": "your_admin_secret_key_here"
}

Response 200: Submission modified and immediately expired
```

---

## Troubleshooting

### QR Code Page Shows "Loading..."
- The page is fetching data from the backend
- Wait a few seconds
- If it continues, check network connectivity

### QR Code Page Shows Error "Connection error"
- Mobile device cannot reach your computer's IP
- Verify your IP address is correct
- Check firewall isn't blocking port 3000
- Restart the dev server

### QR Code Returns "Submission expired"
- The 24-hour period has passed since submission, OR
- An admin modified the submission (which expires it immediately)

### QR Code Returns "Submission not found"
- The submission ID in the URL is invalid
- The submission was manually deleted by an admin

---

## Configuration

### Environment Variables

```env
# Admin authentication secret (required for admin modifications)
ADMIN_SECRET_KEY=your_admin_secret_key_here

# Base URL for QR codes (must be accessible from mobile devices)
# Leave empty for automatic detection, or set to your network IP
NEXT_PUBLIC_BASE_URL=http://192.168.1.60:3000

# Database file location for storing submissions
SUBMISSION_DB_FILE=/tmp/submissions.json
```

---

## Common Questions

**Q: Why does my QR code not work on mobile?**
A: The QR likely contains `localhost:3000`. Set `NEXT_PUBLIC_BASE_URL` to your computer's network IP address.

**Q: Can I change the 24-hour expiry?**
A: Currently hardcoded to 24 hours. To change, edit `lib/submission-db.ts` and modify the expiry calculation in `createSubmission()`.

**Q: Does viewing a submission log me in as "viewer"?**
A: Yes, to prevent future viewing, admins should PATCH to expire it immediately.

**Q: Can users be notified when their submission is viewed?**
A: Currently not implemented. The system only tracks views for audit purposes. This can be added with email/SMS notifications.

**Q: What happens after 24 hours?**
A: The submission data remains in the database but returns a 410 Gone status, indicating it's no longer available. The data can still be deleted manually by an admin.

---

## Next Steps

1. ✅ Set `NEXT_PUBLIC_BASE_URL` to your IP address
2. ✅ Restart the dev server
3. ✅ Submit a test form
4. ✅ Scan the QR code from your mobile device
5. ✅ Verify submission details appear

Happy testing! 🚀
