import { NextRequest, NextResponse } from 'next/server';
import {
  generateVerificationCode,
  sendVerificationEmail,
} from '@/lib/mailer.js';

// Geçici kod saklama (gerçek uygulamada Redis kullanılır)
const verificationCodes = new Map();

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Email kontrolü
    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gereklidir' },
        { status: 400 }
      );
    }

    // 6 haneli doğrulama kodu oluştur
    const verificationCode = generateVerificationCode();

    // Kodu geçici olarak sakla (10 dakika geçerli)
    verificationCodes.set(email, {
      code: verificationCode,
      createdAt: Date.now(),
    });

    // 10 dakika sonra kodu sil
    setTimeout(
      () => {
        verificationCodes.delete(email);
      },
      10 * 60 * 1000
    );

    // Email gönder
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Email gönderilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doğrulama kodu email adresinize gönderildi',
      email: email,
    });
  } catch (error) {
    console.error('Send email verification error:', error);
    return NextResponse.json(
      { error: 'Email gönderme sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
