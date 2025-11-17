# Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub account with repository
- Vercel account (sign up at vercel.com)
- Supabase project (with migrations applied)
- OpenAI API key

### Step-by-Step Deployment

#### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Choose your AI News App repository
5. Click "Import"

#### 2. Configure Project Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

#### 3. Environment Variables

Add these in the Vercel project settings:

**Production Environment:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
CRON_SECRET=generate_random_secret_string
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Preview & Development:**
- Copy same variables to Preview and Development environments
- Update `NEXT_PUBLIC_SITE_URL` for each environment

#### 4. Deploy

Click "Deploy" and wait for the build to complete.

### Automatic Deployments

- **Production**: Automatic deployment on push to `main` branch
- **Preview**: Automatic deployment for pull requests
- **Rollback**: One-click rollback to previous deployments

### Cron Job Configuration

The cron job is configured in `vercel.json`:
- **Schedule**: Daily at 6 AM UTC (`0 6 * * *`)
- **Endpoint**: `/api/ingestion/run`
- **Authentication**: Uses `CRON_SECRET` header
- **Note**: Cron jobs require Vercel Pro plan

### Post-Deployment Setup

#### 1. Configure Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

#### 2. Set Up Admin User
1. Sign up through your deployed app
2. Manually update user role in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your_user_id';
```

#### 3. Add News Sources
1. Log in as admin
2. Go to Admin > Sources
3. Add RSS feeds or API endpoints

#### 4. Test Ingestion
1. Go to Admin Dashboard
2. Click "Trigger Ingestion"
3. Monitor logs for successful article fetching

### Testing Cron Job

Test manually via admin dashboard or:
```bash
curl -X GET https://your-domain.vercel.app/api/ingestion/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Monitoring

#### Vercel Dashboard
- Function logs and errors
- Deployment history
- Performance metrics
- Cron job execution logs

#### Application Monitoring
- Admin dashboard for ingestion stats
- AI activity logs for cost tracking
- User analytics (if configured)

### Troubleshooting

#### Build Failures
- Check environment variables are set
- Verify all dependencies are in package.json
- Review build logs in Vercel dashboard

#### Cron Job Not Running
- Verify Vercel Pro plan is active
- Check CRON_SECRET is configured
- Review function logs for errors

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure migrations are applied
