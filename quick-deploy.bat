@echo off
chcp 65001 >nul

echo 🍕 Pizza Palace - Hızlı GitHub Deployment
echo ==========================================

echo 📋 Adım 1: Git kurulumu kontrol ediliyor...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git yüklü değil!
    echo 📥 Git'i indirin: https://git-scm.com/download/win
    echo 🔄 Kurulumdan sonra bu scripti tekrar çalıştırın
    echo.
    echo 💡 Alternatif: Manuel olarak şu komutları çalıştırın:
    echo git init
    echo git add .
    echo git commit -m "Initial commit: Pizza Palace ERP System"
    echo git remote add origin https://github.com/fahrikaymaz0/pizza-palace-erp.git
    echo git branch -M main
    echo git push -u origin main
    pause
    exit /b 1
)

echo ✅ Git kurulu

echo 📋 Adım 2: Git konfigürasyonu yapılıyor...
git config --global user.email "fahrikaymaz0@gmail.com"
git config --global user.name "fahrikaymaz0"

echo 📋 Adım 3: Git repository başlatılıyor...
if not exist ".git" (
    git init
)

echo 📋 Adım 4: Dosyalar ekleniyor...
git add .

echo 📋 Adım 5: Commit oluşturuluyor...
git commit -m "Initial commit: Pizza Palace ERP System"

echo 📋 Adım 6: Remote repository ekleniyor...
git remote remove origin 2>nul
git remote add origin https://github.com/fahrikaymaz0/pizza-palace-erp.git

echo 📋 Adım 7: GitHub'a yükleniyor...
git branch -M main
git push -u origin main

echo ✅ Başarıyla GitHub'a yüklendi!
echo.
echo 🌐 Vercel ile deploy etmek için:
echo 1. https://vercel.com adresine gidin
echo 2. GitHub hesabınızla giriş yapın
echo 3. "New Project" butonuna tıklayın
echo 4. Repository'nizi seçin: fahrikaymaz0/pizza-palace-erp
echo 5. Deploy edin!
echo.
echo 📊 Repository URL: https://github.com/fahrikaymaz0/pizza-palace-erp
echo.
pause
