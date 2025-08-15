@echo off
chcp 65001 >nul

echo 🍕 Pizza Palace - GitHub Deployment Script
echo ==========================================

REM Kontroller
echo 🔍 Kontroller yapılıyor...

REM Git kontrolü
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git yüklü değil!
    pause
    exit /b 1
)

REM Node.js kontrolü
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js yüklü değil!
    pause
    exit /b 1
)

REM npm kontrolü
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm yüklü değil!
    pause
    exit /b 1
)

echo ✅ Tüm gereksinimler mevcut

REM Git repository kontrolü
if not exist ".git" (
    echo ⚠️  Git repository başlatılıyor...
    git init
)

REM Bağımlılıkları yükle
echo 📦 Bağımlılıklar yükleniyor...
call npm install

REM Linting ve test
echo 🔍 Kod kalitesi kontrol ediliyor...
call npm run lint
call npm run type-check

REM Build
echo 🏗️  Proje build ediliyor...
call npm run build

REM Git durumunu kontrol et
echo 📊 Git durumu kontrol ediliyor...
git status

REM Değişiklikleri ekle
echo 📝 Değişiklikler ekleniyor...
git add .

REM Commit mesajı
echo 💾 Commit oluşturuluyor...
set /p commit_message="Commit mesajı girin (varsayılan: 'Update Pizza Palace'): "
if "%commit_message%"=="" set commit_message=Update Pizza Palace
git commit -m "%commit_message%"

REM Remote repository kontrolü
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Remote repository ayarlanıyor...
    set /p repo_url="GitHub repository URL'ini girin: "
    git remote add origin "%repo_url%"
)

REM Branch kontrolü
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo 🌿 Mevcut branch: %current_branch%

REM Push
echo 🚀 GitHub'a yükleniyor...
if "%current_branch%"=="main" (
    git push -u origin main
) else (
    git push -u origin %current_branch%
)

echo ✅ Başarıyla GitHub'a yüklendi!
echo 📋 Sonraki adımlar:
echo 1. GitHub repository'nizi kontrol edin
echo 2. Vercel ile deploy edin (opsiyonel)
echo 3. GitHub Actions workflow'unu kontrol edin
echo 4. README.md dosyasını güncelleyin

echo 💡 Vercel ile otomatik deployment için:
echo 1. https://vercel.com adresine gidin
echo 2. GitHub hesabınızla giriş yapın
echo 3. 'New Project' butonuna tıklayın
echo 4. Repository'nizi seçin
echo 5. Deploy edin!

echo 🎉 İşlem tamamlandı!
pause



