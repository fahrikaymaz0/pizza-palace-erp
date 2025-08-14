import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Veritabanı dosyasının yolu
const dbPath = path.join(process.cwd(), 'databases', 'pizza.db');

// Veritabanı dizinini oluştur
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database | null = null;

// Veritabanı bağlantısını al
export function getDatabase(): Database.Database {
  if (!db) {
    console.log('🔗 SQLite veritabanı bağlantısı kuruluyor...');
    console.log('📁 Veritabanı dosyası:', dbPath);
    
    db = new Database(dbPath);
    
    // WAL modunu etkinleştir (daha iyi performans)
    db.pragma('journal_mode = WAL');
    
    // Foreign key desteğini etkinleştir
    db.pragma('foreign_keys = ON');
    
    // Tabloları oluştur
    createTables();
    
    // Örnek verileri ekle
    seedDatabase();
    
    console.log('✅ SQLite veritabanı bağlantısı başarılı');
  }
  return db;
}

// Veritabanı bağlantısını kapat
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('🔌 SQLite veritabanı bağlantısı kapatıldı');
  }
}

// Yardımcı: tablo kolon kontrolü
function ensureUserRoleColumn(database: Database.Database): void {
  try {
    const columns = database.prepare(`PRAGMA table_info(users)`).all() as Array<{ name: string }>;
    const hasRole = columns.some((c) => c.name === 'role');
    if (!hasRole) {
      console.log('🧩 Users tablosuna role sütunu ekleniyor...');
      database.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
      console.log('✅ role sütunu eklendi');
    }
  } catch (err) {
    console.error('role sütunu doğrulanırken hata:', err);
  }
}

// Yardımcı: orders tablosuna ödeme kolonlarını ekle
function ensureOrdersPaymentColumns(database: Database.Database): void {
  try {
    const columns = database.prepare(`PRAGMA table_info(orders)`).all() as Array<{ name: string }>;
    const requiredColumns = [
      'payment_card_number',
      'payment_card_holder', 
      'payment_expiry_date',
      'payment_cvv',
      'transaction_id',
      'auth_code',
      'payment_bank',
      'payment_method'
    ];

    for (const columnName of requiredColumns) {
      const hasColumn = columns.some((c) => c.name === columnName);
      if (!hasColumn) {
        console.log(`🧩 Orders tablosuna ${columnName} sütunu ekleniyor...`);
        database.exec(`ALTER TABLE orders ADD COLUMN ${columnName} TEXT`);
        console.log(`✅ ${columnName} sütunu eklendi`);
      }
    }
  } catch (err) {
    console.error('Orders ödeme kolonları doğrulanırken hata:', err);
  }
}

