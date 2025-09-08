# NextAuth.js Setup Guide

## Environment Variables Required

Add these variables to your `.env.local` file:

```env
# NextAuth.js Authentication Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

## Generate NextAuth Secret

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use any random string generator.

## Common Issues

### "Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON"

This error occurs when:
1. **Missing environment variables** - Make sure all required variables are set
2. **Wrong Google OAuth configuration** - Check redirect URIs
3. **TypeScript errors** - Run `npx tsc --noEmit` to check for errors
4. **Development server issues** - Restart the development server

### Fix Steps:
1. ✅ Add all required environment variables to `.env.local`
2. ✅ Restart the development server (`npm run dev`)
3. ✅ Check browser console for specific error messages
4. ✅ Verify Google OAuth credentials are correct

## Testing Authentication

After setup, test the authentication:

1. Go to `/auth/signin`
2. Click "Google Sign In"
3. Complete OAuth flow
4. Check if session is created successfully

The authentication should work without the JSON parsing error once all environment variables are properly configured.
