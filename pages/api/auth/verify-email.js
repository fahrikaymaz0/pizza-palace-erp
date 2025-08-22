import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST istekleri destekleniyor' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Doğrulama tokeni gereklidir' 
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    if (!decoded.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Geçersiz token' 
      });
    }

    // Burada normalde veritabanında kullanıcının email_verified durumunu true yaparsınız
    // Şimdilik sadece başarılı response döndürüyoruz
    
    // Örnek veritabanı güncellemesi:
    // await User.updateOne(
    //   { email: decoded.email },
    //   { email_verified: true, email_verified_at: new Date() }
    // );

    res.status(200).json({ 
      success: true, 
      message: 'E-posta adresiniz başarıyla doğrulandı!',
      email: decoded.email
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Doğrulama linki süresi dolmuş. Yeni bir doğrulama e-postası talep edin.' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Geçersiz doğrulama linki.' 
      });
    }

    console.error('E-posta doğrulama hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Doğrulama sırasında bir hata oluştu.' 
    });
  }
}
