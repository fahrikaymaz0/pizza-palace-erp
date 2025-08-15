@echo off
echo 🚀 FULL PAGES ROUTER DEPLOYMENT TO VERCEL...
echo.

echo 📦 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "🔄 FULL PAGES ROUTER - Disabled App Router, created Pages Router admin page"

echo 🚀 Pushing to GitHub...
git push

echo.
echo ✅ Full Pages Router Deployment started!
echo 🌐 Check: https://pizza-palace-erp-qc8j.vercel.app/admin/login
echo.
echo 🔍 Test Steps:
echo 1. Health API butonuna tıklayın (Pages Router)
echo 2. Admin API butonuna tıklayın (Pages Router)
echo 3. Debug bilgilerini kontrol edin
echo.
echo ⏳ Wait 2-3 minutes for deployment to complete...
echo 🔄 This should completely fix the 405 Method Not Allowed error
pause 