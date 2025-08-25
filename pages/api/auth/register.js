import { prisma, ensurePrismaSqliteSchema } from '../../../lib/prisma';
import { hashPassword, validateEmail, validatePassword, validatePhone, generateToken } from '../../../lib/auth';
import { generateCode, sendVerificationEmail } from '../../../lib/emailService';

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
    const { firstName, lastName, email, phone, address, password, confirmPassword } = req.body;

    console.log('Register attempt:', { firstName, lastName, email });

    // Validation
    if (!firstName || !lastName || !email || !password) {
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

    if (!validateEmail(email)) {
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
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (emailVerified false, verificationCode). Kayıt sonrası login token üretmiyoruz.
    const verificationCode = generateCode();
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        password: hashedPassword,
        emailVerified: false,
        verificationCode
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    // Send email code (async, non-blocking)
    sendVerificationEmail(newUser.email, verificationCode).catch(() => {});

    console.log('New user created:', newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Kayıt başarılı. Lütfen e-postanıza gelen doğrulama kodunu girin.',
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