const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'databases', 'pizza.db');

console.log('🗑️ Hızlı veritabanı temizleme...');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ pizza.db dosyası silindi');
} else {
  console.log('⚠️ pizza.db dosyası bulunamadı');
}

console.log('🔄 Uygulamayı yeniden başlatın - yeni veritabanı oluşturulacak');





