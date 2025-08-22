import { prisma } from '../../../lib/prisma';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    console.log('Email verification attempt:', { email, code });

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve doğrulama kodu gereklidir'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'E-posta zaten doğrulanmış'
      });
    }

    // Verify code
    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama kodu'
      });
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        emailVerified: true
      }
    });

    // Generate JWT token for automatic login
    const token = generateToken(updatedUser);

    console.log('Email verified:', user.id);

    return res.status(200).json({
      success: true,
      message: 'E-posta başarıyla doğrulandı',
      user: updatedUser,
      token
    });

  } catch (error) {
    console.error('Email verification API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Doğrulama sırasında bir hata oluştu'
    });
  }
}
