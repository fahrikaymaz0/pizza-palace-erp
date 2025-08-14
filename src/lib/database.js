const Database = require('better-sqlite3');
const path = require('path');

// Database dosya yolu
const dbPath = path.join(process.cwd(), 'pizza-palace.db');

// Database bağlantısı
let db;

try {
  db = new Database(dbPath);
  console.log('Database bağlantısı başarılı');
} catch (error) {
  console.error('Database bağlantı hatası:', error);
  db = null;
}

// Database bağlantısını al
const getDatabase = () => {
  if (!db) {
    throw new Error('Database bağlantısı bulunamadı');
  }
  return db;
};

// Tabloları oluştur
const initializeDatabase = () => {
  if (!db) return;

  // Users tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      ingredients TEXT,
      available BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status INTEGER DEFAULT 0,
      delivery_address TEXT,
      phone TEXT,
      notes TEXT,
      payment_card_number TEXT,
      payment_card_holder TEXT,
      payment_expiry_date TEXT,
      payment_cvv TEXT,
      transaction_id TEXT,
      auth_code TEXT,
      payment_bank TEXT,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Order items tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  console.log('Database tabloları oluşturuldu');
};

// Database'i başlat
if (db) {
  initializeDatabase();
}

module.exports = {
  getDatabase,
  initializeDatabase
};