// Tabloları oluştur
function createTables(): void {
  const database = getDatabase();
  
  // Users tablosu
  database.exec(`
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

  // Eksikse role kolonunu ekle
  ensureUserRoleColumn(database);

  // Orders tablosuna eksik kolonları ekle
  ensureOrdersPaymentColumns(database);

  // User profiles tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      email_verified INTEGER DEFAULT 0,
      phone_verified INTEGER DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Verification codes tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      type TEXT NOT NULL,
      user_data TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Reviews tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Products tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      ingredients TEXT,
      available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders tablosu
  database.exec(`
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
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // BIN list tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS binlist (
      bin INTEGER PRIMARY KEY,
      banka_kodu INTEGER,
      banka_adi TEXT,
      type TEXT,
      sub_type TEXT,
      virtual TEXT,
      prepaid TEXT
    )
  `);

  // İndeksler oluştur
  database.exec('CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)');
  database.exec('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');

  console.log('🧱 SQLite tabloları oluşturuldu/doğrulandı');
}

// Test fonksiyonu
export function testConnection(): boolean {
  try {
    const database = getDatabase();
    const result = database.prepare('SELECT 1 as test').get() as any;
    console.log('✅ SQLite bağlantı testi başarılı:', result);
    return true;
  } catch (error) {
    console.error('❌ SQLite bağlantı testi başarısız:', error);
    return false;
  }
}

// Veritabanı istatistiklerini al
export function getDatabaseStats() {
  const database = getDatabase();
  
  const statsRowUsers = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const statsRowReviews = database.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
  const statsRowProducts = database.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const statsRowOrders = database.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  const statsRowCodes = database.prepare('SELECT COUNT(*) as count FROM verification_codes').get() as { count: number };

  const stats = {
    users: statsRowUsers.count,
    reviews: statsRowReviews.count,
    products: statsRowProducts.count,
    orders: statsRowOrders.count,
    verificationCodes: statsRowCodes.count
  };
  
  return stats;
}

// Veritabanı dosyasının boyutunu al
export function getDatabaseSize(): number {
  try {
    const stats = fs.statSync(dbPath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Veritabanını sıfırla (geliştirme için)
export function resetDatabase(): void {
  try {
    console.log('🗑️ Veritabanı sıfırlanıyor...');
    
    const database = getDatabase();
    
    // Tüm tabloları sil
    database.exec(`
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);
    
    // Tabloları yeniden oluştur
    database.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT DEFAULT 'pizza',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE orders (
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
      );

      CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `);

    // Örnek kullanıcılar ekle
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    database.exec(`
      INSERT INTO users (name, email, password, role) VALUES 
        ('Test User', 'test@example.com', '${hashedPassword}', 'user'),
        ('Pizza Admin', 'admin@pizza.com', '${adminPassword}', 'pizza_admin');
    `);

    // Örnek ürünler ekle
    database.exec(`
      INSERT INTO products (name, description, price, image, category) VALUES 
        ('Pepperoni Pizza', 'Klasik pepperoni pizza', 120.00, '/pizzas/pepperoni.png', 'pizza'),
        ('Margherita Pizza', 'Domates, mozzarella, fesleğen', 100.00, '/pizzas/margherita.png', 'pizza'),
        ('BBQ Chicken Pizza', 'BBQ soslu tavuklu pizza', 140.00, '/pizzas/bbq-chicken.png', 'pizza'),
        ('Cheesy Lovers Pizza', 'Bol peynirli pizza', 130.00, '/pizzas/cheesy-lovers.png', 'pizza'),
        ('Quattro Stagioni', 'Dört mevsim pizza', 150.00, '/pizzas/quattro-stagioni.png', 'pizza');
    `);

    console.log('✅ Veritabanı başarıyla sıfırlandı ve örnek veriler eklendi');
    console.log('👤 Test kullanıcısı: test@example.com / 123456');
    console.log('👨‍💼 Pizza Admin: admin@pizza.com / admin123');
    
  } catch (err) {
    console.error('❌ Veritabanı sıfırlama hatası:', err);
  }
}

// Örnek veriler ekle
export function seedDatabase(): void {
  const database = getDatabase();
  
  try {
    // Admin kullanıcıyı garanti altına al (upsert)
    try {
      const admin = database.prepare('SELECT * FROM users WHERE email = ?').get('admin@123') as any;
      if (!admin) {
        console.log('👑 Admin kullanıcı oluşturuluyor...');
        // Şifreyi hash'le
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        database.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)')
          .run('admin@123', hashedPassword, 'Kaymaz Admin', 'admin');
      } else {
        // Rol veya şifre farklıysa güncelle
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        if (admin.role !== 'admin' || !bcrypt.compareSync('admin123', admin.password_hash)) {
          console.log('🔧 Admin kullanıcı güncelleniyor (rol/şifre senkronizasyonu)...');
          database.prepare('UPDATE users SET role = ?, password_hash = ? WHERE id = ?')
            .run('admin', hashedPassword, admin.id);
        }
      }
    } catch (e) {
      console.warn('Admin upsert kontrolü sırasında uyarı:', e);
    }

    // Pizza admin kullanıcısını garanti altına al (upsert)
    try {
      const pizzaAdmin = database.prepare('SELECT * FROM users WHERE email = ?').get('pizzapalaceofficial00@gmail.com') as any;
      if (!pizzaAdmin) {
        console.log('🍕 Pizza admin kullanıcı oluşturuluyor...');
        // Şifreyi hash'le
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('passwordadmin123', 10);
        database.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)')
          .run('pizzapalaceofficial00@gmail.com', hashedPassword, 'Pizza Palace Admin', 'pizza_admin');
      } else {
        // Rol veya şifre farklıysa güncelle
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('passwordadmin123', 10);
        if (pizzaAdmin.role !== 'pizza_admin' || !bcrypt.compareSync('passwordadmin123', pizzaAdmin.password_hash)) {
          console.log('🔧 Pizza admin kullanıcı güncelleniyor (rol/şifre senkronizasyonu)...');
          database.prepare('UPDATE users SET role = ?, password_hash = ? WHERE id = ?')
            .run('pizza_admin', hashedPassword, pizzaAdmin.id);
        }
      }
    } catch (e) {
      console.warn('Pizza admin upsert kontrolü sırasında uyarı:', e);
    }

    // Örnek kullanıcılar ekle
    const existingUsersRow = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const existingUsers = existingUsersRow.count;
    if (existingUsers === 0) {
      console.log('🌱 Örnek kullanıcılar ekleniyor...');
      
      const bcrypt = require('bcryptjs');
      const users = [
        { email: 'admin@123', password_hash: bcrypt.hashSync('admin123', 10), name: 'Kaymaz Admin', role: 'admin' },
        { email: 'test@example.com', password_hash: bcrypt.hashSync('test123', 10), name: 'Test Kullanıcı', role: 'user' },
        { email: 'user1@example.com', password_hash: bcrypt.hashSync('user123', 10), name: 'Kullanıcı 1', role: 'user' },
        { email: 'user2@example.com', password_hash: bcrypt.hashSync('user123', 10), name: 'Kullanıcı 2', role: 'user' }
      ];
      
      const insertUser = database.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)');
      users.forEach(user => {
        insertUser.run(user.email, user.password_hash, user.name, user.role);
      });
      
      // Kullanıcı profilleri ekle
      const insertProfile = database.prepare(`
        INSERT INTO user_profiles (user_id, phone, email, email_verified, total_orders, total_spent) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      for (let i = 1; i <= users.length; i++) {
        insertProfile.run(i, `+90 555 ${i.toString().padStart(3, '0')}`, users[i-1].email, 1, Math.floor(Math.random() * 10), Math.floor(Math.random() * 500));
      }
    }

    // Örnek ürünler ekle
    const existingProductsRow = database.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    const existingProducts = existingProductsRow.count;
    if (existingProducts === 0) {
      console.log('🍕 Örnek pizza ürünleri ekleniyor...');
      
      const products = [
        { name: 'Margherita', description: 'Klasik İtalyan lezzeti', price: 45.00, image: '/pizzas/margherita.png', category: 'Klasik', ingredients: 'Domates sosu, Mozzarella peyniri, Fesleğen' },
        { name: 'Pepperoni', description: 'Acılı pepperoni ile', price: 55.00, image: '/pizzas/pepperoni.png', category: 'Etli', ingredients: 'Domates sosu, Mozzarella peyniri, Pepperoni' },
        { name: 'Quattro Stagioni', description: 'Dört mevsim lezzeti', price: 65.00, image: '/pizzas/quattro-stagioni.png', category: 'Özel', ingredients: 'Domates sosu, Mozzarella peyniri, Mantar, Zeytin, Sucuk' },
        { name: 'Vegetarian', description: 'Vejetaryen dostu', price: 50.00, image: '/pizzas/vegetarian.png', category: 'Vejetaryen', ingredients: 'Domates sosu, Mozzarella peyniri, Mantar, Biber, Mısır' },
        { name: 'BBQ Chicken', description: 'BBQ soslu tavuk', price: 60.00, image: '/pizzas/bbq-chicken.png', category: 'Tavuk', ingredients: 'BBQ sos, Mozzarella peyniri, Tavuk, Soğan' }
      ];
      
      const insertProduct = database.prepare('INSERT INTO products (name, description, price, image, category, ingredients) VALUES (?, ?, ?, ?, ?, ?)');
      products.forEach(product => {
        insertProduct.run(product.name, product.description, product.price, product.image, product.category, product.ingredients);
      });
    }

    // Örnek siparişler ekle
    const existingOrdersRow = database.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    const existingOrders = existingOrdersRow.count;
    if (existingOrders === 0) {
      console.log('📦 Örnek siparişler ekleniyor...');
      
      // İlk sipariş
      const order1Result = database.prepare('INSERT INTO orders (user_id, total_amount, status, delivery_address, phone, notes) VALUES (?, ?, ?, ?, ?, ?)').run(2, 100.00, 'delivered', 'Kadıköy, İstanbul', '+90 555 123 4567', 'Kapıya bırakabilirsiniz');
      const order1Id = order1Result.lastInsertRowid;
      
      // İlk siparişin öğeleri
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order1Id, 1, 1, 45.00); // Margherita
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order1Id, 2, 1, 55.00); // Pepperoni
      
      // İkinci sipariş
      const order2Result = database.prepare('INSERT INTO orders (user_id, total_amount, status, delivery_address, phone, notes) VALUES (?, ?, ?, ?, ?, ?)').run(3, 65.00, 'delivering', 'Beşiktaş, İstanbul', '+90 555 234 5678', '');
      const order2Id = order2Result.lastInsertRowid;
      
      // İkinci siparişin öğeleri
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order2Id, 3, 1, 65.00); // Quattro Stagioni
      
      // Üçüncü sipariş
      const order3Result = database.prepare('INSERT INTO orders (user_id, total_amount, status, delivery_address, phone, notes) VALUES (?, ?, ?, ?, ?, ?)').run(4, 120.00, 'pending', 'Şişli, İstanbul', '+90 555 345 6789', 'Acılı olsun');
      const order3Id = order3Result.lastInsertRowid;
      
      // Üçüncü siparişin öğeleri
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order3Id, 4, 1, 50.00); // Vegetarian
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order3Id, 5, 1, 60.00); // BBQ Chicken
      database.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)').run(order3Id, 1, 1, 45.00); // Margherita (ekstra)
    }

    // Örnek yorumlar ekle
    const existingReviewsRow = database.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
    const existingReviews = existingReviewsRow.count;
    if (existingReviews === 0) {
      console.log('⭐ Örnek yorumlar ekleniyor...');
      
      const reviews = [
        { user_id: 1, rating: 5, comment: 'Harika pizza! Çok lezzetli ve hızlı teslimat.' },
        { user_id: 2, rating: 4, comment: 'Güzel pizza, tavsiye ederim.' },
        { user_id: 3, rating: 5, comment: 'Mükemmel lezzet ve kalite!' },
        { user_id: 4, rating: 3, comment: 'İyi ama biraz daha büyük olabilirdi.' },
        { user_id: 1, rating: 5, comment: 'Tekrar sipariş vereceğim, çok beğendim.' }
      ];
      
      const insertReview = database.prepare('INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)');
      reviews.forEach(review => {
        insertReview.run(review.user_id, review.rating, review.comment);
      });
    }

    // Örnek doğrulama kodları ekle
    const existingCodesRow = database.prepare('SELECT COUNT(*) as count FROM verification_codes').get() as { count: number };
    const existingCodes = existingCodesRow.count;
    if (existingCodes === 0) {
      console.log('🔐 Örnek doğrulama kodları ekleniyor...');
      
      const insertCode = database.prepare('INSERT INTO verification_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)');
      
      const codes = [
        { email: 'test@example.com', code: '123456', type: 'email_verification', expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
        { email: 'user1@example.com', code: '654321', type: 'password_reset', expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }
      ];
      
      codes.forEach(code => {
        insertCode.run(code.email, code.code, code.type, code.expires_at);
      });
    }

    // BIN listesi ekle
    const existingBinsRow = database.prepare('SELECT COUNT(*) as count FROM binlist').get() as { count: number };
    const existingBins = existingBinsRow.count;
    if (existingBins === 0) {
      console.log('💳 BIN listesi ekleniyor...');
      
      const insertBin = database.prepare('INSERT INTO binlist (bin, banka_kodu, banka_adi, type, sub_type, virtual, prepaid) VALUES (?, ?, ?, ?, ?, ?, ?)');
      
      const bins = [
        { bin: 413226, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 444676, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 444677, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 444678, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 453955, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 453956, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 454671, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 454672, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 454673, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 454674, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 454894, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 540130, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 540134, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 541001, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 541033, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 542374, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 547287, banka_kodu: 10, banka_adi: 'T.C. ZİRAAT BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 415514, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 492094, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 492095, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 498852, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 521378, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 540435, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 543081, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 552879, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 510056, banka_kodu: 12, banka_adi: 'T. HALK BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: 'virtual', prepaid: '' },
        { bin: 402940, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 409084, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 411724, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 411942, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 411943, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 411944, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 411979, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 415792, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 416757, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 428945, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 493840, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 493841, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 493846, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 520017, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 540045, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 540046, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 542119, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 542798, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 542804, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 547244, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 552101, banka_kodu: 15, banka_adi: 'T. VAKIFLAR BANKASI T.A.O.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 402458, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 402459, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 406015, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 427707, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 440247, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 440273, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 440293, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 440294, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 479227, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 489494, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: 'virtual', prepaid: '' },
        { bin: 489495, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 489496, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 510138, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 510139, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 510221, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: 'virtual', prepaid: '' },
        { bin: 512753, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 512803, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 524346, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 524839, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 524840, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 528920, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 530853, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 545124, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'SIGNIA', virtual: '', prepaid: '' },
        { bin: 553090, banka_kodu: 32, banka_adi: 'TÜRK EKONOMİ BANKASI A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 413252, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 425669, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 432071, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 432072, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 435508, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 435509, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 493837, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'VISA', sub_type: 'Acquiring', virtual: '', prepaid: '' },
        { bin: 512754, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' },
        { bin: 520932, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 521807, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 524347, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'PLATINUM', virtual: '', prepaid: '' },
        { bin: 542110, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'Acquiring', virtual: '', prepaid: '' },
        { bin: 552608, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 552609, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 553056, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'BUSINESS', virtual: '', prepaid: '' },
        { bin: 557113, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'CLASSIC', virtual: '', prepaid: '' },
        { bin: 557829, banka_kodu: 46, banka_adi: 'AKBANK T.A.Ş.', type: 'MASTERCARD', sub_type: 'GOLD', virtual: '', prepaid: '' }
      ];
      
      bins.forEach(bin => {
        insertBin.run(bin.bin, bin.banka_kodu, bin.banka_adi, bin.type, bin.sub_type, bin.virtual, bin.prepaid);
      });
    }

    console.log('✅ Örnek veriler başarıyla eklendi!');
  } catch (error) {
    console.error('❌ Örnek veriler eklenirken hata:', error);
  }
}
