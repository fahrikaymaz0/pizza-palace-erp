export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Basit kullanıcılar
  const USERS = [
    {
      email: 'test@example.com',
      password: '123456',
      name: 'Test Kullanıcı',
      role: 'user'
    }
  ];

  if (req.method === 'POST') {
    try {
      console.log('🔐 User login attempt - Pages Router version...');
      
      const { email, password } = req.body;

      console.log('📧 Email:', email);

      // Kullanıcıyı bul
      const user = USERS.find(u => u.email === email && u.password === password);

      if (!user) {
        console.log('❌ Invalid credentials');
        return res.status(401).json({
          success: false,
          error: 'Geçersiz email veya şifre'
        });
      }

      console.log('✅ User login successful:', user.email);

      // Başarılı giriş
      return res.status(200).json({
        success: true,
        message: 'Giriş başarılı',
        data: {
          user: {
            id: '1',
            email: user.email,
            name: user.name,
            role: user.role
          },
          token: 'user-token-' + Date.now()
        }
      });

    } catch (error) {
      console.error('❌ User login error:', error);
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