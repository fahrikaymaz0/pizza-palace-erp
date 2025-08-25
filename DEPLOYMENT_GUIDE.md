# 🚀 Pizza Krallığı - Vercel Deployment Rehberi

Bu rehber, Pizza Krallığı projesini Vercel'de yayınlamak için adım adım talimatları içerir.

## 📋 Ön Gereksinimler

- GitHub hesabı
- Vercel hesabı (ücretsiz)
- Node.js 18+ yüklü

## 🔧 Adım Adım Deployment

### 1. GitHub'a Yükleme

```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit: Pizza Krallığı"

# GitHub'da yeni repository oluştur ve push et
git remote add origin https://github.com/your-username/pizza-kralligi.git
git branch -M main
git push -u origin main
```

### 2. Vercel'e Bağlama

1. [Vercel.com](https://vercel.com) adresine git
2. GitHub ile giriş yap
3. "New Project" butonuna tıkla
4. GitHub repository'ni seç
5. Proje ayarlarını kontrol et:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (varsayılan)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Environment Variables (Opsiyonel)

Eğer veritabanı kullanıyorsan:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 4. Deploy Et

"Deploy" butonuna tıkla ve bekle. İlk deployment 2-3 dakika sürebilir.

## 🎯 Otomatik Deployment

Her `main` branch'e push yaptığında otomatik olarak deploy edilecek.

## 📱 Domain Ayarları

### Özel Domain (Opsiyonel)

1. Vercel Dashboard'da projene git
2. "Settings" > "Domains"
3. Domain'ini ekle ve DNS ayarlarını yap

### Vercel Subdomain

Varsayılan olarak `pizza-kralligi.vercel.app` gibi bir URL alacaksın.

## 🔍 Deployment Kontrolü

### Build Logları

Vercel Dashboard'da:
- "Deployments" sekmesi
- Her deployment'ın detayları
- Build logları ve hatalar

### Canlı Site

Deployment tamamlandıktan sonra:
- "Visit" butonuna tıkla
- Siteyi test et
- Tüm sayfaları kontrol et

## 🛠️ Sorun Giderme

### Build Hataları

```bash
# Lokalde test et
npm run build
npm run dev
```

### Environment Variables

- Vercel Dashboard > Settings > Environment Variables
- Production ve Preview için ayrı ayrı ayarla

### Performance

- Vercel Analytics'i etkinleştir
- Core Web Vitals'ı takip et
- Image optimization'ı kontrol et

## 📊 Monitoring

### Vercel Analytics

1. Dashboard > Analytics
2. Performance metrikleri
3. Error tracking

### Uptime Monitoring

- Vercel Status Page
- Third-party monitoring (UptimeRobot, Pingdom)

## 🔄 Güncellemeler

### Yeni Deployment

```bash
git add .
git commit -m "Update: new features"
git push origin main
```

### Rollback

Vercel Dashboard'da:
- Deployments > Previous version
- "Redeploy" butonuna tıkla

## 📈 Performance Optimizasyonu

### Build Optimizasyonu

```bash
# Bundle analyzer
npm run analyze
```

### Image Optimization

- Next.js Image component kullan
- WebP format desteği
- Lazy loading

### Code Splitting

- Dynamic imports
- Route-based splitting
- Component lazy loading

## 🔒 Güvenlik

### HTTPS

Vercel otomatik olarak SSL sertifikası sağlar.

### Headers

`vercel.json` dosyasında güvenlik header'ları:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 📞 Destek

### Vercel Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Proje Issues

- GitHub Issues kullan
- Detaylı hata açıklaması
- Screenshot'lar ekle

## 🎉 Başarı!

Deployment tamamlandıktan sonra:

1. ✅ Site çalışıyor mu?
2. ✅ Tüm sayfalar yükleniyor mu?
3. ✅ Responsive tasarım çalışıyor mu?
4. ✅ Formlar çalışıyor mu?
5. ✅ SEO meta tag'leri var mı?

---

**Pizza Krallığı artık canlıda! 👑🍕**

URL: `https://your-project.vercel.app`


