const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['https://pizza-palace-erp-qc8j.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'databases', 'pizza_palace.db');
const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status INTEGER DEFAULT 0,
    delivery_address TEXT,
    phone TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT,
    available INTEGER DEFAULT 1
  )`);

  // Insert default admin users
  db.run(`INSERT OR IGNORE INTO users (email, password, name, role) VALUES 
    ('admin@123', '123456', 'Kaymaz Admin', 'admin'),
    ('pizzapalaceofficial00@gmail.com', '123456', 'Pizza Palace Admin', 'pizza_admin')
  `);

  // Insert default pizzas
  db.run(`INSERT OR IGNORE INTO products (name, description, price, image, category) VALUES 
    ('Margherita', 'Klasik İtalyan lezzeti', 45.00, '/pizzas/margherita.png', 'Klasik'),
    ('Pepperoni', 'Acılı pepperoni ile', 55.00, '/pizzas/pepperoni.png', 'Etli'),
    ('Quattro Stagioni', 'Dört mevsim lezzeti', 65.00, '/pizzas/quattro-stagioni.png', 'Özel'),
    ('Vegetarian', 'Vejetaryen dostu', 50.00, '/pizzas/vegetarian.png', 'Vejetaryen'),
    ('BBQ Chicken', 'BBQ soslu tavuk', 60.00, '/pizzas/bbq-chicken.png', 'Tavuk'),
    ('Supreme', 'En özel malzemeler', 70.00, '/pizzas/supreme.png', 'Özel')
  `);
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Localhost Backend Server Çalışıyor!',
    timestamp: new Date().toISOString(),
    environment: 'localhost-backend'
  });
});

// Admin login
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Admin login attempt:', email);
  
  const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND role IN ("admin", "pizza_admin")';
  
  db.get(query, [email, password], (err, user) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Veritabanı hatası'
      });
    }
    
    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        error: 'Geçersiz email veya şifre'
      });
    }
    
    console.log('✅ Admin login successful:', user.email);
    
    res.json({
      success: true,
      message: 'Admin girişi başarılı',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: 'admin-token-' + Date.now()
      }
    });
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 User login attempt:', email);
  
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.get(query, [email, password], (err, user) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Veritabanı hatası'
      });
    }
    
    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        error: 'Geçersiz email veya şifre'
      });
    }
    
    console.log('✅ User login successful:', user.email);
    
    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: 'user-token-' + Date.now()
      }
    });
  });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('📝 User registration attempt:', email);
  
  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")';
  
  db.run(query, [name, email, password], function(err) {
    if (err) {
      console.error('❌ Registration error:', err);
      return res.status(500).json({
        success: false,
        error: 'Kayıt hatası'
      });
    }
    
    console.log('✅ Registration successful:', email);
    
    res.json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user: {
          id: this.lastID,
          email: email,
          name: name,
          role: 'user'
        },
        token: 'new-user-token-' + Date.now()
      }
    });
  });
});

// Get products
app.get('/api/pizza/menu', (req, res) => {
  console.log('🍕 Getting pizza menu...');
  
  const query = 'SELECT * FROM products WHERE available = 1';
  
  db.all(query, [], (err, products) => {
    if (err) {
      console.error('❌ Get products error:', err);
      return res.status(500).json({
        success: false,
        error: 'Ürünler yüklenemedi'
      });
    }
    
    console.log('✅ Products loaded:', products.length);
    
    res.json({
      success: true,
      data: products
    });
  });
});

// Create order
app.post('/api/pizza/orders', (req, res) => {
  const { user_id, total_amount, delivery_address, phone, notes, items } = req.body;
  
  console.log('📋 Creating order...');
  
  db.run('INSERT INTO orders (user_id, total_amount, delivery_address, phone, notes) VALUES (?, ?, ?, ?, ?)',
    [user_id, total_amount, delivery_address, phone, notes],
    function(err) {
      if (err) {
        console.error('❌ Create order error:', err);
        return res.status(500).json({
          success: false,
          error: 'Sipariş oluşturulamadı'
        });
      }
      
      const orderId = this.lastID;
      console.log('✅ Order created:', orderId);
      
      res.json({
        success: true,
        message: 'Sipariş başarıyla oluşturuldu',
        data: {
          order_id: orderId
        }
      });
    }
  );
});

// Get orders (admin)
app.get('/api/admin/orders', (req, res) => {
  console.log('📋 Getting orders for admin...');
  
  const query = `
    SELECT o.*, u.name as user_name, u.email as user_email 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [], (err, orders) => {
    if (err) {
      console.error('❌ Get orders error:', err);
      return res.status(500).json({
        success: false,
        error: 'Siparişler yüklenemedi'
      });
    }
    
    console.log('✅ Orders loaded:', orders.length);
    
    res.json({
      success: true,
      data: orders
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Localhost Backend Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
}); 