import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/sqlite';
import { generateCode, sendVerificationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    const database = getDatabase();
    
    // Kullanıcıyı email ile bul
    const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as any;
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // 6 haneli doğrulama kodu oluştur
    const verificationCode = generateCode();
    
    // Eski kodları temizle
    database.prepare('DELETE FROM verification_codes WHERE email = ?').run(email.toLowerCase());
    
    // Yeni doğrulama kodunu kaydet
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika
    database.prepare(`
      INSERT INTO verification_codes (user_id, email, code, type, expires_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      email.toLowerCase(),
      verificationCode,
      'email_verification',
      expiresAt.toISOString(),
      new Date().toISOString()
    );

    // Email gönder
    const emailSent = await sendVerificationEmail(email, verificationCode, user.name);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Email gönderilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Yeni doğrulama kodu email adresinize gönderildi'
    });

  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json(
      { error: 'Email gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
} 