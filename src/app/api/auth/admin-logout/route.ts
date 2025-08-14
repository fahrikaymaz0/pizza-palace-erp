import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Admin token cookie'sini temizle
    const response = NextResponse.json({
      success: true,
      message: 'Admin çıkışı başarılı',
    });

    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Cookie'yi hemen sil
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Admin çıkışı başarısız' },
      { status: 500 }
    );
  }
}
