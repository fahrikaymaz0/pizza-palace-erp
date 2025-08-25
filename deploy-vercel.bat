@echo off
echo ========================================
echo    Pizza Kralligi - Vercel Deployment
echo ========================================
echo.

echo [1/5] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo [2/5] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [3/5] Building project...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Installing Vercel CLI...
npm install -g vercel
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Vercel CLI!
    pause
    exit /b 1
)

echo.
echo [5/5] Deploying to Vercel...
vercel --prod --yes
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Deployment completed successfully!
echo ========================================
echo.
echo Your Pizza Kralligi is now live on Vercel!
echo.
pause


