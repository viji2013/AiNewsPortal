# GitHub Repository Setup

## Initial Setup

### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI News App"

# Create GitHub repository (via GitHub CLI or web interface)
gh repo create ai-news-app --public --source=. --remote=origin

# Or manually add remote
git remote add origin https://github.com/YOUR_USERNAME/ai-news-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Repository Settings

Configure the following in GitHub repository settings:

- **Description**: AI-powered news aggregator with automated content ingestion
- **Topics**: nextjs, typescript, supabase, openai, ai, news-aggregator
- **Branch Protection**: Enable for `main` branch
  - Require pull request reviews
  - Require status checks to pass
  - Require branches to be up to date

### 3. Secrets Configuration

Add the following secrets in Settings > Secrets and variables > Actions:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
CRON_SECRET
```

## Vercel Integration

### Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### Automatic Deployments

- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on pull requests
- **Environment Variables**: Synced from Vercel dashboard

## Workflow

### Development Flow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit
3. Push branch: `git push origin feature/your-feature`
4. Create pull request on GitHub
5. Wait for CI checks to pass
6. Merge to main after review
7. Automatic deployment to production

### Hotfix Flow

1. Create hotfix branch from main
2. Make urgent fixes
3. Fast-track review and merge
4. Automatic deployment
