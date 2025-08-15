export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Basit admin kullanıcıları
  const ADMIN_USERS = [
    {
      email: 'admin@123',
      password: '123456',
      name: 'Kaymaz Admin',
      role: 'admin'
    },
    {
      email: 'pizzapalaceofficial00@gmail.com',
      password: '123456',
      name: 'Pizza Palace Admin',
      role: 'pizza_admin'
    }
  ];

  if (req.method === 'POST') {
    try {
      console.log('🔐 Admin login attempt - NEW ENDPOINT...');
      
      const { email, password } = req.body;

      console.log('📧 Email:', email);
      console.log('🔑 Password check...');

      // Kullanıcıyı bul
      const user = ADMIN_USERS.find(u => u.email === email && u.password === password);

      if (!user) {
        console.log('❌ Invalid credentials');
        return res.status(401).json({
          success: false,
          error: 'Geçersiz email veya şifre'
        });
      }

      console.log('✅ Admin login successful:', user.email);

      // Başarılı giriş
      return res.status(200).json({
        success: true,
        message: 'Admin girişi başarılı',
        data: {
          user: {
            id: '1',
            email: user.email,
            name: user.name,
            role: user.role
          },
          token: 'admin-token-' + Date.now()
        }
      });

    } catch (error) {
      console.error('❌ Admin login error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }
  } else {
    // GET, PUT, DELETE vb. metodlar için
    return res.status(405).json({
      success: false,
      error: 'POST metodu kullanın'
    });
  }
} 