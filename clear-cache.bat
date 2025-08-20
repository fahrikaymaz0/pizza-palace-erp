@echo off
echo 🧹 CACHE TEMİZLEME BAŞLIYOR...
echo.

echo 📁 .next klasörü siliniyor...
if exist ".next" rmdir /s /q ".next"

echo 📁 node_modules siliniyor...
if exist "node_modules" rmdir /s /q "node_modules"

echo 📁 .vercel klasörü siliniyor...
if exist ".vercel" rmdir /s /q ".vercel"

echo 📁 .git/objects siliniyor...
if exist ".git\objects" rmdir /s /q ".git\objects"

echo 📦 Dependencies yeniden yükleniyor...
npm install

echo 🔧 Build oluşturuluyor...
npm run build

echo 📦 Git'e ekleniyor...
git add .

echo 💾 Commit oluşturuluyor...
git commit -m "🧹 CACHE TEMİZLENDİ - Fresh Build"

echo 🚀 GitHub'a push ediliyor...
git push

echo.
echo ✅ CACHE TEMİZLENDİ!
echo 🌐 https://pizza-palace-erp-qc8j.vercel.app/
echo.
echo ⏳ 10-15 dakika bekleyin...
echo 🔄 Browser cache'i de temizleyin (Ctrl+Shift+Delete)
pause 