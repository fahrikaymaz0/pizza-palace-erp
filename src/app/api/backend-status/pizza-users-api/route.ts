import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Pizza users API'si hazır
    return NextResponse.json({
      success: true,
      apiName: 'pizza-users-api',
      available: true,
      message: 'Pizza users API hazır - Frontendci kullanabilir'
    });

  } catch (error) {
    console.error('API durumu kontrol edilirken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'API durumu kontrol edilemedi'
    }, { status: 500 });
  }
} 