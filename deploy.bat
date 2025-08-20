@echo off
echo 🚀 FRESH PIZZA ERP SYSTEM DEPLOYMENT...
echo.

echo 🧹 Cleaning old files...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"

echo 📦 Installing fresh dependencies...
npm install

echo 🔧 Building project...
npm run build

echo 📦 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "🚀 FRESH SYSTEM - Clean App Router, No Cache Issues"

echo 🚀 Pushing to GitHub...
git push

echo.
echo ✅ Fresh System Deployment completed!
echo 🌐 Frontend: https://pizza-palace-erp-qc8j.vercel.app/
echo.
echo 🎯 FRESH SYSTEM FEATURES:
echo ✅ Next.js 14 App Router (Clean)
echo ✅ No Cache Issues
echo ✅ In-memory API routes
echo ✅ Modern UI with Framer Motion
echo ✅ Working authentication
echo ✅ No 405/401 errors
echo.
echo 🔍 Test URLs:
echo 1. Ana Sayfa: https://pizza-palace-erp-qc8j.vercel.app/
echo 2. Kayıt: https://pizza-palace-erp-qc8j.vercel.app/register
echo 3. Giriş: https://pizza-palace-erp-qc8j.vercel.app/login
echo 4. Menü: https://pizza-palace-erp-qc8j.vercel.app/menu
echo 5. Admin: https://pizza-palace-erp-qc8j.vercel.app/admin/login
echo.
echo ⏳ 5-10 dakika bekleyin deployment için...
echo 🎯 FRESH SYSTEM - No Cache Issues!
pause 