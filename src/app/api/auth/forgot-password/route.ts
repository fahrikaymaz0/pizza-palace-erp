import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';
import { generateCode, sendPasswordResetEmail, saveCodeWithUserData } from '@/lib/emailService';
import { securityMiddleware } from '../../middleware/security';

export async function POST(request: NextRequest) {
  try {
    // Güvenlik middleware'i uygula
    const securityResult = await securityMiddleware(request);
    if (securityResult) return securityResult;

    console.log('🔐 Şifremi unuttum API çağrıldı');
    
    const { email } = await request.json();
    console.log('Gelen email:', email);

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email format hatası:', email);
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    console.log('Validasyon geçti, database bağlantısı kuruluyor...');
    
    const database = getDatabase();
    
    // Kullanıcı var mı kontrol et
    const existingUser = database.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!existingUser) {
      console.log('Email kayıtlı değil:', email);
      return NextResponse.json(
        { error: 'Bu email adresi kayıtlı değil' },
        { status: 400 }
      );
    }

    console.log('Email kontrolü geçti, şifre sıfırlama kodu oluşturuluyor...');

    // 6 haneli şifre sıfırlama kodu oluştur
    const resetCode = generateCode();
    console.log('Şifre sıfırlama kodu oluşturuldu:', resetCode);
    
    // Email gönder
    const emailSent = await sendPasswordResetEmail(email, resetCode, existingUser.name);
    
    if (!emailSent) {
      console.error(`❌ [${requestId}] Email gönderilemedi:`, email);
      return createErrorResponse(
        'Email gönderilemedi. Lütfen email adresinizi kontrol edin.',
        ERROR_CODES.EMAIL_SEND_ERROR,
        requestId,
        500
      );
    }
    
    console.log('✅ Email başarıyla gönderildi:', email);

    // Kodu DATABASE'e kaydet (reset type ile)
    const codeSaved = await saveCodeWithUserData(email, resetCode, {
      name: existingUser.name,
      email: existingUser.email,
      password: '', // Reset için password gerekmiyor
      type: 'password_reset'
    });

    if (!codeSaved) {
      console.error('❌ Kod kaydedilemedi:', email);
      return NextResponse.json(
        { error: 'Şifre sıfırlama kodu kaydedilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    console.log('Forgot Password API başarılı:', email);

    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama kodu email adresinize gönderildi.',
      email: email
    });

  } catch (error) {
    console.error('Forgot Password API hatası:', error);
    return NextResponse.json(
      { error: 'Şifre sıfırlama işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
