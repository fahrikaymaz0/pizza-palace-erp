import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email ve kod gerekli' },
        { status: 400 }
      );
    }

    console.log(`Kod doğrulama isteği: ${email} -> ${code}`);

    const result = await verifyCode(email, code);

    if (result.valid) {
      console.log(`Kod doğrulandı: ${email}`);
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      console.log(`Kod doğrulanamadı: ${email} -> ${result.message}`);
      return NextResponse.json(
        {
          error: result.message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verify code API hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
