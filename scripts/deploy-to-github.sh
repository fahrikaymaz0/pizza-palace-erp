#!/bin/bash

# Pizza Palace - GitHub Deployment Script
# Bu script projeyi GitHub'a yüklemek için kullanılır

set -e

echo "🍕 Pizza Palace - GitHub Deployment Script"
echo "=========================================="

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Kontroller
echo -e "${BLUE}🔍 Kontroller yapılıyor...${NC}"

# Git kontrolü
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git yüklü değil!${NC}"
    exit 1
fi

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js yüklü değil!${NC}"
    exit 1
fi

# npm kontrolü
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm yüklü değil!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tüm gereksinimler mevcut${NC}"

# Mevcut durumu kontrol et
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository başlatılıyor...${NC}"
    git init
fi

# Bağımlılıkları yükle
echo -e "${BLUE}📦 Bağımlılıklar yükleniyor...${NC}"
npm install

# Linting ve test
echo -e "${BLUE}🔍 Kod kalitesi kontrol ediliyor...${NC}"
npm run lint
npm run type-check

# Build
echo -e "${BLUE}🏗️  Proje build ediliyor...${NC}"
npm run build

# Git durumunu kontrol et
echo -e "${BLUE}📊 Git durumu kontrol ediliyor...${NC}"
git status

# Değişiklikleri ekle
echo -e "${BLUE}📝 Değişiklikler ekleniyor...${NC}"
git add .

# Commit mesajı
echo -e "${BLUE}💾 Commit oluşturuluyor...${NC}"
read -p "Commit mesajı girin (varsayılan: 'Update Pizza Palace'): " commit_message
commit_message=${commit_message:-"Update Pizza Palace"}
git commit -m "$commit_message"

# Remote repository kontrolü
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  Remote repository ayarlanıyor...${NC}"
    read -p "GitHub repository URL'ini girin: " repo_url
    git remote add origin "$repo_url"
fi

# Branch kontrolü
current_branch=$(git branch --show-current)
echo -e "${BLUE}🌿 Mevcut branch: $current_branch${NC}"

# Push
echo -e "${BLUE}🚀 GitHub'a yükleniyor...${NC}"
if [ "$current_branch" = "main" ]; then
    git push -u origin main
else
    git push -u origin "$current_branch"
fi

echo -e "${GREEN}✅ Başarıyla GitHub'a yüklendi!${NC}"
echo -e "${BLUE}📋 Sonraki adımlar:${NC}"
echo -e "1. GitHub repository'nizi kontrol edin"
echo -e "2. Vercel ile deploy edin (opsiyonel)"
echo -e "3. GitHub Actions workflow'unu kontrol edin"
echo -e "4. README.md dosyasını güncelleyin"

# Vercel deployment önerisi
echo -e "${YELLOW}💡 Vercel ile otomatik deployment için:${NC}"
echo -e "1. https://vercel.com adresine gidin"
echo -e "2. GitHub hesabınızla giriş yapın"
echo -e "3. 'New Project' butonuna tıklayın"
echo -e "4. Repository'nizi seçin"
echo -e "5. Deploy edin!"

echo -e "${GREEN}🎉 İşlem tamamlandı!${NC}"

