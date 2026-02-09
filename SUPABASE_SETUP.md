# Supabase Configuration Guide

## Email Redirect Setup

After deploying to Vercel, you MUST configure Supabase to allow redirects to your domain:

### Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `nbvoeccgpuiqfdjbzlwt`
3. Navigate to **Authentication** → **URL Configuration**
4. Add your deployed URL to **Redirect URLs**:
   - For local development: `http://localhost:8080/auth`
   - For production: `https://your-app.vercel.app/auth`

### Example:
```
Site URL: https://your-app.vercel.app
Redirect URLs:
  - http://localhost:8080/auth
  - https://your-app.vercel.app/auth
```

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
