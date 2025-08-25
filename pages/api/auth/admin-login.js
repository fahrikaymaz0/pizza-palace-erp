import { prisma, ensurePrismaSqliteSchema, ensureUserLastLoginColumn } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await ensurePrismaSqliteSchema();
    await ensureUserLastLoginColumn();
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Validasyon
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gereklidir'
      });
    }

    // Admin kullanıcısını bul
    const admin = await prisma.user.findFirst({ where: { email: normalizedEmail } });

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

    // Admin kontrolü: role alanını küçük harfe çevirerek kontrol et
    if (String(admin.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu alana erişim yetkiniz yok',
        detail: `role=${admin.role}`
      });
    }

    // Uygulama geneliyle aynı JWT imzasını kullan
    const token = generateToken(admin);

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
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        token
      }
    });

  } catch (error) {
    console.error('Admin giriş hatası:', error?.message || error);
    res.status(500).json({
      success: false,
      message: 'Giriş yapılırken bir hata oluştu',
      detail: error?.message || String(error)
    });
  } finally {
  }
} 