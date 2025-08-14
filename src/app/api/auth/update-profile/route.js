import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email } = await request.json();

    // Form validasyonu
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Geçerli bir isim giriniz' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gereklidir' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Basit kullanıcı güncelleme (gerçek uygulamada veritabanı güncellenir)
    const updatedUser = {
      id: 1, // Geçici ID
      name: name.trim(),
      email: email,
      email_verified: false, // Email değiştiği için doğrulama sıfırlanır
    };

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Profil güncelleme sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
