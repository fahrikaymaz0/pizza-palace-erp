@echo off
echo 🚀 FRESH PIZZA PALACE DEPLOYMENT...
echo.

echo 🧹 Tüm cache temizleniyor...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".vercel" rmdir /s /q ".vercel"
if exist ".git\objects" rmdir /s /q ".git\objects"

echo 📦 Fresh dependencies yükleniyor...
npm install

echo 🔧 Fresh build oluşturuluyor...
npm run build

echo 📦 Git'e ekleniyor...
git add .

echo 💾 Fresh commit oluşturuluyor...
git commit -m "🚀 FRESH SYSTEM - Version 3.0.0 - No Cache Issues"

echo 🚀 GitHub'a push ediliyor...
git push

echo.
echo ✅ FRESH SYSTEM DEPLOYED!
echo 🌐 https://pizza-palace-erp-qc8j.vercel.app/
echo.
echo 🎯 FRESH FEATURES:
echo ✅ Version 3.0.0
echo ✅ No Cache Issues
echo ✅ Fresh Build ID
echo ✅ Working APIs
echo ✅ Modern UI
echo.
echo ⏳ 15-20 dakika bekleyin...
echo 🔄 Browser cache'i temizleyin
echo 🧪 Test: /api/test
pause 