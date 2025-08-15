import { NextRequest, NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/sqlite';

export async function POST(request: NextRequest) {
  try {
    // Sadece development ortamında çalışsın
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Bu endpoint sadece development ortamında kullanılabilir' },
        { status: 403 }
      );
    }

    console.log('🔄 Veritabanı sıfırlama isteği alındı');
    resetDatabase();

    return NextResponse.json(
      {
        success: true,
        message: 'Veritabanı başarıyla sıfırlandı',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Veritabanı sıfırlama hatası:', error);
    return NextResponse.json(
      { error: 'Veritabanı sıfırlanırken hata oluştu' },
      { status: 500 }
    );
  }
}

