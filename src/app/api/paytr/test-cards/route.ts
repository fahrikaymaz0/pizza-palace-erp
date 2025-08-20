import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // PayTR Resmi Test Kartları - Direkt API için
    const PAYTR_TEST_CARDS = [
      {
        name: 'VISA Test Kartı',
        number: '4355084355084358',
        holder: 'PAYTR TEST',
        expiry: '12/30',
        cvv: '000',
        brand: 'visa',
        pattern: /^4355084355084358$/,
        description: 'PayTR VISA test kartı - Direkt API',
      },
      {
        name: 'MasterCard Test Kartı',
        number: '5406675406675403',
        holder: 'PAYTR TEST',
        expiry: '12/30',
        cvv: '000',
        brand: 'mastercard',
        pattern: /^5406675406675403$/,
        description: 'PayTR MasterCard test kartı - Direkt API',
      },
      {
        name: 'Troy Test Kartı',
        number: '9792030394440796',
        holder: 'PAYTR TEST',
        expiry: '12/30',
        cvv: '000',
        brand: 'troy',
        pattern: /^9792030394440796$/,
        description: 'PayTR Troy test kartı - Direkt API',
      },
    ];

    return NextResponse.json({
      success: true,
      test_cards: PAYTR_TEST_CARDS,
      api_type: 'direkt_api',
      source: 'PayTR Resmi Dokümantasyon',
      note: 'Bu kartlar sadece test amaçlıdır ve gerçek ödeme yapmaz',
    });
  } catch (error) {
    console.error('Test kartları getirme hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test kartları alınamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}




