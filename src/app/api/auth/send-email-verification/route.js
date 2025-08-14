import { NextResponse } from 'next/server';

// Geçici kod saklama (gerçek uygulamada Redis kullanılır)
const verificationCodes = new Map();

// 6 haneli doğrulama kodu oluştur
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

    // Simüle edilmiş email gönderimi
    console.log(`Doğrulama kodu gönderildi: ${email} -> ${verificationCode}`);

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
