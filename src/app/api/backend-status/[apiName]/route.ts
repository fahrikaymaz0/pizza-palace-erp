import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { apiName: string } }
) {
  try {
    const { apiName } = params;

    // Backend API durumunu kontrol et
    // Şu anda tüm API'ler henüz hazır değil (simülasyon)
    const apiStatus = {
      'homepage-api': false,
      'menu-api': false,
      'orders-api': false,
      'users-table': false,
      'products-api': false,
      'notifications-api': false
    };

    // Gerçek uygulamada burada backend'e istek atılır
    // const response = await fetch(`http://backend-url/api/${apiName}/status`);
    // const status = await response.json();

    return NextResponse.json({
      success: true,
      apiName,
      available: apiStatus[apiName as keyof typeof apiStatus] || false,
      message: apiStatus[apiName as keyof typeof apiStatus] 
        ? `${apiName} backend hazır` 
        : `${apiName} backend henüz hazır değil`
    });

  } catch (error) {
    console.error('Backend durumu kontrol edilirken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Backend durumu kontrol edilemedi'
    }, { status: 500 });
  }
} 