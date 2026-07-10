#!/bin/bash

echo "🚀 TechWithTanziya Deployment Script"
echo "====================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
fi

echo ""
echo "📦 Step 1: Build Frontend"
echo "-------------------------"
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🔧 Step 2: Check Environment Variables"
echo "--------------------------------------"
echo "Make sure you have:"
echo "1. MongoDB Atlas connection string"
echo "2. Backend deployment URL"
echo "3. Frontend deployment URL"
echo ""
echo "Update these files:"
echo "- .env.production (frontend)"
echo "- backend/.env.production (backend)"
echo ""
read -p "Have you updated environment variables? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please update environment variables first"
    exit 1
fi

echo ""
echo "🌐 Step 3: Choose Deployment Method"
echo "-----------------------------------"
echo "1. Vercel + Railway (Recommended)"
echo "2. Render (All-in-one)"
echo "3. Manual Deployment"
echo ""
read -p "Choose option (1-3): " option

case $option in
    1)
        echo ""
        echo "📤 Deploying to Vercel + Railway..."
        echo ""
        echo "For Vercel (frontend):"
        echo "1. Go to https://vercel.com"
        echo "2. Import GitHub repository"
        echo "3. Configure with .env.production"
        echo ""
        echo "For Railway (backend):"
        echo "1. Go to https://railway.app"
        echo "2. New Project → Deploy from GitHub"
        echo "3. Select backend folder"
        echo "4. Add environment variables"
        ;;
    2)
        echo ""
        echo "📤 Deploying to Render..."
        echo ""
        echo "1. Go to https://render.com"
        echo "2. New Web Service"
        echo "3. Connect GitHub repository"
        echo "4. Set root directory to 'backend'"
        echo "5. Add environment variables"
        echo ""
        echo "For frontend:"
        echo "1. New Static Site"
        echo "2. Connect same repository"
        echo "3. Set root directory to '.'"
        echo "4. Build command: npm run build"
        echo "5. Publish directory: .next"
        ;;
    3)
        echo ""
        echo "🛠 Manual Deployment Steps:"
        echo ""
        echo "Frontend:"
        echo "1. Build: npm run build"
        echo "2. Deploy .next folder to hosting"
        echo ""
        echo "Backend:"
        echo "1. Install dependencies: cd backend && npm install"
        echo "2. Start server: node server.js"
        echo "3. Use PM2 for production: pm2 start server.js"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment instructions ready!"
echo ""
echo "📝 Next Steps:"
echo "1. Deploy backend first"
echo "2. Get backend URL"
echo "3. Update frontend .env.production"
echo "4. Deploy frontend"
echo "5. Update backend CORS_ORIGIN"
echo "6. Test complete application"
echo ""
echo "🔗 Useful Links:"
echo "- Vercel: https://vercel.com"
echo "- Railway: https://railway.app"
echo "- Render: https://render.com"
echo "- MongoDB Atlas: https://mongodb.com/cloud/atlas"
echo ""
echo "🎉 Good luck with your deployment!"