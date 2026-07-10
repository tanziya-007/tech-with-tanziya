@echo off
echo ============================================
echo   TechWithTanziya Deployment Assistant
echo ============================================
echo.

echo Step 1: Checking Git status...
if not exist ".git" (
    echo Git not initialized. Initializing...
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)

echo.
echo Step 2: Testing frontend build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed. Please fix errors first.
    pause
    exit /b 1
)
echo ✅ Frontend build successful

echo.
echo Step 3: Checking backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed.
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

echo.
echo ============================================
echo   DEPLOYMENT READY!
echo ============================================
echo.
echo Your project is ready for deployment.
echo.
echo Next steps:
echo 1. Create GitHub repository at https://github.com/new
echo 2. Push your code:
echo    git remote add origin https://github.com/YOUR_USERNAME/tech-with-tanziya.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy backend on Railway:
echo    - Go to https://railway.app
echo    - Sign up with GitHub
echo    - New Project -> Deploy from GitHub repo
echo    - Select "backend" folder
echo.
echo 4. Deploy frontend on Vercel:
echo    - Go to https://vercel.com
echo    - Sign up with GitHub
echo    - Import Project -> Select your repo
echo    - Configure as Next.js project
echo.
echo 5. Set up MongoDB Atlas (free):
echo    - Go to https://mongodb.com/cloud/atlas
echo    - Create free cluster
echo    - Get connection string
echo.
echo Detailed instructions in QUICK_DEPLOY.md
echo.
pause