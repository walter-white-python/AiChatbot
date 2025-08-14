@echo off
setlocal enabledelayedexpansion

REM 🚀 Quick Deploy Script for AI Chatbot (Windows)
REM This script helps you deploy your chatbot to various platforms

echo 🤖 AI Chatbot Deployment Script
echo =================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the chatbot directory.
    pause
    exit /b 1
)

REM Check for required tools
where bun >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: bun is required but not installed. Please install bun first.
    pause
    exit /b 1
)

echo ✅ Environment check passed

REM Build the project
echo 🔨 Building the project...
call bun install
call bun run build

if not exist "dist" (
    echo ❌ Error: Build failed. No dist directory found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Ask user which platform to deploy to
echo.
echo 🚀 Choose deployment platform:
echo 1^) Vercel ^(Recommended^)
echo 2^) Netlify
echo 3^) Cloudflare Pages
echo 4^) Just build ^(no deployment^)
echo 5^) Show deployment URLs

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto cloudflare
if "%choice%"=="4" goto build_only
if "%choice%"=="5" goto show_urls
goto invalid

:vercel
echo 🔵 Deploying to Vercel...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
)

echo 🚀 Deploying to Vercel ^(this may take a few minutes^)...
call vercel --prod

echo.
echo 🎉 Deployment completed!
echo 📝 Next steps:
echo    1. Add environment variables in Vercel dashboard if needed:
echo       OPENAI_API_KEY=your-key-here
echo    2. Your chatbot should be live at the URL shown above
echo    3. Test the deployment by visiting the URL
goto end

:netlify
echo 🟢 Deploying to Netlify...

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Netlify CLI...
    call npm install -g netlify-cli
)

echo 🚀 Deploying to Netlify...
call netlify deploy --prod --dir=dist

echo.
echo 🎉 Deployment completed!
echo 📝 Next steps:
echo    1. Add environment variables in Netlify dashboard if needed
echo    2. Your chatbot should be live at the URL shown above
goto end

:cloudflare
echo 🟠 Preparing for Cloudflare Pages...
echo.
echo 📋 Manual deployment steps for Cloudflare Pages:
echo    1. Go to https://dash.cloudflare.com
echo    2. Navigate to Pages → Create application
echo    3. Upload the 'dist' folder
echo    4. Add environment variables if needed:
echo       OPENAI_API_KEY=your-key-here
echo.
echo ✅ Build files are ready in the 'dist' directory
goto end

:build_only
echo ✅ Build completed! Files are ready in the 'dist' directory
echo.
echo 📁 You can now deploy the 'dist' folder to any static hosting service:
echo    • GitHub Pages
echo    • Firebase Hosting
echo    • AWS S3
echo    • Any web server
goto end

:show_urls
echo.
echo 🔗 Deployment Platform URLs:
echo    • Vercel: https://vercel.com/new
echo    • Netlify: https://app.netlify.com/drop
echo    • Cloudflare Pages: https://dash.cloudflare.com
echo    • Firebase: https://firebase.google.com/products/hosting
echo    • GitHub Pages: https://pages.github.com
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
goto end

:invalid
echo ❌ Invalid choice. Please run the script again.
pause
exit /b 1

:end
echo.
echo 🎯 Deployment Tips:
echo    • Test your chatbot after deployment
echo    • Add API keys in your platform's environment variables
echo    • Check EMBEDDING.md to integrate into your website
echo    • Monitor usage and costs if using paid AI APIs

echo.
echo 🎉 All done! Your AI chatbot is ready to use!
pause