import { NextRequest, NextResponse } from 'next/server';

// Basit yorumlar - hızlı yükleme için
const reviews = [
  {
    id: 1,
    rating: 5,
    comment: 'Harika pizza! Çok lezzetli ve taze malzemeler.',
    userName: 'Ahmet Y.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    rating: 4,
    comment: 'Güzel pizza, hızlı teslimat. Tavsiye ederim.',
    userName: 'Fatma K.',
    createdAt: '2024-01-14T18:45:00Z',
  },
  {
    id: 3,
    rating: 5,
    comment: 'En sevdiğim pizza dükkanı! Her zaman mükemmel.',
    userName: 'Mehmet S.',
    createdAt: '2024-01-13T20:15:00Z',
  },
  {
    id: 4,
    rating: 4,
    comment: 'Kaliteli malzemeler, uygun fiyat. Teşekkürler!',
    userName: 'Ayşe D.',
    createdAt: '2024-01-12T12:20:00Z',
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Yorumlar başarıyla getirildi',
    data: { reviews },
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
