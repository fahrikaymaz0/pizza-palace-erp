import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Token verification...');
    
    // Basit token kontrolü - her zaman başarısız döndür
    // (kullanıcı giriş yapmamış kabul et)
    
    console.log('ℹ️ User not authenticated');
    
    return NextResponse.json({
      success: false,
      message: 'Kullanıcı giriş yapmamış',
      data: {
        user: null
      }
    }, { status: 401 });

  } catch (error) {
    console.error('❌ Verify error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}
