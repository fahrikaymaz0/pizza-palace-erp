const Database = require('better-sqlite3');
const path = require('path');

// Database dosya yolu
const dbPath = path.join(process.cwd(), 'pizza-palace.db');

// Database bağlantısı
let db;

try {
  db = new Database(dbPath);
  console.log('Pizza Database bağlantısı başarılı');
} catch (error) {
  console.error('Pizza Database bağlantı hatası:', error);
  db = null;
}

// Database bağlantısını al
const getPizzaDatabase = () => {
  if (!db) {
    throw new Error('Pizza Database bağlantısı bulunamadı');
  }
  return db;
};

// Pizza özel tabloları oluştur
const initializePizzaDatabase = () => {
  if (!db) return;

  // Pizza özel tabloları buraya eklenebilir
  // Şu an için ana database ile aynı tabloları kullanıyoruz
  
  console.log('Pizza Database tabloları hazır');
};

// Database'i başlat
if (db) {
  initializePizzaDatabase();
}

module.exports = {
  getPizzaDatabase,
  initializePizzaDatabase
};
