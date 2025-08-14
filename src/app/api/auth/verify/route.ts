import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Basit auth verify - her zaman başarısız döndür
  return NextResponse.json(
    {
      success: false,
      message: 'Kullanıcı giriş yapmamış',
      data: { user: null },
    },
    { status: 401 }
  );
}
