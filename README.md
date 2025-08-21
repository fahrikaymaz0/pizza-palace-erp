# 👑 Pizza Krallığı

Kraliyet lezzetlerin premium adresi - Modern web teknolojileri ile geliştirilmiş profesyonel pizza sipariş platformu.

![Pizza Krallığı](https://img.shields.io/badge/Pizza-Krallığı-red?style=for-the-badge&logo=pizza)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=for-the-badge&logo=framer)

## 🚀 Özellikler

### 👑 Kraliyet Tasarım
- **Premium Krallık Teması**: Altın, mor ve kırmızı renk paleti
- **Animasyonlu Parallax Sahne**: Framer Motion ile gelişmiş animasyonlar
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Glassmorphism Efektleri**: Modern cam efektli arayüz

### 🍕 Menü Sistemi
- **Kategorize Edilmiş Pizzalar**: Kraliyet, İmparatorluk, Majeste kategorileri
- **Detaylı Ürün Bilgileri**: Malzemeler, kalori, hazırlama süresi
- **Arama ve Filtreleme**: Gelişmiş arama ve sıralama özellikleri
- **Favori Sistemi**: Kullanıcıların favori pizzalarını kaydetmesi

### 🛒 Sepet ve Sipariş
- **Dinamik Sepet**: Gerçek zamanlı sepet yönetimi
- **Miktar Kontrolü**: Artırma/azaltma işlemleri
- **Toplam Hesaplama**: Otomatik fiyat hesaplama
- **Sipariş Tamamlama**: Güvenli ödeme süreci

### 👤 Kullanıcı Sistemi
- **Kayıt ve Giriş**: Güvenli kullanıcı kimlik doğrulama
- **Profil Yönetimi**: Kullanıcı bilgileri ve adres yönetimi
- **Sipariş Geçmişi**: Önceki siparişlerin takibi
- **Favori Listesi**: Kişiselleştirilmiş favori ürünler

## 🛠️ Teknolojiler

### Frontend
- **Next.js 14**: React framework
- **React 18**: Modern React özellikleri
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animasyon kütüphanesi
- **Lucide React**: Modern ikonlar

### Backend & Veritabanı
- **Next.js API Routes**: Backend API
- **SQLite**: Hafif veritabanı
- **Prisma**: ORM
- **JWT**: Kimlik doğrulama
- **bcryptjs**: Şifre hashleme

### Deployment & Hosting
- **Vercel**: Otomatik deployment
- **GitHub**: Versiyon kontrolü
- **Sharp**: Görsel optimizasyonu

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm 9+

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/your-username/pizza-kralligi.git
cd pizza-kralligi
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🚀 Deployment

### Vercel ile Deployment

1. **Vercel CLI'yi yükleyin**
```bash
npm i -g vercel
```

2. **Projeyi deploy edin**
```bash
vercel --prod
```

### Manuel Deployment

1. **Production build oluşturun**
```bash
npm run build
```

2. **Sunucuyu başlatın**
```bash
npm start
```

## 📁 Proje Yapısı

```
pizza-kralligi/
├── components/          # React bileşenleri
│   ├── RoyalParallaxScene.tsx
│   └── ...
├── pages/              # Next.js sayfaları
│   ├── index.js        # Ana sayfa
│   ├── menu.js         # Menü sayfası
│   ├── login.js        # Giriş sayfası
│   ├── register.js     # Kayıt sayfası
│   └── api/            # API routes
├── public/             # Statik dosyalar
│   ├── pizzas/         # Pizza görselleri
│   └── ...
├── styles/             # CSS dosyaları
│   └── globals.css     # Global stiller
├── lib/                # Yardımcı fonksiyonlar
├── tailwind.config.js  # Tailwind konfigürasyonu
├── next.config.js      # Next.js konfigürasyonu
└── package.json        # Proje bağımlılıkları
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Altın**: `#d4af37` - Kraliyet vurguları
- **Mor**: `#581c87` - Premium arka planlar
- **Kırmızı**: `#7f1d1d` - Aksiyon butonları
- **Beyaz**: `#ffffff` - Metin ve arka planlar

### Tipografi
- **Başlıklar**: Playfair Display (Serif)
- **Gövde**: Inter (Sans-serif)

### Animasyonlar
- **Fade In**: Sayfa yüklenme animasyonları
- **Slide**: Menü geçişleri
- **Scale**: Hover efektleri
- **Parallax**: Arka plan hareketleri

## 🔧 Konfigürasyon

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Tailwind CSS
Özel renkler ve animasyonlar `tailwind.config.js` dosyasında tanımlanmıştır.

## 📱 Responsive Tasarım

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

## 🚀 Performans

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Otomatik kod bölme
- **Lazy Loading**: Görsel ve bileşen lazy loading
- **Bundle Analysis**: `npm run analyze`

## 🔒 Güvenlik

- **JWT Authentication**: Güvenli kimlik doğrulama
- **Password Hashing**: bcryptjs ile şifre hashleme
- **CORS Protection**: API güvenliği
- **Input Validation**: Form doğrulama

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Website**: [pizza-kralligi.vercel.app](https://pizza-kralligi.vercel.app)
- **Email**: info@pizzakralligi.com
- **GitHub**: [@your-username](https://github.com/your-username)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animasyon kütüphanesi
- [Lucide](https://lucide.dev/) - İkon kütüphanesi
- [Vercel](https://vercel.com/) - Hosting platformu

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
