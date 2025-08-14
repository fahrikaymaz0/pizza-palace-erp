import { NextRequest, NextResponse } from 'next/server';

// Basit pizza menüsü - hızlı yükleme için
const pizzas = [
  {
    id: 1,
    name: 'Margherita',
    description: 'Klasik İtalyan lezzeti',
    price: 45,
    image: '/pizzas/margherita.png',
    category: 'Klasik',
    ingredients: ['Domates sosu', 'Mozzarella', 'Fesleğen'],
    available: true,
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Acılı pepperoni ile',
    price: 55,
    image: '/pizzas/pepperoni.png',
    category: 'Etli',
    ingredients: ['Domates sosu', 'Mozzarella', 'Pepperoni'],
    available: true,
  },
  {
    id: 3,
    name: 'BBQ Chicken',
    description: 'BBQ soslu tavuk',
    price: 60,
    image: '/pizzas/bbq-chicken.png',
    category: 'Etli',
    ingredients: ['BBQ sos', 'Tavuk', 'Soğan', 'Mozzarella'],
    available: true,
  },
  {
    id: 4,
    name: 'Vegetarian',
    description: 'Sebzeli özel lezzet',
    price: 50,
    image: '/pizzas/vegetarian.png',
    category: 'Vejetaryen',
    ingredients: ['Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella'],
    available: true,
  },
  {
    id: 5,
    name: 'Supreme',
    description: 'Zengin içerik',
    price: 70,
    image: '/pizzas/supreme.png',
    category: 'Özel',
    ingredients: [
      'Pepperoni',
      'Sosis',
      'Biber',
      'Soğan',
      'Mantar',
      'Mozzarella',
    ],
    available: true,
  },
  {
    id: 6,
    name: 'Mexican Hot',
    description: 'Baharatlı jalapeno ve mısır',
    price: 62,
    image: '/pizzas/mexican-hot.png',
    category: 'Özel',
    ingredients: ['Jalapeno', 'Mısır', 'Biber', 'Mozzarella'],
    available: true,
  },
  {
    id: 7,
    name: 'Funghi',
    description: 'Bol mantarlı',
    price: 58,
    image: '/pizzas/funghi.png',
    category: 'Vejetaryen',
    ingredients: ['Mantar', 'Mozzarella', 'Domates sosu'],
    available: true,
  },
  {
    id: 8,
    name: 'Cheesy Lovers',
    description: 'Dört peynirli',
    price: 70,
    image: '/pizzas/cheesy-lovers.png',
    category: 'Klasik',
    ingredients: ['Mozzarella', 'Parmesan', 'Cheddar', 'Beyaz peynir'],
    available: true,
  },
];

const categories = [
  { id: 1, name: 'Klasik' },
  { id: 2, name: 'Etli' },
  { id: 3, name: 'Vejetaryen' },
  { id: 4, name: 'Özel' },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Pizza menüsü başarıyla yüklendi',
    data: {
      pizzas,
      categories,
      total: pizzas.length,
      source: 'static',
    },
  });
}

// Özel pizza oluştur - korumalı örnek uç nokta
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('pizza_token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token bulunamadı' }), {
        status: 401,
      });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return new Response(JSON.stringify({ error: 'Geçersiz token' }), {
        status: 401,
      });
    }

    const pizzaData = await request.json();

    if (
      !pizzaData.name ||
      !pizzaData.description ||
      !pizzaData.price ||
      !pizzaData.ingredients
    ) {
      return new Response(JSON.stringify({ error: 'Tüm alanlar gereklidir' }), {
        status: 400,
      });
    }

    console.log('Özel pizza oluşturuluyor (örnek):', pizzaData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Özel pizza başarıyla oluşturuldu (örnek)',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Pizza oluşturma hatası:', error);
    return new Response(JSON.stringify({ error: 'Sunucu hatası' }), {
      status: 500,
    });
  }
}
