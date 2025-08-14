# PayTR API Entegrasyonu - Dinamik Test Kartı Algılama

Bu proje, PayTR ödeme sistemi ile entegre edilmiş dinamik test kartı algılama özelliğine sahip bir kredi kartı bileşeni içerir.

## 🚀 Özellikler

- **Dinamik Test Kartı Algılama**: PayTR'nin resmi test kartları otomatik olarak algılanır
- **Gerçek Zamanlı Kart Doğrulama**: Luhn algoritması ile kart numarası doğrulama
- **3D Secure Desteği**: PayTR'nin 3D Secure özelliği ile güvenli ödeme
- **Modern UI/UX**: Glassmorphism tasarım ile modern görünüm
- **API Bağlantı Testi**: PayTR API bağlantısını test etme özelliği

## 📋 PayTR Test Kartları

Sistem aşağıdaki PayTR test kartlarını otomatik olarak algılar:

| Kart Türü | Kart Numarası | CVV | Son Kullanım |
|-----------|---------------|-----|--------------|
| VISA | 4355084355084358 | 000 | 12/30 |
| MasterCard | 5406675406675403 | 000 | 12/30 |
| Troy | 9792030394440796 | 000 | 12/30 |

## 🛠️ Kurulum

### 1. Environment Variables

`.env.local` dosyası oluşturun ve PayTR bilgilerinizi ekleyin:

```env
# PayTR API Configuration
PAYTR_MERCHANT_ID=your_merchant_id_here
PAYTR_MERCHANT_KEY=your_merchant_key_here
PAYTR_MERCHANT_SALT=your_merchant_salt_here

# Frontend için (isteğe bağlı)
NEXT_PUBLIC_PAYTR_MERCHANT_ID=your_merchant_id_here
```

### 2. PayTR Hesabı

1. [PayTR](https://www.paytr.com) sitesinden hesap oluşturun
2. Test ortamı için merchant bilgilerinizi alın
3. Environment variables'a ekleyin

## 🎯 Kullanım

### Test Sayfasına Erişim

```
http://localhost:3000/paytr-test
```

### Dinamik Test Kartı Algılama

1. Test sayfasını açın
2. PayTR test kartlarından birinin numarasını girin
3. Sistem otomatik olarak kartı algılar ve test moduna geçer
4. Diğer bilgiler otomatik olarak doldurulur

### API Test

1. "PayTR API Bağlantısını Test Et" butonuna tıklayın
2. Environment variables doğru ayarlanmışsa bağlantı başarılı olur

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── paytr/
│   │       ├── create-token/
│   │       │   └── route.ts          # PayTR token oluşturma
│   │       ├── test-connection/
│   │       │   └── route.ts          # API bağlantı testi
│   │       └── callback/
│   │           └── route.ts          # PayTR callback handler
│   ├── paytr-test/
│   │   └── page.tsx                  # Test sayfası
│   ├── success/
│   │   └── page.tsx                  # Başarılı ödeme sayfası
│   └── fail/
│       └── page.tsx                  # Başarısız ödeme sayfası
└── components/
    └── PayTRCreditCard.tsx           # Ana kredi kartı bileşeni
```

## 🔧 API Endpoints

### 1. Token Oluşturma
```
POST /api/paytr/create-token
```

### 2. API Bağlantı Testi
```
POST /api/paytr/test-connection
```

### 3. PayTR Callback
```
POST /api/paytr/callback
```

## 🎨 Bileşen Özellikleri

### PayTRCreditCard Bileşeni

- **Dinamik Kart Algılama**: Kart numarası girildiğinde otomatik tür algılama
- **Luhn Doğrulama**: Kart numarası geçerliliği kontrolü
- **3D Kart Animasyonu**: CVV girildiğinde kart çevrilir
- **Gerçek Zamanlı Güncelleme**: Kart bilgileri anlık olarak güncellenir
- **API Durum Göstergesi**: PayTR API bağlantı durumu

### Kart Türü Algılama

```typescript
const detectCardType = (cardNumber: string) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  // PayTR Test Kartlarını Kontrol Et
  const testCard = PAYTR_TEST_CARDS.find(card => 
    card.pattern.test(cleanNumber)
  );
  
  if (testCard) {
    return {
      type: 'test',
      brand: testCard.brand,
      card: testCard,
      message: `PayTR ${testCard.name} algılandı!`
    };
  }
  
  // Gerçek kart türleri...
};
```

## 🔒 Güvenlik

- **Hash Doğrulama**: PayTR callback'lerinde hash doğrulama
- **Environment Variables**: Hassas bilgiler environment'da saklanır
- **3D Secure**: PayTR'nin 3D Secure özelliği aktif
- **Input Validation**: Tüm kullanıcı girdileri doğrulanır

## 🚀 Canlıya Alma

1. PayTR hesabınızda canlı moda geçin
2. Environment variables'da test_mode'u 0 yapın
3. Gerçek merchant bilgilerini kullanın
4. SSL sertifikanızın aktif olduğundan emin olun

## 📞 Destek

PayTR API entegrasyonu ile ilgili sorularınız için:
- [PayTR Dokümantasyon](https://www.paytr.com/odeme/api)
- [PayTR Test Kartları](https://www.paytr.com/odeme/test-kartlari)

## 🔄 Güncellemeler

- **v1.0.0**: İlk sürüm - Dinamik test kartı algılama
- **v1.1.0**: 3D Secure desteği eklendi
- **v1.2.0**: API bağlantı testi eklendi

---

**Not**: Bu sistem sadece test amaçlıdır. Canlı ortamda kullanmadan önce PayTR ile iletişime geçin.




