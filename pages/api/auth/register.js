import { prisma, ensurePrismaSqliteSchema, ensureUserLastLoginColumn } from '../../../lib/prisma';
import { hashPassword, validateEmail, validatePassword, validatePhone, generateToken } from '../../../lib/auth';

// Email service functions - inline implementation
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, code) {
  try {
    // Development mode - just log the code
    console.log(`[DEV] Verification code ${code} -> ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

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
    await ensurePrismaSqliteSchema();
    await ensureUserLastLoginColumn();
    const { firstName, lastName, email, phone, address, password, confirmPassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    console.log('Register attempt:', { firstName, lastName, email });

    // Validation
    if (!firstName || !lastName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ad, soyad, e-posta ve şifre gereklidir'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi giriniz'
      });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir telefon numarası giriniz'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateCode();

    // 1) Kullanıcıyı henüz kalıcı kaydetmeden e‑posta gönder
    const emailSent = await sendVerificationEmail(normalizedEmail, verificationCode);
    if (!emailSent) {
      return res.status(502).json({ success: false, message: 'Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
    }

    // 2) Doğrulama bekleyen kayıt tablosu yoksa User içinde bekleme olarak tutalım (emailVerified=false, verificationCode set)
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normalizedEmail,
        phone: phone || null,
        address: address || null,
        password: hashedPassword,
        emailVerified: false,
        verificationCode
      },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
    });

    console.log('New user created (pending verification):', newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Doğrulama kodu gönderildi. Kod onaylanınca hesabınız aktifleşecektir.',
      user: newUser
    });

  } catch (error) {
    const msg = error && (error.message || error.code || error.toString());
    console.error('Register API Error:', msg);
    return res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu',
      detail: msg
    });
  }
}