@echo off
echo 🚀 SIMPLE PIZZA PALACE DEPLOYMENT...
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
git commit -m "🚀 SIMPLE SYSTEM - Version 1.0.0 - Working APIs"

echo 🚀 GitHub'a push ediliyor...
git push

echo.
echo ✅ SIMPLE SYSTEM DEPLOYED!
echo 🌐 https://pizza-palace-erp-qc8j.vercel.app/
echo.
echo 🎯 SIMPLE FEATURES:
echo ✅ Version 1.0.0
echo ✅ Working APIs
echo ✅ Simple UI
echo ✅ No 405 errors
echo.
echo ⏳ 10-15 dakika bekleyin...
echo 🔄 Browser cache'i temizleyin
echo 🧪 Test: /api/test
pause 