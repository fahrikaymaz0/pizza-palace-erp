import { NextRequest, NextResponse } from 'next/server';

// Basit pizza menüsü - hızlı yükleme için
const pizzas = [
  {
    id: 1,
    name: 'Margherita',
    description: 'Klasik İtalyan lezzeti',
    price: 45,
    image: '🍕', // 12MB - emoji kullanıyoruz
    category: 'Klasik',
    ingredients: ['Domates sosu', 'Mozzarella', 'Fesleğen'],
    available: true,
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Acılı pepperoni ile',
    price: 55,
    image: '🌶️', // 20MB - emoji kullanıyoruz
    category: 'Etli',
    ingredients: ['Domates sosu', 'Mozzarella', 'Pepperoni'],
    available: true,
  },
  {
    id: 3,
    name: 'BBQ Chicken',
    description: 'BBQ soslu tavuk',
    price: 60,
    image: '/pizzas/bbq-chicken.png', // 156KB - gerçek resim
    category: 'Etli',
    ingredients: ['BBQ sos', 'Tavuk', 'Soğan', 'Mozzarella'],
    available: true,
  },
  {
    id: 4,
    name: 'Vegetarian',
    description: 'Sebzeli özel lezzet',
    price: 50,
    image: '/pizzas/vegetarian.png', // 153KB - gerçek resim
    category: 'Vejetaryen',
    ingredients: ['Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella'],
    available: true,
  },
  {
    id: 5,
    name: 'Supreme',
    description: 'Zengin içerik',
    price: 70,
    image: '/pizzas/supreme.png', // 93KB - gerçek resim
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
    image: '/pizzas/mexican-hot.png', // 191KB - gerçek resim
    category: 'Özel',
    ingredients: ['Jalapeno', 'Mısır', 'Biber', 'Mozzarella'],
    available: true,
  },
  {
    id: 7,
    name: 'Funghi',
    description: 'Bol mantarlı',
    price: 58,
    image: '/pizzas/funghi.png', // 117KB - gerçek resim
    category: 'Vejetaryen',
    ingredients: ['Mantar', 'Mozzarella', 'Domates sosu'],
    available: true,
  },
  {
    id: 8,
    name: 'Cheesy Lovers',
    description: 'Dört peynirli',
    price: 70,
    image: '/pizzas/cheesy-lovers.png', // 101KB - gerçek resim
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

// Basit POST endpoint - sadece GET kullanılacak
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'POST metodu desteklenmiyor',
    },
    { status: 405 }
  );
}
