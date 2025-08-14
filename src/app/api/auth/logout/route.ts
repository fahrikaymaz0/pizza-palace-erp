import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Başarıyla çıkış yapıldı'
    });

    // Auth token cookie'sini temizle
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Cookie'yi hemen sil
      path: '/'
    });

    // Admin token cookie'sini temizle
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Cookie'yi hemen sil
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Çıkış hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Çıkış yapılamadı'
    }, { status: 500 });
  }
} 