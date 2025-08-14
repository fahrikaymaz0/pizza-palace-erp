import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateCode, sendVerificationEmail } from '@/lib/emailService';
import { getDatabase } from '@/lib/sqlite';
import { securityMiddleware } from '../../middleware/security';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Professional input validation
const validateRegisterInput = (email: string, password: string, name: string) => {
  const errors: string[] = [];
  
  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email adresi gereklidir');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Geçerli bir email adresi giriniz');
  } else if (email.length > 255) {
    errors.push('Email adresi çok uzun');
  }
  
  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Şifre gereklidir');
  } else if (password.length < 6) {
    errors.push('Şifre en az 6 karakter olmalıdır');
  } else if (password.length > 128) {
    errors.push('Şifre çok uzun (maksimum 128 karakter)');
  }
  
  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push('İsim gereklidir');
  } else if (name.trim().length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır');
  } else if (name.trim().length > 100) {
    errors.push('İsim çok uzun');
  } else if (!/^[a-zA-ZıiİüÜöÖçÇşŞğĞ\s]+$/.test(name.trim())) {
    errors.push('İsim sadece harflerden oluşmalıdır');
  }
  
  return errors;
};

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`📝 [${requestId}] Register API başladı`);
  
  try {
    // Request body validation
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(`❌ [${requestId}] JSON parse hatası:`, parseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz JSON formatı',
          code: 'INVALID_JSON',
          requestId 
        },
        { status: 400 }
      );
    }
    
    const { email, password, name } = body;
    console.log(`📝 [${requestId}] Kayıt denemesi:`, { 
      email: email?.substring(0, 3) + '***', 
      name: name?.substring(0, 3) + '***',
      passwordLength: password?.length 
    });

    // Input validation
    const validationErrors = validateRegisterInput(email, password, name);
    if (validationErrors.length > 0) {
      console.log(`❌ [${requestId}] Validation hatası:`, validationErrors);
      return NextResponse.json(
        { 
          success: false, 
          error: validationErrors.join(', '),
          code: 'VALIDATION_ERROR',
          requestId 
        },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] Input validation geçti, SQLite bağlantısı kuruluyor...`);
    
    // SQLite Database initialization
    let database;
    try {
      database = getDatabase();
      console.log(`💾 [${requestId}] SQLite Database bağlantısı kuruldu`);
    } catch (dbError) {
      console.error(`❌ [${requestId}] SQLite Database bağlantı hatası:`, dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Veritabanı bağlantısı kurulamadı',
          code: 'DATABASE_CONNECTION_ERROR',
          requestId 
        },
        { status: 500 }
      );
    }
    
    // Email zaten kullanımda mı kontrol et
    try {
      const existingUser = database.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase());
      
      if (existingUser) {
        console.log(`❌ [${requestId}] Email zaten kullanımda:`, email);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Bu email adresi zaten kullanımda',
            code: 'EMAIL_ALREADY_EXISTS',
            requestId 
          },
          { status: 409 } // Conflict
        );
      }
    } catch (userCheckError) {
      console.error(`❌ [${requestId}] Kullanıcı kontrol hatası:`, userCheckError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kullanıcı kontrolü sırasında hata oluştu',
          code: 'USER_CHECK_ERROR',
          requestId 
        },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] Email müsait, doğrulama kodu oluşturuluyor...`);

    // 6 haneli doğrulama kodu oluştur
    let verificationCode;
    try {
      verificationCode = generateCode();
      console.log(`📧 [${requestId}] Doğrulama kodu oluşturuldu:`, verificationCode);
    } catch (codeGenError) {
      console.error(`❌ [${requestId}] Kod oluşturma hatası:`, codeGenError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Doğrulama kodu oluşturulamadı',
          code: 'CODE_GENERATION_ERROR',
          requestId 
        },
        { status: 500 }
      );
    }
    
    // Email gönder (hata olsa bile devam et)
    console.log(`📬 [${requestId}] Email gönderiliyor...`);
    let emailSent = false;
    try {
      emailSent = await sendVerificationEmail(email, verificationCode, name);
      console.log(`✅ [${requestId}] Email başarıyla gönderildi`);
    } catch (emailError) {
      console.error(`⚠️ [${requestId}] Email gönderme hatası (devam ediliyor):`, emailError);
      // Email gönderilmese bile kodu database'e kaydet
      emailSent = false;
    }
    
    if (!emailSent) {
      console.log(`⚠️ [${requestId}] Email gönderilemedi ama kod kaydediliyor:`, email);
    }

    // Sadece doğrulama kodunu kaydet - kullanıcı henüz oluşturulmuyor
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika
      const userData = JSON.stringify({
        name: name.trim(),
        email: email.toLowerCase(),
        password: password,
        type: 'registration'
      });
      
      // Sadece doğrulama kodunu ekle (user_id = null)
      const insertCode = database.prepare(`
        INSERT INTO verification_codes (user_id, email, code, type, user_data, expires_at, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertCode.run(
        null, // user_id henüz yok
        email.toLowerCase(),
        verificationCode,
        'email_verification',
        userData,
        expiresAt.toISOString(),
        new Date().toISOString()
      );
      
      console.log(`✅ [${requestId}] Doğrulama kodu başarıyla kaydedildi`);
      
    } catch (dbError) {
      console.error(`❌ [${requestId}] Kod kaydetme hatası:`, dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Doğrulama kodu kaydedilemedi',
          code: 'CODE_SAVE_ERROR',
          requestId 
        },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] Kayıt işlemi tamamlandı:`, email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Kayıt başarılı! Email adresinizi doğrulayın.',
        data: {
          email: email,
          emailSent: emailSent
        },
        requestId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(`❌ [${requestId}] Register API kritik hatası:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Kayıt sırasında beklenmeyen hata oluştu',
        code: 'INTERNAL_SERVER_ERROR',
        requestId 
      },
      { status: 500 }
    );
  }
} 