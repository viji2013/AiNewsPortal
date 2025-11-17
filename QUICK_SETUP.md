# Quick Setup Guide

## ✅ Step 1: Environment Variables (DONE!)

Your `.env.local` file has been created with all credentials.

## 🗄️ Step 2: Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/wxctsrsjfqwkfbedxtfa

2. Click on **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste the entire contents of `supabase/setup-database.sql`

5. Click **Run** (or press Ctrl+Enter)

6. You should see: "Database setup completed successfully!"

## 🔐 Step 3: Configure Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**

2. **Enable Email** (already enabled by default)

3. **Enable Google OAuth** (optional):
   - Toggle ON
   - Add redirect URL: `http://localhost:3000/auth/callback`
   - Get Client ID and Secret from Google Cloud Console

4. **Enable GitHub OAuth** (optional):
   - Toggle ON  
   - Add redirect URL: `http://localhost:3000/auth/callback`
   - Get Client ID and Secret from GitHub OAuth Apps

5. **Configure SMS/OTP with MSG91**:
   - Go to **Authentication** > **Providers** > **Phone**
   - Toggle ON
   - Select "Twilio" or custom provider
   - Add MSG91 credentials

## 🚀 Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 Step 4: Test the App

1. Open http://localhost:3000
2. You should see the login page
3. Sign up with email or OAuth
4. After login, you'll be redirected to the feed

## 👨‍💼 Step 5: Make Yourself Admin

1. Sign up/login to create your account
2. Go to Supabase Dashboard > **Table Editor** > **profiles**
3. Find your user record
4. Change `role` from `user` to `admin`
5. Refresh the app
6. You can now access `/admin`

## 📰 Step 6: Add News Sources (Admin Only)

1. Go to http://localhost:3000/admin
2. Click **Sources** in the navigation
3. Sample sources are already added!
4. Click **Trigger Ingestion** to fetch articles

## 🎉 You're Done!

Your AI News App is now fully configured and ready to use!

### What's Working:
- ✅ Authentication (Email, Google, GitHub, SMS)
- ✅ Database with all tables
- ✅ News article storage
- ✅ Bookmarking and collections
- ✅ Search and filtering
- ✅ Admin panel
- ✅ AI summarization (OpenAI)
- ✅ Content ingestion

### Next Steps:
- Add more news sources in admin panel
- Trigger manual ingestion to fetch articles
- Customize your feed preferences
- Deploy to Vercel (see DEPLOYMENT.md)

## 🆘 Troubleshooting

### Can't login?
- Check Supabase auth is configured
- Verify redirect URLs are correct

### No articles showing?
- Go to admin panel
- Trigger manual ingestion
- Check sources are active

### Database errors?
- Verify all migrations ran successfully
- Check RLS policies are enabled

Need help? Check the full documentation in README.md
