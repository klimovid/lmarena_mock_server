# 🚀 Deployment Guide

Complete guide for deploying Arena Mock Server to Vercel.

## Prerequisites

- Node.js 18+ installed
- Yarn package manager
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier works perfectly)

## Method 1: Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the authentication flow in your browser.

### Step 3: Deploy

```bash
cd arena_mock_server

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 4: Get Your URL

Vercel will output your deployment URL:
```
https://arena-mock-server-xxx.vercel.app
```

## Method 2: GitHub Integration (Automatic)

### Step 1: Push to GitHub

```bash
cd arena_mock_server
git init
git add .
git commit -m "Initial mock server"
git remote add origin https://github.com/your-username/arena-mock-server.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects Next.js → No configuration needed!
5. Click "Deploy"

### Step 3: Automatic Deployments

Every push to `main` branch automatically deploys to production.
Pull requests create preview deployments.

## Configuration

### Environment Variables (Optional)

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add variables:
   - `NODE_ENV=production`
   - `PORT=8080` (optional, Vercel manages this)

### Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Update Frontend Configuration

After deployment, update your frontend `.env.local`:

```env
# Local development (mock server)
NEXT_PUBLIC_API_BASE_URL=https://your-mock-server.vercel.app/api/v1

# Or for local testing
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Verify Deployment

### Test Health Endpoint

```bash
curl https://your-mock-server.vercel.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "arena-api-mock",
  "api": "/api/v1",
  "timestamp": "2025-01-07T12:00:00.000Z",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "storage": "ok"
  }
}
```

### Test Create User

```bash
curl -X POST https://your-mock-server.vercel.app/api/v1/users
```

Expected response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Monitoring & Logs

### View Logs

```bash
# Via CLI
vercel logs

# Real-time logs
vercel logs --follow

# Filter by function
vercel logs --filter="POST /api/v1/chats"
```

### View in Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Deployments" tab
4. Click on a deployment → View logs

## Performance

Vercel's Edge Network provides:
- **Global CDN**: Deploy to 40+ regions
- **Cold start**: ~200ms (serverless functions)
- **Response time**: ~50-100ms (with cache)
- **Bandwidth**: Unlimited on Pro plan

## Troubleshooting

### Issue: CORS Errors

**Solution**: Check `vercel.json` headers configuration:

```json
{
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

For production, replace `*` with your frontend domain.

### Issue: SSE Streaming Not Working

**Solution**: Ensure response headers include:
```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```

Already configured in `src/app/api/v1/chats/[id]/messages/stream/route.ts`

### Issue: Build Fails

**Common causes:**
1. TypeScript errors → Run `yarn type-check` locally
2. Missing dependencies → Check `package.json`
3. Node version mismatch → Vercel uses Node 18+

**Solution**: Check build logs in Vercel dashboard.

### Issue: 404 on API Routes

**Cause**: Route file structure doesn't match URL

**Solution**: Verify file paths in `src/app/api/v1/`

## Rollback

### Via CLI
```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote <deployment-url>
```

### Via Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

## Cost

**Free Tier Limits:**
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- Unlimited API requests
- 1 concurrent build

**Pro Tier ($20/month):**
- 1 TB bandwidth
- 1000 GB-hours execution
- Unlimited builds
- Priority support

For mock server, **Free tier is sufficient**.

## CI/CD Integration

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security

### API Rate Limiting

Currently not implemented (mock server).

For production, add rate limiting in `src/middleware.ts`.

### Environment Secrets

Never commit:
- API keys
- Database credentials
- Secret tokens

Use Vercel Environment Variables for secrets.

## Next Steps

1. ✅ Deploy mock server to Vercel
2. ✅ Test all endpoints
3. ✅ Update frontend configuration
4. ✅ Monitor logs and performance
5. 🎯 Start developing with confidence!

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Ready to deploy?** Run `vercel` in your terminal! 🚀

