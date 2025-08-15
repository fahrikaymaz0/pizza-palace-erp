@echo off
echo 🚀 COMPLETE SYSTEM DEPLOYMENT TO VERCEL...
echo.

echo 📦 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "🎯 COMPLETE SYSTEM - Users can register, order, admin can view all"

echo 🚀 Pushing to GitHub...
git push

echo.
echo ✅ Complete System Deployment started!
echo 🌐 Frontend: https://pizza-palace-erp-qc8j.vercel.app/
echo 🔗 Backend: http://localhost:3001/api
echo.
echo 🎯 SYSTEM FLOW:
echo 1. Kullanıcılar Vercel'de web sitesine girer
echo 2. Kayıt olur veya giriş yapar
echo 3. Pizza seçer ve sipariş verir
echo 4. Admin localhost'ta tüm siparişleri görür
echo.
echo 🔍 Test URLs:
echo 1. Ana Sayfa: https://pizza-palace-erp-qc8j.vercel.app/
echo 2. Kayıt: https://pizza-palace-erp-qc8j.vercel.app/register
echo 3. Giriş: https://pizza-palace-erp-qc8j.vercel.app/login
echo 4. Pizza Menü: https://pizza-palace-erp-qc8j.vercel.app/pizza
echo 5. Admin: https://pizza-palace-erp-qc8j.vercel.app/admin/login
echo.
echo ⏳ Wait 3-5 minutes for deployment to complete...
echo 🎯 COMPLETE SYSTEM - Professional Pizza ERP!
pause 