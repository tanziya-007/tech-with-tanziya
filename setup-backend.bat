@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo   TechWithTanziya Backend Setup
echo ==========================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo Creating .env file...
    copy backend\.env.example backend\.env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo Choose MongoDB option:
echo 1. MongoDB Atlas (Cloud - Recommended)
echo 2. Local MongoDB
echo 3. Skip for now
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo MongoDB Atlas Setup:
    echo 1. Go to https://www.mongodb.com/cloud/atlas
    echo 2. Create free cluster
    echo 3. Create database user
    echo 4. Get connection string
    echo 5. Copy connection string
    echo.
    set /p mongodb_uri="Paste your MongoDB connection string: "
    
    REM Update .env file
    (
        echo MONGODB_URI=!mongodb_uri!
        echo PORT=5000
        echo CORS_ORIGIN=http://localhost:3000
        echo NODE_ENV=development
    ) > backend\.env
    echo ✅ MongoDB URI updated in .env
) else if "%choice%"=="2" (
    echo.
    echo Local MongoDB Setup:
    echo Make sure MongoDB is installed and running
    echo Default connection: mongodb://localhost:27017/tech-with-tanziya
    echo.
    (
        echo MONGODB_URI=mongodb://localhost:27017/tech-with-tanziya
        echo PORT=5000
        echo CORS_ORIGIN=http://localhost:3000
        echo NODE_ENV=development
    ) > backend\.env
    echo ✅ Local MongoDB URI set in .env
) else if "%choice%"=="3" (
    echo Skipping MongoDB setup
    echo You can configure it later in backend\.env
) else (
    echo Invalid choice
    exit /b 1
)

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. cd backend
echo 2. npm run dev
echo.
echo Check backend\.env for configuration
echo.
pause