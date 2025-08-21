import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user oluştur
  const adminPassword = await bcrypt.hash('RoyalAdmin2024!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pizzakralligi.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Pizza Krallığı',
      email: 'admin@pizzakralligi.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('👑 Admin user created:', admin.email);

  // Pizza products oluştur
  const products = [
    {
      name: 'Royal Margherita',
      description: 'Kraliyet domates sosu, mozzarella di bufala, taze fesleğen, parmesan peyniri',
      price: 89,
      originalPrice: 120,
      image: '/pizzas/margherita.png',
      category: 'royal',
      rating: 4.9,
      reviewCount: 256,
      isPremium: true,
      isVegetarian: true,
      isSpicy: false,
      ingredients: JSON.stringify(['Domates sosu', 'Mozzarella di bufala', 'Fesleğen', 'Parmesan']),
      preparationTime: '15-20 dk',
      calories: 285,
      badge: '👑 Kraliyet'
    },
    {
      name: 'Imperial Pepperoni',
      description: 'Özel pepperoni, mozzarella, parmesan peyniri, taze kekik',
      price: 99,
      image: '/pizzas/pepperoni.png',
      category: 'imperial',
      rating: 4.8,
      reviewCount: 189,
      isPremium: true,
      isVegetarian: false,
      isSpicy: true,
      ingredients: JSON.stringify(['Pepperoni', 'Mozzarella', 'Parmesan', 'Kekik']),
      preparationTime: '18-22 dk',
      calories: 320,
      badge: '⚔️ İmparatorluk'
    },
    {
      name: 'Supreme Majesty',
      description: 'Kraliyet malzemeleri: sosis, mantar, biber, soğan, zeytin, mozzarella',
      price: 129,
      image: '/pizzas/supreme.png',
      category: 'supreme',
      rating: 5.0,
      reviewCount: 312,
      isPremium: true,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['Sosis', 'Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella']),
      preparationTime: '20-25 dk',
      calories: 380,
      badge: '👑 Majeste'
    },
    {
      name: 'Royal Vegetarian',
      description: 'Taze sebzeler, mozzarella, parmesan, fesleğen, zeytin',
      price: 79,
      image: '/pizzas/vegetarian.png',
      category: 'royal',
      rating: 4.7,
      reviewCount: 145,
      isVegetarian: true,
      isSpicy: false,
      ingredients: JSON.stringify(['Sebzeler', 'Mozzarella', 'Parmesan', 'Fesleğen', 'Zeytin']),
      preparationTime: '15-18 dk',
      calories: 250,
      badge: '🌿 Kraliyet'
    },
    {
      name: 'BBQ Royal Chicken',
      description: 'BBQ sosu, tavuk göğsü, soğan, mısır, mozzarella, cheddar',
      price: 109,
      image: '/pizzas/bbq-chicken.png',
      category: 'bbq',
      rating: 4.6,
      reviewCount: 98,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['BBQ sosu', 'Tavuk göğsü', 'Soğan', 'Mısır', 'Mozzarella', 'Cheddar']),
      preparationTime: '18-22 dk',
      calories: 340,
      badge: '🍗 Kraliyet'
    },
    {
      name: 'Mexican Fire',
      description: 'Acılı sos, jalapeño, mısır, tavuk, mozzarella, acı biber',
      price: 119,
      image: '/pizzas/mexican-hot.png',
      category: 'spicy',
      rating: 4.5,
      reviewCount: 87,
      isVegetarian: false,
      isSpicy: true,
      ingredients: JSON.stringify(['Acılı sos', 'Jalapeño', 'Mısır', 'Tavuk', 'Mozzarella', 'Acı biber']),
      preparationTime: '20-25 dk',
      calories: 360,
      badge: '🔥 Ateş'
    },
    {
      name: 'Royal Quattro Formaggi',
      description: 'Dört peynir: mozzarella, parmesan, gorgonzola, ricotta',
      price: 95,
      image: '/pizzas/cheesy-lovers.png',
      category: 'royal',
      rating: 4.8,
      reviewCount: 167,
      isPremium: true,
      isVegetarian: true,
      isSpicy: false,
      ingredients: JSON.stringify(['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta']),
      preparationTime: '16-20 dk',
      calories: 310,
      badge: '👑 Kraliyet'
    },
    {
      name: 'Imperial Supreme',
      description: 'Sucuk, sosis, mantar, biber, soğan, mozzarella',
      price: 115,
      image: '/pizzas/karisik-pizza.png',
      category: 'imperial',
      rating: 4.7,
      reviewCount: 134,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['Sucuk', 'Sosis', 'Mantar', 'Biber', 'Soğan', 'Mozzarella']),
      preparationTime: '19-23 dk',
      calories: 350,
      badge: '⚔️ İmparatorluk'
    },
    {
      name: 'Royal Napoli',
      description: 'Anchovy, kapari, zeytin, mozzarella, parmesan',
      price: 105,
      image: '/pizzas/napoli.png',
      category: 'royal',
      rating: 4.6,
      reviewCount: 89,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['Anchovy', 'Kapari', 'Zeytin', 'Mozzarella', 'Parmesan']),
      preparationTime: '17-21 dk',
      calories: 290,
      badge: '👑 Kraliyet'
    },
    {
      name: 'BBQ Pulled Pork',
      description: 'BBQ sosu, pulled pork, soğan, mısır, mozzarella',
      price: 125,
      image: '/pizzas/bbq-chicken.png',
      category: 'bbq',
      rating: 4.4,
      reviewCount: 76,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['BBQ sosu', 'Pulled pork', 'Soğan', 'Mısır', 'Mozzarella']),
      preparationTime: '22-26 dk',
      calories: 420,
      badge: '🍗 Kraliyet'
    },
    {
      name: 'Supreme Deluxe',
      description: 'Sucuk, sosis, mantar, biber, soğan, zeytin, mozzarella, parmesan',
      price: 135,
      image: '/pizzas/supreme.png',
      category: 'supreme',
      rating: 4.9,
      reviewCount: 203,
      isPremium: true,
      isVegetarian: false,
      isSpicy: false,
      ingredients: JSON.stringify(['Sucuk', 'Sosis', 'Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella', 'Parmesan']),
      preparationTime: '23-28 dk',
      calories: 410,
      badge: '👑 Majeste'
    },
    {
      name: 'Royal Funghi',
      description: 'Mantar, mozzarella, parmesan, fesleğen, truffle yağı',
      price: 85,
      image: '/pizzas/funghi.png',
      category: 'royal',
      rating: 4.5,
      reviewCount: 112,
      isVegetarian: true,
      isSpicy: false,
      ingredients: JSON.stringify(['Mantar', 'Mozzarella', 'Parmesan', 'Fesleğen', 'Truffle yağı']),
      preparationTime: '14-18 dk',
      calories: 270,
      badge: '👑 Kraliyet'
    }
  ];

  // First, clean existing products
  await prisma.product.deleteMany({});
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('🍕 Products seeded successfully');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
