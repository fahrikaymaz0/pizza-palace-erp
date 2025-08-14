const fs = require('fs');
const path = require('path');

// Basitçe database'i sil, PizzaDatabase kendisi yeniden oluştursun
const dbPath = path.join(__dirname, 'databases', 'pizza.db');

console.log('🗑️ Database siliniyor:', dbPath);

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Database silindi');
} else {
  console.log('ℹ️ Database zaten yok');
}

console.log("🔄 Next.js server'ı yeniden başlat");
console.log('Database otomatik olarak yeniden oluşturulacak');
