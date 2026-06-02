# 🚀 Deployment Guide

This guide covers deploying Wardrobe AI to production on various platforms.

## Prerequisites

Before deploying, ensure:
- ✅ Code is working locally (`npm run dev`)
- ✅ Build passes (`npm run build`)
- ✅ `.env.example` is up-to-date
- ✅ All secrets are configured in the platform, NOT in code
- ✅ README.md is comprehensive

## Option 1: Vercel (Recommended)

**Why Vercel?** Fastest deployment, automatic builds on git push, built-in environment variables, zero config.

### Steps

1. **Commit and push to GitHub**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Go to [Vercel.com](https://vercel.com)**
   - Sign up or log in with GitHub
   - Click "New Project"
   - Select your `wardrobe-ai` repository
   - Click "Import"

3. **Configure Environment**
   - **Framework:** Vite
   - **Root Directory:** `wardrobe-ai` (if in monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add `VITE_GEMINI_API_KEY` with your API key
   - Make sure it's for "Production" and "Preview"
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your live URL!

### After Deployment
- Vercel auto-deploys on every git push to main
- Pull requests get preview URLs automatically
- Monitor in Vercel dashboard

## Option 2: Netlify

### Steps

1. **Build locally and deploy**
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

Or drag & drop the `dist` folder to [Netlify.com](https://netlify.com)

2. **If using Git deployment**
   - Connect your GitHub repo to Netlify
   - Set Build Command: `npm run build`
   - Set Publish Directory: `dist`

3. **Configure Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add `VITE_GEMINI_API_KEY`
   - Trigger a rebuild

## Option 3: GitHub Pages

### Steps

1. **Update vite.config.js**
```javascript
export default {
  base: '/wardrobe-ai/', // your repo name
  plugins: [react()],
}
```

2. **Build and deploy**
```bash
npm run build
# Creates dist/ folder
```

3. **Push to gh-pages branch**
```bash
# Option A: Using gh-pages package
npm install --save-dev gh-pages
# Add to package.json:
# "deploy": "npm run build && gh-pages -d dist"
npm run deploy

# Option B: Manual push
git add dist
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

4. **Set up GitHub Pages**
   - Repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

Note: Environment variables must be added in GitHub Actions or `vite.config.js`

## Option 4: Self-Hosted (Node.js)

### On Your Server

1. **Clone repository**
```bash
git clone your-repo
cd wardrobe-ai
```

2. **Install dependencies**
```bash
npm install
npm run build
```

3. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your API key
nano .env
```

4. **Serve with Node.js**
```bash
# Option A: Simple http-server
npm install -g http-server
http-server dist -p 3000

# Option B: Express.js
npm install express
# Create server.js
node server.js
```

5. **Use PM2 for persistence**
```bash
npm install -g pm2
pm2 start http-server --name wardrobe-ai -- dist -p 3000
pm2 save
pm2 startup
```

6. **Set up reverse proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name youromain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Option 5: Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
RUN npm run build

# Serve stage
FROM node:18-alpine
RUN npm install -g http-server
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]
```

### Build and run
```bash
docker build \
  --build-arg VITE_GEMINI_API_KEY=your_key_here \
  -t wardrobe-ai .

docker run -p 3000:3000 wardrobe-ai
```

## Environment Variables

### Production Checklist

Before deploying to production:

- [ ] `VITE_GEMINI_API_KEY` is set
- [ ] API key has production quota
- [ ] API key is NOT in git history
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` is in git (template only)
- [ ] Build passes locally: `npm run build`
- [ ] No console errors or warnings in production
- [ ] localStorage is working
- [ ] All features tested in production build

## Performance Optimization

### Build Optimization
```bash
# Check bundle size
npm run build -- --report

# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
```

### Runtime Optimization
- Enable HTTP/2 on your server
- Set up CDN for static assets
- Enable GZIP compression
- Cache busting with hash filenames (Vite does this automatically)
- Use service workers for offline support (optional)

## Monitoring & Troubleshooting

### Monitor in Production

1. **Error Tracking**
   - Set up Sentry for error reporting
   - Get alerts for crashes

2. **Analytics**
   - Add Google Analytics or Plausible
   - Track user behavior

3. **Performance**
   - Use Lighthouse CI
   - Monitor Core Web Vitals

### Common Issues

**Issue:** API key not working in production
- ✅ Check env var is set correctly
- ✅ Verify API key is active and not revoked
- ✅ Check rate limits haven't been exceeded

**Issue:** Static assets returning 404
- ✅ Verify `base` path in vite.config.js
- ✅ Check build output directory is correct
- ✅ Ensure server serves dist files correctly

**Issue:** localStorage not working
- ✅ Check user hasn't disabled storage
- ✅ Verify domain/origin settings
- ✅ Test in incognito mode (might be disabled)

## Continuous Deployment

### GitHub Actions Example

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
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install && npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Rollback

If something goes wrong:

- **Vercel:** Click "Deployments" → Select previous version → "Promote to Production"
- **Netlify:** Site Settings → Deploys → Select previous build → "Publish deploy"
- **GitHub Pages:** Push fix to main, redeploy
- **Self-hosted:** Restore from backup or roll back code with `git revert`

## Support

For deployment issues:
- Check platform-specific documentation
- Review your build logs
- Ensure environment variables are set
- Test locally first with `npm run build && npm run preview`

---

**Deployment Checklist** ✅
- [ ] App builds successfully
- [ ] No console errors
- [ ] Environment variables set
- [ ] Tested in production build
- [ ] Performance acceptable
- [ ] Monitoring set up
- [ ] Deployment complete
- [ ] Testing in production
