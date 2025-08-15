# PayTR Direkt API Test Sistemi

Bu proje, [PayTR Direkt API](https://dev.paytr.com/direkt-api) dokümantasyonuna göre oluşturulmuş tamamen test amaçlı bir ödeme sistemi entegrasyonudur.

## 🚀 Özellikler

- **PayTR Direkt API Entegrasyonu**: Resmi PayTR Direkt API dokümantasyonuna uygun
- **Dinamik Test Kartı Algılama**: PayTR'nin resmi test kartları otomatik algılanır
- **Gerçek Zamanlı Kart Doğrulama**: Luhn algoritması ile kart numarası doğrulama
- **3D Secure Desteği**: PayTR'nin 3D Secure özelliği ile güvenli ödeme
- **Modern UI/UX**: Glassmorphism tasarım ile modern görünüm
- **API Bağlantı Testi**: PayTR Direkt API bağlantısını test etme özelliği

## 📋 PayTR Direkt API Test Kartları

Sistem aşağıdaki PayTR test kartlarını otomatik olarak algılar:

| Kart Türü  | Kart Numarası    | CVV | Son Kullanım |
| ---------- | ---------------- | --- | ------------ |
| VISA       | 4355084355084358 | 000 | 12/30        |
| MasterCard | 5406675406675403 | 000 | 12/30        |
| Troy       | 9792030394440796 | 000 | 12/30        |

## 🛠️ Kurulum

### 1. Environment Variables

`.env.local` dosyası oluşturun ve PayTR bilgilerinizi ekleyin:

```env
# PayTR Direkt API Configuration
PAYTR_MERCHANT_ID=your_merchant_id_here
PAYTR_MERCHANT_KEY=your_merchant_key_here
PAYTR_MERCHANT_SALT=your_merchant_salt_here

# Frontend için (isteğe bağlı)
NEXT_PUBLIC_PAYTR_MERCHANT_ID=your_merchant_id_here
```

### 2. PayTR Direkt API Hesabı

1. [PayTR](https://www.paytr.com) sitesinden hesap oluşturun
2. Direkt API erişimi için PayTR ile iletişime geçin
3. Test ortamı için merchant bilgilerinizi alın
4. Environment variables'a ekleyin

## 🎯 Kullanım

### Test Sayfasına Erişim

```
http://localhost:3000/paytr-direkt-api
```

### Dinamik Test Kartı Algılama

1. Test sayfasını açın
2. PayTR test kartlarından birinin numarasını girin
3. Sistem otomatik olarak kartı algılar ve test moduna geçer
4. Diğer bilgiler otomatik olarak doldurulur

### API Test

1. "PayTR Direkt API Test Et" butonuna tıklayın
2. Environment variables doğru ayarlanmışsa bağlantı başarılı olur

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── paytr/
│   │       ├── direkt-api/
│   │       │   └── route.ts          # PayTR Direkt API endpoint
│   │       ├── test-cards/
│   │       │   └── route.ts          # Test kartları endpoint
│   │       └── callback/
│   │           └── route.ts          # PayTR callback handler
│   ├── paytr-direkt-api/
│   │   └── page.tsx                  # Direkt API test sayfası
│   ├── success/
│   │   └── page.tsx                  # Başarılı ödeme sayfası
│   └── fail/
│       └── page.tsx                  # Başarısız ödeme sayfası
└── components/
    └── PayTRDirektAPI.tsx            # Direkt API bileşeni
```

## 🔧 API Endpoints

### 1. Direkt API Token Oluşturma

```
POST /api/paytr/direkt-api
```

### 2. Test Kartları

```
GET /api/paytr/test-cards
```

### 3. PayTR Callback

```
POST /api/paytr/callback
```

## 🎨 Bileşen Özellikleri

### PayTRDirektAPI Bileşeni

- **Direkt API Entegrasyonu**: PayTR Direkt API dokümantasyonuna uygun
- **Dinamik Kart Algılama**: Kart numarası girildiğinde otomatik tür algılama
- **Luhn Doğrulama**: Kart numarası geçerliliği kontrolü
- **3D Kart Animasyonu**: CVV girildiğinde kart çevrilir
- **Gerçek Zamanlı Güncelleme**: Kart bilgileri anlık olarak güncellenir
- **API Durum Göstergesi**: PayTR Direkt API bağlantı durumu
- **API Response Display**: API yanıtlarını görsel olarak gösterir

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
      message: `PayTR Direkt API ${testCard.name} algılandı!`,
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
- **Direkt API Güvenliği**: PayTR Direkt API güvenlik standartlarına uygun

## 🚀 Direkt API Özellikleri

### PayTR Direkt API Avantajları

- **Tam Kontrol**: Ödeme akışının tam kontrolü
- **Özelleştirilebilir**: Tamamen özelleştirilebilir ödeme sayfası
- **Güvenlik**: PayTR'nin güvenlik standartları
- **Esneklik**: İhtiyaca göre özelleştirilebilir

### Direkt API Gereksinimleri

- **Yazılım Bilgisi**: Direkt API için yazılım bilgisi gerekli
- **Onay**: PayTR'den Direkt API onayı gerekli
- **Güvenlik**: Tüm güvenlik sorumluluğu mağaza sahibinde
- **Test**: Kapsamlı test süreci gerekli

## 📞 Destek

PayTR Direkt API entegrasyonu ile ilgili sorularınız için:

- [PayTR Direkt API Dokümantasyon](https://dev.paytr.com/direkt-api)
- [PayTR Test Kartları](https://dev.paytr.com/direkt-api)
- [PayTR Destek](https://www.paytr.com/destek)

## 🔄 Güncellemeler

- **v1.0.0**: İlk sürüm - PayTR Direkt API entegrasyonu
- **v1.1.0**: Dinamik test kartı algılama eklendi
- **v1.2.0**: API response display eklendi
- **v1.3.0**: Direkt API özellikleri güncellendi

## ⚠️ Önemli Notlar

1. **Sadece Test Amaçlı**: Bu sistem sadece test amaçlıdır
2. **Direkt API Onayı**: Canlı kullanım için PayTR Direkt API onayı gerekli
3. **Güvenlik**: Direkt API kullanımında tüm güvenlik sorumluluğu sizdedir
4. **Test Süreci**: Kapsamlı test süreci tamamlanmadan canlıya geçmeyin

## 📋 Test Süreci

1. **Geliştirme**: Direkt API entegrasyonu geliştirme
2. **Test**: PayTR test ortamında test
3. **Onay**: PayTR'den Direkt API onayı
4. **Canlı**: Canlı ortamda kullanım

---

**Not**: Bu sistem [PayTR Direkt API](https://dev.paytr.com/direkt-api) dokümantasyonuna göre oluşturulmuştur ve sadece test amaçlıdır. Canlı ortamda kullanmadan önce PayTR ile iletişime geçin.
