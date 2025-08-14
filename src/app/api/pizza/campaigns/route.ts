import { NextRequest, NextResponse } from 'next/server';

// Basit kampanyalar - hızlı yükleme için
const campaigns = [
  {
    id: 1,
    title: 'İlk Sipariş İndirimi',
    description: 'İlk siparişinizde %20 indirim!',
    discount: 20,
    code: 'ILKSIPARIS',
    validFor: 'active',
    condition: 'Sadece ilk sipariş için geçerli',
  },
  {
    id: 2,
    title: '3 Al 2 Öde',
    description: '3 pizza al, 2 tanesini öde!',
    discount: 33,
    code: '3AL2ODE',
    validFor: 'active',
    condition: 'Aynı siparişte 3 pizza',
  },
  {
    id: 3,
    title: 'Hafta Sonu Özel',
    description: 'Hafta sonu siparişlerinde %15 indirim',
    discount: 15,
    code: 'HAFTASONU',
    validFor: 'active',
    condition: 'Cumartesi ve Pazar günleri',
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Kampanyalar başarıyla getirildi',
    data: { campaigns },
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'POST metodu desteklenmiyor',
    },
    { status: 405 }
  );
}
