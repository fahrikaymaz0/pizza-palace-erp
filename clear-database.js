const Database = require('better-sqlite3');
const path = require('path');

// Veritabanı dosyasının yolu
const dbPath = path.join(__dirname, 'databases', 'pizza.db');

console.log('🗑️ Veritabanı temizleme başlıyor...');
console.log('📁 Veritabanı dosyası:', dbPath);

try {
  // Veritabanına bağlan
  const db = new Database(dbPath);

  // Tüm tabloları temizle
  const tables = [
    'users',
    'user_profiles',
    'verification_codes',
    'reviews',
    'orders',
    'products',
  ];

  tables.forEach(table => {
    try {
      const count = db
        .prepare(`SELECT COUNT(*) as count FROM ${table}`)
        .get().count;
      db.prepare(`DELETE FROM ${table}`).run();
      console.log(`✅ ${table} tablosundan ${count} kayıt silindi`);
    } catch (error) {
      console.log(`⚠️ ${table} tablosu bulunamadı veya boş`);
    }
  });

  // Veritabanı boyutunu kontrol et
  const stats = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all();
  console.log('\n📊 Kalan tablolar:');
  stats.forEach(table => {
    const count = db
      .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
      .get().count;
    console.log(`   - ${table.name}: ${count} kayıt`);
  });

  db.close();
  console.log('\n✅ Veritabanı başarıyla temizlendi!');
} catch (error) {
  console.error('❌ Hata:', error.message);
}

