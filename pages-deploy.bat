@echo off
echo 🚀 PAGES ROUTER PIZZA PALACE DEPLOYMENT...
echo.

echo 🧹 Cache temizleniyor...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"

echo 📦 Dependencies yükleniyor...
npm install

echo 🔧 Build oluşturuluyor...
npm run build

echo 📦 Git'e ekleniyor...
git add .

echo 💾 Commit oluşturuluyor...
git commit -m "🚀 PAGES ROUTER - Version 1.0.0 - No 405 Errors"

echo 🚀 GitHub'a push ediliyor...
git push

echo.
echo ✅ PAGES ROUTER SYSTEM DEPLOYED!
echo 🌐 https://pizza-palace-erp-qc8j.vercel.app/
echo.
echo 🎯 PAGES ROUTER FEATURES:
echo ✅ Version 1.0.0
echo ✅ Pages Router (No App Router)
echo ✅ Working APIs
echo ✅ No 405 errors
echo ✅ Simple UI
echo.
echo ⏳ 10-15 dakika bekleyin...
echo 🔄 Browser cache'i temizleyin
echo 🧪 Test: /api/test
pause 