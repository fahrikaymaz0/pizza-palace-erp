import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await ensurePrismaSqliteSchema();
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gereklidir'
      });
    }

    // Admin kullanıcısını bul
    const admin = await prisma.user.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifre kontrolü (gerçek uygulamada admin şifresi farklı olmalı)
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Admin kontrolü: role alanı admin olmalı
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu alana erişim yetkiniz yok'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'admin-secret-key',
      { expiresIn: '24h' }
    );

    // Son giriş zamanını güncelle
    await prisma.user.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    // Cookie ayarla
    res.setHeader('Set-Cookie', `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);

    res.status(200).json({
      success: true,
      message: 'Admin girişi başarılı',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        token
      }
    });

  } catch (error) {
    console.error('Admin giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş yapılırken bir hata oluştu'
    });
  } finally {
  }
} 