# Supabase Configuration Guide

## ⚠️ CRITICAL - Email Redirect Setup

Your app is deployed at: `https://study-buddy-git-main-agrawalers-projects.vercel.app`

You MUST configure Supabase to allow redirects to your domain:

### Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `nbvoeccgpuiqfdjbzlwt`
3. Navigate to **Authentication** → **URL Configuration**
4. Set **Site URL** to: `https://study-buddy-git-main-agrawalers-projects.vercel.app`
5. Add to **Redirect URLs**:
   ```
   http://localhost:8080/auth
   https://study-buddy-git-main-agrawalers-projects.vercel.app/auth
   ```

### Screenshot Guide:
- Site URL: `https://study-buddy-git-main-agrawalers-projects.vercel.app`
- Redirect URLs (one per line):
  - `http://localhost:8080/auth`
  - `https://study-buddy-git-main-agrawalers-projects.vercel.app/auth`

Click **Save** after adding these URLs.

## Email Templates (Optional)

To customize the verification email:
1. Go to **Authentication** → **Email Templates**
2. Edit the "Confirm signup" template
3. The confirmation link will automatically redirect to your configured URL

## Disable Email Confirmation (For Testing Only)

If you want to skip email verification during development:
1. Go to **Authentication** → **Providers** → **Email**
2. Disable "Confirm email"
3. ⚠️ **Re-enable this in production for security!**
