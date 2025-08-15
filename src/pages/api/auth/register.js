export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'POST') {
    try {
      console.log('📝 User registration attempt - Pages Router version...');
      
      const { name, email, password } = req.body;

      console.log('📧 New user:', { name, email });

      // Basit validasyon
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Tüm alanlar gerekli'
        });
      }

      console.log('✅ Registration successful:', email);

      // Başarılı kayıt
      return res.status(200).json({
        success: true,
        message: 'Kayıt başarılı',
        data: {
          user: {
            id: 'new-user-' + Date.now(),
            email: email,
            name: name,
            role: 'user'
          },
          token: 'new-user-token-' + Date.now()
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
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