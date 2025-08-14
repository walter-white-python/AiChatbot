# 🚀 Deployment Guide

Complete guide to deploy your AI chatbot to various hosting platforms.

## Quick Deployment Options

### Option 1: Vercel (Recommended)
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variable management
- ✅ Automatic deployments from Git

### Option 2: Netlify
- ✅ Free tier available
- ✅ Easy environment variables
- ✅ Form handling
- ✅ Branch previews

### Option 3: Cloudflare Pages
- ✅ Fast global network
- ✅ Workers integration
- ✅ Free tier
- ✅ Advanced caching

---

## 🔸 Vercel Deployment

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy from your project**
```bash
cd /path/to/ai-chatbot
vercel
```

3. **Follow the prompts:**
```
? Set up and deploy "ai-chatbot"? [Y/n] y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] n
? What's your project's name? ai-chatbot
? In which directory is your code located? ./
? Want to modify these settings? [y/N] n
```

4. **Add environment variables** (if using real AI):
```bash
vercel env add OPENAI_API_KEY
# Enter your API key when prompted
```

5. **Redeploy with environment variables:**
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

1. **Push code to GitHub/GitLab**
```bash
git add .
git commit -m "Deploy chatbot"
git push origin main
```

2. **Import project on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework preset: **Vite** (auto-detected)
   - Build command: `bun build`
   - Output directory: `dist`

3. **Configure environment variables:**
   - Go to Project Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `sk-your-key-here`
   - Add: `ANTHROPIC_API_KEY` = `your-key-here` (if using)

4. **Deploy:** Click "Deploy" and wait for build completion

---

## 🔸 Netlify Deployment

### Method 1: Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and deploy**
```bash
cd ai-chatbot
bun build
netlify deploy --prod --dir=dist
```

3. **Set environment variables:**
```bash
netlify env:set OPENAI_API_KEY sk-your-key-here
```

### Method 2: Netlify Dashboard

1. **Build the project**
```bash
bun build
```

2. **Deploy via dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder to deploy
   - Or connect your Git repository for automatic deployments

3. **Environment variables:**
   - Site settings → Environment variables
   - Add your API keys

---

## 🔸 Cloudflare Pages Deployment

1. **Build the project**
```bash
bun build
```

2. **Deploy to Cloudflare:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → Create application → Upload assets
   - Upload the `dist/` folder

3. **Environment variables:**
   - Settings → Environment variables
   - Add production variables

---

## 🔸 Other Platforms

### GitHub Pages
```bash
bun build
# Push dist/ folder to gh-pages branch
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Railway
```bash
# Push to GitHub, then connect on railway.app
```

---

## ⚙️ Build Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "bun build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "app/api/chat.js": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "ANTHROPIC_API_KEY": "@anthropic_api_key"
  }
}
```

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "bun build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  directory = "netlify/functions"
```

---

## 🔐 Environment Variables Setup

### Required Variables
```env
# Choose one or more
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GEMINI_API_KEY=your-gemini-key-here
```

### Platform-Specific Setup

**Vercel:**
```bash
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
```

**Netlify:**
```bash
netlify env:set OPENAI_API_KEY sk-your-key
netlify env:set ANTHROPIC_API_KEY your-key
```

**Cloudflare Pages:**
- Dashboard → Settings → Environment variables
- Add each key with its value

---

## 🧪 Testing Your Deployment

1. **Visit your deployed URL**
2. **Test demo mode** (should work immediately)
3. **Test real AI** (if API keys configured):
   - Send a message
   - Should get real AI response, not demo text
4. **Check developer console** for any errors
5. **Test on mobile** for responsive design

---

## 🔄 Continuous Deployment

### Automatic Deployments
Most platforms support automatic deployments:

1. **Connect your Git repository**
2. **Every push to main branch** triggers deployment
3. **Preview deployments** for pull requests
4. **Environment variables** persist across deployments

### Deployment Commands
```bash
# Force redeploy on Vercel
vercel --prod

# Force redeploy on Netlify
netlify deploy --prod --dir=dist

# Git-based redeployment (all platforms)
git push origin main
```

---

## 🎯 Domain Configuration

### Custom Domain Setup
1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Add to your platform:**
   - Vercel: Project Settings → Domains
   - Netlify: Site settings → Domain management
   - Cloudflare: Pages → Custom domains

### SSL Certificates
All platforms provide **free SSL certificates** automatically.

---

## 📊 Monitoring & Analytics

### Built-in Analytics
- **Vercel**: Analytics dashboard included
- **Netlify**: Analytics available (paid)
- **Cloudflare**: Web Analytics (free)

### Custom Analytics
Add to your `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Or use Plausible, Mixpanel, etc. -->
```

---

## 🚨 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Check node version
node --version  # Should be 18+
bun --version   # Should be 1.0+

# Clear cache
rm -rf node_modules dist
bun install
bun build
```

**Environment variables not working:**
- Verify variable names match exactly
- Restart/redeploy after adding variables
- Check platform-specific syntax

**API calls failing in production:**
- Verify CORS configuration
- Check API key validity
- Review server logs/function logs

### Getting Help
- **Vercel**: Check function logs in dashboard
- **Netlify**: Review function logs and site deploy logs
- **All platforms**: Use browser developer tools to debug

---

## 🎉 Success!

Your chatbot is now deployed and accessible worldwide! 

**Next steps:**
- Share your chatbot URL
- Set up custom domain (optional)
- Add analytics tracking
- Monitor usage and costs
- Scale as needed

**URLs will look like:**
- Vercel: `https://your-chatbot.vercel.app`
- Netlify: `https://your-chatbot.netlify.app` 
- Cloudflare: `https://your-chatbot.pages.dev`