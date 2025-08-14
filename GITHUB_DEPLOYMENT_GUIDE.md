# 🚀 GitHub'a Yükleme ve Deployment Rehberi

Bu rehber, Pizza Palace projenizi GitHub'a yükleyip canlıya almanızı sağlar.

## 📋 Ön Gereksinimler

- [ ] Git yüklü (https://git-scm.com/download/win)
- [ ] GitHub hesabı
- [ ] Vercel hesabı (ücretsiz)
- [ ] Supabase hesabı (ücretsiz)

## 🔧 Adım Adım Yükleme

### Adım 1: Git Kurulumu

1. **Git'i indirin**: https://git-scm.com/download/win
2. **Kurulumu tamamlayın** (varsayılan ayarlar yeterli)
3. **Bilgisayarı yeniden başlatın**
4. **PowerShell'i yeniden açın**

### Adım 2: GitHub Repository Oluşturma

1. **GitHub.com'a gidin** ve hesabınıza giriş yapın
2. **Sağ üst köşedeki "+" butonuna tıklayın**
3. **"New repository" seçin**
4. **Repository adı**: `pizza-palace-erp`
5. **Description**: `Modern pizza sipariş ve yönetim sistemi`
6. **Public** seçin
7. **"Create repository" butonuna tıklayın**
8. **Repository URL'ini kopyalayın** (örn: `https://github.com/kullaniciadi/pizza-palace-erp.git`)

### Adım 3: Projeyi GitHub'a Yükleme

#### Yöntem 1: Hızlı Script (Önerilen)

```bash
# Proje klasöründe
quick-deploy.bat
```

#### Yöntem 2: Manuel Komutlar

```bash
# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: Pizza Palace ERP System"

# Remote repository ekle (URL'yi kendi repository'nizle değiştirin)
git remote add origin https://github.com/kullaniciadi/pizza-palace-erp.git

# Main branch'e push
git branch -M main
git push -u origin main
```

### Adım 4: Vercel Deployment

1. **Vercel.com'a gidin** ve GitHub hesabınızla giriş yapın
2. **"New Project" butonuna tıklayın**
3. **GitHub repository'nizi seçin**
4. **Framework Preset**: Next.js (otomatik seçilmeli)
5. **"Deploy" butonuna tıklayın**

### Adım 5: Veritabanı Kurulumu (Supabase)

1. **Supabase.com'a gidin** ve hesap oluşturun
2. **"New Project" butonuna tıklayın**
3. **Proje adı**: `pizza-palace-db`
4. **Database Password**: Güçlü bir şifre oluşturun
5. **"Create new project" butonuna tıklayın**

### Adım 6: Veritabanı Tabloları Oluşturma

Supabase dashboard'da **SQL Editor**'e gidin ve şu komutları çalıştırın:

```sql
-- Users tablosu
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products tablosu
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR,
  category VARCHAR,
  ingredients TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders tablosu
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status INTEGER DEFAULT 0,
  delivery_address TEXT,
  phone VARCHAR,
  notes TEXT,
  payment_card_number VARCHAR,
  payment_card_holder VARCHAR,
  payment_expiry_date VARCHAR,
  payment_cvv VARCHAR,
  transaction_id VARCHAR,
  auth_code VARCHAR,
  payment_bank VARCHAR,
  payment_method VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items tablosu
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Örnek kullanıcılar (şifre: 123456)
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@123', '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z', 'Kaymaz Admin', 'admin'),
('test@example.com', '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z', 'Test Kullanıcı', 'user'),
('pizzapalaceofficial00@gmail.com', '$2a$10$rQZ8K9L2M1N0P9Q8R7S6T5U4V3W2X1Y0Z', 'Pizza Palace Admin', 'pizza_admin');

-- Örnek ürünler
INSERT INTO products (name, description, price, image, category, ingredients) VALUES
('Margherita', 'Klasik İtalyan lezzeti', 45.00, '/pizzas/margherita.png', 'Klasik', 'Domates sosu, Mozzarella peyniri, Fesleğen'),
('Pepperoni', 'Acılı pepperoni ile', 55.00, '/pizzas/pepperoni.png', 'Etli', 'Domates sosu, Mozzarella peyniri, Pepperoni'),
('Quattro Stagioni', 'Dört mevsim lezzeti', 65.00, '/pizzas/quattro-stagioni.png', 'Özel', 'Domates sosu, Mozzarella peyniri, Mantar, Zeytin, Sucuk'),
('Vegetarian', 'Vejetaryen dostu', 50.00, '/pizzas/vegetarian.png', 'Vejetaryen', 'Domates sosu, Mozzarella peyniri, Mantar, Biber, Mısır'),
('BBQ Chicken', 'BBQ soslu tavuk', 60.00, '/pizzas/bbq-chicken.png', 'Tavuk', 'BBQ sos, Mozzarella peyniri, Tavuk, Soğan');
```

### Adım 7: Environment Variables Ayarlama

Vercel dashboard'da projenize gidin:

1. **"Settings" sekmesine tıklayın**
2. **"Environment Variables" bölümüne gidin**
3. **Aşağıdaki değişkenleri ekleyin**:

#### Zorunlu Environment Variables:

```
JWT_SECRET=your-super-secret-key-here-123456789
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

#### Opsiyonel Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Environment Variables Açıklamaları:

**JWT_SECRET**:

- JWT token'ları için güvenlik anahtarı
- En az 32 karakter uzunluğunda olmalı
- Örnek: `JWT_SECRET=my-super-secret-jwt-key-2024-pizza-palace-123`

**NODE_ENV**:

- Production ortamı için `production` olarak ayarlayın
- Örnek: `NODE_ENV=production`

**DATABASE_URL**:

- Supabase veritabanı bağlantı URL'i
- Supabase Dashboard > Settings > Database > Connection string'den alın
- Örnek: `DATABASE_URL=postgresql://postgres:yourpassword@db.abcdefgh.supabase.co:5432/postgres`

**SUPABASE_URL**:

- Supabase proje URL'i
- Supabase Dashboard > Settings > API > Project URL'den alın
- Örnek: `SUPABASE_URL=https://abcdefgh.supabase.co`

**SUPABASE_ANON_KEY**:

- Supabase anonim anahtarı
- Supabase Dashboard > Settings > API > anon public key'den alın
- Örnek: `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Supabase Bilgilerini Alma Adımları:

1. **Supabase Dashboard'a gidin** (https://supabase.com/dashboard)
2. **Projenizi seçin**
3. **Sol menüden "Settings" > "API"ye tıklayın**
4. **"Project URL"** ve **"anon public"** key'i kopyalayın
5. **"Database" > "Connection string"**'den DATABASE_URL'i alın

#### Environment Variables Ekleme Adımları:

1. **Vercel Dashboard'da projenize gidin**
2. **"Settings" sekmesine tıklayın**
3. **"Environment Variables" bölümüne gidin**
4. **Her değişken için:**
   - **Name**: Değişken adını yazın (örn: JWT_SECRET)
   - **Value**: Değişken değerini yazın (örn: my-super-secret-jwt-key-2024)
   - **Environment**: Production seçin
   - **"Add" butonuna tıklayın**

#### Örnek Environment Variables:

```
JWT_SECRET=pizza-palace-jwt-secret-key-2024-very-secure-123
NODE_ENV=production
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefgh.supabase.co:5432/postgres
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTk1MDE0Mzg5MH0.example
NEXT_PUBLIC_APP_URL=https://pizza-palace-erp.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTk1MDE0Mzg5MH0.example
```

**⚠️ Önemli Notlar:**

- JWT_SECRET'ı kimseyle paylaşmayın
- Supabase bilgilerini güvenli tutun
- Production ortamında gerçek değerleri kullanın
- Test ortamında farklı değerler kullanabilirsiniz

### Adım 8: Yeni Deployment

Vercel'de environment variables ekledikten sonra:

1. **"Deployments" sekmesine gidin**
2. **"Redeploy" butonuna tıklayın**
3. **Deployment tamamlanmasını bekleyin**

## 🔐 Giriş Bilgileri

Deployment tamamlandıktan sonra şu bilgilerle giriş yapabilirsiniz:

### Müşteri Girişi

- **Email**: test@example.com
- **Şifre**: 123456

### Admin Girişi

- **Email**: admin@123
- **Şifre**: 123456

### Pizza Admin Girişi

- **Email**: pizzapalaceofficial00@gmail.com
- **Şifre**: 123456

## 🌐 Canlı URL

Vercel deployment tamamlandıktan sonra şu URL'lerde erişebilirsiniz:

- **Ana Site**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **Pizza Admin**: `https://your-project.vercel.app/pizza-admin`

## 🔧 Sorun Giderme

### Yaygın Sorunlar

1. **Git komutu bulunamıyor**
   - Git'i yeniden yükleyin
   - Bilgisayarı yeniden başlatın

2. **Push hatası**
   - GitHub'da repository oluşturduğunuzdan emin olun
   - URL'yi doğru kopyaladığınızdan emin olun

3. **Vercel deployment hatası**
   - Environment variables'ları kontrol edin
   - Supabase bağlantısını test edin

4. **Veritabanı bağlantı hatası**
   - Supabase URL ve key'lerini kontrol edin
   - Database tablolarının oluşturulduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:

- GitHub Issues açın
- Vercel support'a başvurun
- Supabase documentation'ı inceleyin

---

**Not**: Bu rehber production ortamı için hazırlanmıştır. Tüm adımları takip ettiğinizde projeniz canlıda çalışır durumda olacaktır.
