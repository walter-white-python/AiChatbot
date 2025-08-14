#!/bin/bash

# 🚀 Quick Deploy Script for AI Chatbot
# This script helps you deploy your chatbot to various platforms

set -e  # Exit on any error

echo "🤖 AI Chatbot Deployment Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the chatbot directory."
    exit 1
fi

# Check for required tools
command -v bun >/dev/null 2>&1 || { echo "❌ Error: bun is required but not installed. Please install bun first."; exit 1; }

echo "✅ Environment check passed"

# Build the project
echo "🔨 Building the project..."
bun install
bun run build

if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. No dist directory found."
    exit 1
fi

echo "✅ Build completed successfully"

# Ask user which platform to deploy to
echo ""
echo "🚀 Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Cloudflare Pages"
echo "4) Just build (no deployment)"
echo "5) Show deployment URLs"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🔵 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🚀 Deploying to Vercel (this may take a few minutes)..."
        vercel --prod
        
        echo ""
        echo "🎉 Deployment completed!"
        echo "📝 Next steps:"
        echo "   1. Add environment variables in Vercel dashboard if needed:"
        echo "      OPENAI_API_KEY=your-key-here"
        echo "   2. Your chatbot should be live at the URL shown above"
        echo "   3. Test the deployment by visiting the URL"
        ;;
        
    2)
        echo "🟢 Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        
        echo ""
        echo "🎉 Deployment completed!"
        echo "📝 Next steps:"
        echo "   1. Add environment variables in Netlify dashboard if needed"
        echo "   2. Your chatbot should be live at the URL shown above"
        ;;
        
    3)
        echo "🟠 Preparing for Cloudflare Pages..."
        echo ""
        echo "📋 Manual deployment steps for Cloudflare Pages:"
        echo "   1. Go to https://dash.cloudflare.com"
        echo "   2. Navigate to Pages → Create application"
        echo "   3. Upload the 'dist' folder"
        echo "   4. Add environment variables if needed:"
        echo "      OPENAI_API_KEY=your-key-here"
        echo ""
        echo "✅ Build files are ready in the 'dist' directory"
        ;;
        
    4)
        echo "✅ Build completed! Files are ready in the 'dist' directory"
        echo ""
        echo "📁 You can now deploy the 'dist' folder to any static hosting service:"
        echo "   • GitHub Pages"
        echo "   • Firebase Hosting"
        echo "   • AWS S3"
        echo "   • Any web server"
        ;;
        
    5)
        echo ""
        echo "🔗 Deployment Platform URLs:"
        echo "   • Vercel: https://vercel.com/new"
        echo "   • Netlify: https://app.netlify.com/drop"
        echo "   • Cloudflare Pages: https://dash.cloudflare.com"
        echo "   • Firebase: https://firebase.google.com/products/hosting"
        echo "   • GitHub Pages: https://pages.github.com"
        echo ""
        echo "📖 See DEPLOYMENT.md for detailed instructions"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Deployment Tips:"
echo "   • Test your chatbot after deployment"
echo "   • Add API keys in your platform's environment variables"
echo "   • Check EMBEDDING.md to integrate into your website"
echo "   • Monitor usage and costs if using paid AI APIs"

echo ""
echo "🎉 All done! Your AI chatbot is ready to use!"