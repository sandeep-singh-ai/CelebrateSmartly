# Configuration Guide for CelebrateSmartly

## 🚨 Critical Issue: Invitation System Not Working

If you're getting the error **"Failed to send invitations. Please try again."**, it's because the Brevo API key is not configured.

## 🔑 Required Configuration

### 1. Brevo API Key (REQUIRED for invitations)

The Brevo API key is essential for sending invitation emails with QR codes. Without it, the invitation system will fail.

#### How to get your Brevo API key:

1. Go to [Brevo (Sendinblue) Dashboard](https://app.brevo.com/settings/keys/api)
2. Sign in or create an account
3. Navigate to **Settings** → **API Keys**
4. Create a new API key or copy an existing one
5. The key should start with `xkeysib-...`

#### How to configure it:

1. Create a `.env.local` file in your project root (same level as `package.json`)
2. Add this line to the file:
   ```
   VITE_BREVO_API_KEY=xkeysib-your_actual_api_key_here
   ```
3. Replace `xkeysib-your_actual_api_key_here` with your real API key
4. **Restart your development server** (this is crucial!)

### 2. Environment File Structure

Create a `.env.local` file in your project root with this content:

```bash
# Brevo API Key - REQUIRED for invitations
VITE_BREVO_API_KEY=xkeysib-your_brevo_api_key_here

# Supabase Configuration - REQUIRED for database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional APIs
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
VITE_AWS_BUCKET_NAME=your_s3_bucket_name_here
VITE_AWS_REGION=us-east-1
```

## 🔍 How to Check Configuration

1. Visit `/qr-test` in your app
2. Click on the **"Configuration"** tab
3. Check if the Brevo API Key shows as "Configured" (green checkmark)
4. If it shows "Missing" (red X), the configuration is not working

## 🛠️ Troubleshooting Steps

### Step 1: Verify Environment File
- Make sure `.env.local` exists in your project root
- Check that the file name is exactly `.env.local` (not `.env.local.txt`)
- Ensure there are no spaces around the `=` sign

### Step 2: Restart Development Server
After creating/modifying `.env.local`:
```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
# or
bun dev
```

### Step 3: Check Browser Console
Open browser developer tools and look for:
- Warning: "Brevo API key not configured"
- Check the console for detailed environment variable information

### Step 4: Verify API Key Format
- Brevo API keys start with `xkeysib-`
- They are typically 64+ characters long
- Make sure you copied the entire key

## 📧 Testing the Invitation System

Once configured:

1. **Generate Demo QR Code**: Visit `/qr-test` and generate a demo QR code
2. **Test Scanner**: Use the QR scanner to test the check-in system
3. **Send Real Invitations**: Try sending invitations from your events

## 🔐 Security Notes

- **Never commit** `.env.local` to version control
- The `.env.local` file is automatically ignored by Git
- API keys are only visible in the browser during development
- In production, use your hosting platform's environment variable system

## 📞 Getting Help

If you're still having issues:

1. Check the **Configuration** tab in `/qr-test`
2. Look at browser console errors
3. Verify your Brevo API key is active and has proper permissions
4. Ensure your Brevo account has email sending enabled

## 🎯 What This Fixes

Once configured, you'll be able to:
- ✅ Send invitation emails with unique QR codes
- ✅ Generate QR codes for each guest automatically
- ✅ Scan QR codes at events for guest check-in
- ✅ Track invitation status and responses
- ✅ Use the complete invitation management system

The QR code system will work seamlessly, providing each guest with a unique invitation that includes their personalized QR code for event check-in.
