# 🔗 Simple Backend Sistem Kurulum Rehberi

Bu sistem **Frontend Vercel'de, Backend Localhost'ta** çalışır. **SQLite3 gerektirmez!**

## 🎯 Sistem Mimarisi

- **Frontend:** https://pizza-palace-erp-qc8j.vercel.app/
- **Backend:** http://localhost:3001/api
- **Veritabanı:** In-memory (RAM'de)

## 🚀 Kurulum Adımları

### 1. Dependencies Yükleme

```bash
npm install
```

### 2. Backend Başlatma

```bash
# Sadece backend
npm run backend

# VEYA tam sistem (backend + frontend)
npm run dev:full
```

### 3. Frontend Erişimi

- **Ana Sayfa:** https://pizza-palace-erp-qc8j.vercel.app/
- **Admin Login:** https://pizza-palace-erp-qc8j.vercel.app/admin/login
- **Pizza Menü:** https://pizza-palace-erp-qc8j.vercel.app/pizza

## 🔐 Test Hesapları

- **Admin:** admin@123 / 123456
- **Pizza Admin:** pizzapalaceofficial00@gmail.com / 123456
- **Test User:** test@example.com / 123456

## 📊 Sistem Özellikleri

### ✅ Çalışan Özellikler

- ✅ **Frontend:** Vercel'de yayınlanıyor
- ✅ **Backend:** Localhost'ta çalışıyor
- ✅ **Veritabanı:** In-memory (SQLite3 gerektirmez)
- ✅ **Admin Login:** Localhost backend'e bağlanıyor
- ✅ **Pizza Menü:** Backend'den veri çekiyor
- ✅ **Siparişler:** RAM'de kaydediliyor
- ✅ **Admin Dashboard:** Gerçek veriler gösteriyor

### 🔧 API Endpoints

- `GET /api/health` - Sağlık kontrolü
- `POST /api/auth/admin-login` - Admin girişi
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/pizza/menu` - Pizza menüsü
- `POST /api/pizza/orders` - Sipariş oluşturma
- `GET /api/admin/orders` - Admin sipariş listesi
- `GET /api/admin/users` - Admin kullanıcı listesi

## 🎯 Avantajlar

1. **Frontend Yayınlı:** Vercel'de herkes erişebilir
2. **Backend Güvenli:** Sadece localhost'ta
3. **Veriler RAM'de:** SQLite3 gerektirmez
4. **Gerçek Zamanlı:** Siparişler anında kaydediliyor
5. **Admin Kontrolü:** Tüm veriler admin panelinde
6. **Basit Kurulum:** Sadece express ve cors

## 🔍 Test Etme

1. **Backend'i başlatın:** `npm run backend`
2. **Frontend'e gidin:** https://pizza-palace-erp-qc8j.vercel.app/
3. **Admin login yapın:** admin@123 / 123456
4. **Sipariş verin:** Pizza menüsünden
5. **Admin panelinde görün:** Localhost'ta

## 🚨 Önemli Notlar

- Backend çalışmazsa frontend static veri gösterir
- Tüm veriler RAM'de saklanır (server restart'ta silinir)
- Vercel'de sadece frontend yayınlanır
- Admin paneli sadece localhost'ta erişilebilir
- **SQLite3 gerektirmez** - Sadece express ve cors

## 🔧 Sorun Giderme

### Backend Başlamıyor
```bash
# Port kontrolü
netstat -ano | findstr :3001

# Dependencies kontrolü
npm install
```

### Frontend Bağlanamıyor
- Backend'in çalıştığından emin olun
- http://localhost:3001/api/health kontrol edin
- CORS ayarlarını kontrol edin

### Module Not Found Hatası
- `npm install` çalıştırın
- Sadece express ve cors gerekli
- SQLite3 gerektirmez

## 🎯 Hızlı Başlangıç

```bash
# 1. Dependencies yükle
npm install

# 2. Backend başlat
npm run backend

# 3. Frontend'e git
# https://pizza-palace-erp-qc8j.vercel.app/

# 4. Admin login
# admin@123 / 123456
``` 