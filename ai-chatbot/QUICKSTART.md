# 🚀 Quick Start Guide

## Immediate Usage (No Setup Required)
```bash
# 1. Install dependencies
bun install

# 2. Start development server
bun dev

# 3. Open http://localhost:5173
# Your chatbot works immediately in demo mode!
```

## 🔧 Add Real AI (Optional)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and add your API key:
# OPENAI_API_KEY=sk-your-key-here

# 3. Restart server
bun dev
```

## 🌍 Deploy to Production

### Quick Deploy (Linux/Mac)
```bash
./deploy.sh
```

### Quick Deploy (Windows)
```bash
deploy.bat
```

### Manual Deploy
```bash
# Build
bun run build

# Deploy dist/ folder to your preferred platform:
# • Vercel: drag & drop or CLI
# • Netlify: drag & drop or CLI  
# • Cloudflare Pages: upload folder
```

## 🔗 Embed in Your Website

### Simple iframe
```html
<iframe 
  src="https://your-chatbot.vercel.app" 
  width="400" 
  height="600"
  frameborder="0">
</iframe>
```

### Floating Widget
```html
<!-- Copy code from widget-example.html -->
<!-- Or see EMBEDDING.md for full instructions -->
```

## 📚 Complete Documentation
- **DEPLOYMENT.md** - Detailed deployment instructions
- **EMBEDDING.md** - Integration methods and code examples
- **SETUP.md** - API configuration guide
- **README.md** - Full feature documentation

## ⚡ One-Line Deploy Commands

### Vercel
```bash
bun run build && npx vercel --prod
```

### Netlify  
```bash
bun run build && npx netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
bun run build && gh-pages -d dist
```

## 🎯 What You Get
✅ **Modern ChatGPT-like interface**  
✅ **Works immediately (demo mode)**  
✅ **Real AI with API keys (OpenAI/Anthropic)**  
✅ **Mobile responsive**  
✅ **Dark/light themes**  
✅ **Message persistence**  
✅ **Easy embedding options**  
✅ **Production ready**  

## 🆘 Need Help?
- Demo mode shows helpful setup instructions
- Check browser console for errors
- Review documentation files
- Test with `/api/health` endpoint

🎉 **Your AI chatbot is ready in under 5 minutes!**