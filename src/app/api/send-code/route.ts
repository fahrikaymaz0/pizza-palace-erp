import { NextRequest, NextResponse } from 'next/server';
import { generateCode, sendVerificationEmail, saveCode } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email gerekli' }, { status: 400 });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir email adresi giriniz' }, { status: 400 });
    }

    console.log(`Kod gönderme isteği: ${email}`);

    // Kod üret
    const code = generateCode();
    
    // Email gönder
    const sent = await sendVerificationEmail(email, code, name || 'Kullanıcı');
    
    if (!sent) {
      console.error(`Email gönderilemedi: ${email}`);
      return NextResponse.json({ error: 'Email gönderilemedi' }, { status: 500 });
    }
    
    // Kodu kaydet
    saveCode(email, code);
    
    console.log(`Kod başarıyla gönderildi: ${email}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Doğrulama kodu email adresinize gönderildi' 
    });
    
  } catch (error) {
    console.error('Send code API hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 