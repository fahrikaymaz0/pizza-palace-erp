import { prisma, ensurePrismaSchema, ensureUserLastLoginColumn } from '../../../lib/prisma';
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
    return res.status(405).json({ 
      error: 'Method not allowed',
      detail: `Expected POST, got ${req.method}`
    });
  }

  try {
    // Database schema'yı kontrol et
    await ensurePrismaSchema();
    await ensureUserLastLoginColumn();
    
    const { firstName, lastName, email, phone, address, password, confirmPassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    console.log('Register attempt:', { firstName, lastName, email: normalizedEmail });

    // Validation
    if (!firstName || !lastName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ad, soyad, e-posta ve şifre gereklidir',
        detail: 'Missing required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor',
        detail: 'Password mismatch'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır',
        detail: 'Invalid password'
      });
    }

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi giriniz',
        detail: 'Invalid email format'
      });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir telefon numarası giriniz',
        detail: 'Invalid phone format'
      });
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findFirst({
        where: { email: normalizedEmail }
      });
    } catch (dbError) {
      console.error('Database user check error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Kullanıcı kontrolü sırasında hata oluştu',
        detail: dbError.message
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor',
        detail: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateCode();

    // 1) Kullanıcıyı henüz kalıcı kaydetmeden e‑posta gönder
    const emailSent = await sendVerificationEmail(normalizedEmail, verificationCode);
    if (!emailSent) {
      return res.status(502).json({ 
        success: false, 
        message: 'Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.',
        detail: 'Email service failed'
      });
    }

    // 2) E‑posta gönderildiyse kullanıcıyı kaydet
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: normalizedEmail,
          password: hashedPassword,
          phone: phone || null,
          address: address || null,
          verificationCode,
          verificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 dakika
          role: 'user'
        }
      });
    } catch (createError) {
      console.error('User creation error:', createError);
      return res.status(500).json({
        success: false,
        message: 'Kullanıcı kaydı sırasında hata oluştu',
        detail: createError.message
      });
    }

    console.log('User registered successfully:', newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! E-posta adresinize doğrulama kodu gönderildi.',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu',
      detail: error.message
    });
  }
}