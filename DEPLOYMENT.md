# 🚀 Deployment Guide

Bu rehber, Pizza Palace uygulamasını farklı platformlarda nasıl deploy edeceğinizi açıklar.

## 📋 Ön Gereksinimler

- Node.js 18+ yüklü
- Git yüklü
- Bir GitHub hesabı
- (Opsiyonel) Vercel hesabı

## 🔧 Yerel Geliştirme

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/yourusername/dinamik-erp-nextjs.git
cd dinamik-erp-nextjs
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Veritabanını Başlatın
```bash
npm run db:seed
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🌐 Vercel ile Deployment (Önerilen)

### 1. Vercel Hesabı Oluşturun
- [Vercel](https://vercel.com) adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Projeyi Import Edin
- Vercel dashboard'da "New Project" butonuna tıklayın
- GitHub repository'nizi seçin
- Framework Preset olarak "Next.js" seçin

### 3. Environment Variables
Aşağıdaki environment variable'ları ekleyin:
```
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

### 4. Deploy
- "Deploy" butonuna tıklayın
- Deployment tamamlandığında URL'iniz hazır olacak

### 5. Custom Domain (Opsiyonel)
- Vercel dashboard'da domain ayarlarına gidin
- Kendi domain'inizi ekleyin

## 🐳 Docker ile Deployment

### 1. Docker Image Oluşturun
```bash
docker build -t pizza-palace .
```

### 2. Container Çalıştırın
```bash
docker run -p 3000:3000 -e JWT_SECRET=your-secret-key pizza-palace
```

### 3. Docker Compose ile (Önerilen)
```bash
docker-compose up -d
```

## ☁️ AWS ile Deployment

### 1. EC2 Instance Oluşturun
- Ubuntu 20.04 LTS seçin
- t2.micro (free tier) yeterli

### 2. Server'a Bağlanın
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Gerekli Yazılımları Yükleyin
```bash
sudo apt update
sudo apt install -y nodejs npm git nginx
```

### 4. Projeyi Klonlayın
```bash
git clone https://github.com/yourusername/dinamik-erp-nextjs.git
cd dinamik-erp-nextjs
```

### 5. Uygulamayı Build Edin
```bash
npm install
npm run build
```

### 6. PM2 ile Process Yönetimi
```bash
npm install -g pm2
pm2 start npm --name "pizza-palace" -- start
pm2 startup
pm2 save
```

### 7. Nginx Konfigürasyonu
```bash
sudo nano /etc/nginx/sites-available/pizza-palace
```

Nginx konfigürasyonu:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/pizza-palace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL Sertifikası (Let's Encrypt)

### 1. Certbot Yükleyin
```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. SSL Sertifikası Alın
```bash
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring ve Logging

### 1. PM2 Monitoring
```bash
pm2 monit
pm2 logs pizza-palace
```

### 2. Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 CI/CD Pipeline

### GitHub Actions ile Otomatik Deployment

1. **Repository Secrets Ekleyin**
   - `VERCEL_TOKEN`: Vercel API token
   - `ORG_ID`: Vercel organization ID
   - `PROJECT_ID`: Vercel project ID

2. **Workflow Otomatik Çalışacak**
   - Her `main` branch'e push'ta otomatik deploy
   - Pull request'lerde test çalıştırma

## 🚨 Güvenlik Kontrol Listesi

- [ ] JWT_SECRET güçlü bir değer olarak ayarlandı
- [ ] Environment variables production'da doğru ayarlandı
- [ ] HTTPS aktif
- [ ] Firewall kuralları yapılandırıldı
- [ ] Database backup stratejisi oluşturuldu
- [ ] Monitoring ve alerting sistemi kuruldu

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- İndeksler oluşturun
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 2. Caching
- Redis cache ekleyin
- CDN kullanın (Cloudflare, AWS CloudFront)

### 3. Load Balancing
- Multiple instance çalıştırın
- Load balancer kullanın

## 🔧 Troubleshooting

### Yaygın Sorunlar

1. **Port 3000 kullanımda**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Database bağlantı hatası**
   ```bash
   npm run db:reset
   npm run db:seed
   ```

3. **Memory hatası**
   ```bash
   # Node.js memory limit artırın
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

4. **Build hatası**
   ```bash
   rm -rf .next
   npm run build
   ```

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
- GitHub Issues açın
- Email: [your-email]
- Discord: [your-discord]

---

**Not**: Bu rehber production ortamı için hazırlanmıştır. Geliştirme ortamında farklı ayarlar gerekebilir.

