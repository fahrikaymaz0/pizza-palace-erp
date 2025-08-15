const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['https://pizza-palace-erp-qc8j.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory data storage
let users = [
  {
    id: 1,
    email: 'admin@123',
    password: '123456',
    name: 'Kaymaz Admin',
    role: 'admin'
  },
  {
    id: 2,
    email: 'pizzapalaceofficial00@gmail.com',
    password: '123456',
    name: 'Pizza Palace Admin',
    role: 'pizza_admin'
  },
  {
    id: 3,
    email: 'test@example.com',
    password: '123456',
    name: 'Test Kullanıcı',
    role: 'user'
  }
];

let orders = [];
let products = [
  { id: 1, name: 'Margherita', price: 45.00, image: '/pizzas/margherita.png', category: 'Klasik' },
  { id: 2, name: 'Pepperoni', price: 55.00, image: '/pizzas/pepperoni.png', category: 'Etli' },
  { id: 3, name: 'Quattro Stagioni', price: 65.00, image: '/pizzas/quattro-stagioni.png', category: 'Özel' },
  { id: 4, name: 'Vegetarian', price: 50.00, image: '/pizzas/vegetarian.png', category: 'Vejetaryen' },
  { id: 5, name: 'BBQ Chicken', price: 60.00, image: '/pizzas/bbq-chicken.png', category: 'Tavuk' },
  { id: 6, name: 'Supreme', price: 70.00, image: '/pizzas/supreme.png', category: 'Özel' }
];

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Simple Backend Server Çalışıyor!',
    timestamp: new Date().toISOString(),
    environment: 'simple-backend',
    data: {
      users: users.length,
      orders: orders.length,
      products: products.length
    }
  });
});

// Admin login
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Admin login attempt:', email);
  
  const user = users.find(u => 
    u.email === email && 
    u.password === password && 
    (u.role === 'admin' || u.role === 'pizza_admin')
  );
  
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

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 User login attempt:', email);
  
  const user = users.find(u => u.email === email && u.password === password);
  
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

// User registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('📝 User registration attempt:', email);
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'Bu email adresi zaten kullanılıyor'
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'user'
  };
  
  users.push(newUser);
  
  console.log('✅ Registration successful:', email);
  
  res.json({
    success: true,
    message: 'Kayıt başarılı',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token: 'new-user-token-' + Date.now()
    }
  });
});

// Get products
app.get('/api/pizza/menu', (req, res) => {
  console.log('🍕 Getting pizza menu...');
  
  res.json({
    success: true,
    data: products
  });
});

// Create order
app.post('/api/pizza/orders', (req, res) => {
  const { user_id, total_amount, delivery_address, phone, notes, items } = req.body;
  
  console.log('📋 Creating order...');
  
  const newOrder = {
    id: orders.length + 1,
    user_id,
    total_amount,
    delivery_address,
    phone,
    notes,
    status: 0, // 0: pending, 1: completed
    created_at: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  console.log('✅ Order created:', newOrder.id);
  
  res.json({
    success: true,
    message: 'Sipariş başarıyla oluşturuldu',
    data: {
      order_id: newOrder.id
    }
  });
});

// Get orders (admin)
app.get('/api/admin/orders', (req, res) => {
  console.log('📋 Getting orders for admin...');
  
  const ordersWithUserInfo = orders.map(order => {
    const user = users.find(u => u.id === order.user_id);
    return {
      ...order,
      user_name: user ? user.name : 'Anonim',
      user_email: user ? user.email : 'anonim@example.com'
    };
  });
  
  console.log('✅ Orders loaded:', ordersWithUserInfo.length);
  
  res.json({
    success: true,
    data: ordersWithUserInfo
  });
});

// Get all users (admin)
app.get('/api/admin/users', (req, res) => {
  console.log('👥 Getting users for admin...');
  
  res.json({
    success: true,
    data: users
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Backend Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Data Status:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Orders: ${orders.length}`);
}); 