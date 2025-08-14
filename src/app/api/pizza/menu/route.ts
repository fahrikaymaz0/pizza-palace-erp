import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/sqlite';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES,
  generateRequestId,
} from '@/lib/apiResponse';
import fs from 'fs';
import path from 'path';

type Pizza = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  available: boolean;
};

const PUBLIC_PIZZAS_DIR = path.join(process.cwd(), 'public', 'pizzas');

function buildFallbackCatalogFromPublic(): Pizza[] {
  // Özel isim/kategori/description sözlüğü
  const metadata: Record<string, Partial<Pizza>> = {
    margherita: {
      name: 'Margherita',
      category: 'Klasik',
      description: 'Klasik İtalyan lezzeti',
      price: 45,
      ingredients: ['Domates sosu', 'Mozzarella', 'Fesleğen'],
    },
    pepperoni: {
      name: 'Pepperoni',
      category: 'Etli',
      description: 'Acılı pepperoni ile',
      price: 55,
      ingredients: ['Domates sosu', 'Mozzarella', 'Pepperoni'],
    },
    'quattro-stagioni': {
      name: 'Quattro Stagioni',
      category: 'Özel',
      description: 'Dört mevsim lezzeti',
      price: 65,
      ingredients: ['Mantar', 'Enginar', 'Salam', 'Mozzarella'],
    },
    'bbq-chicken': {
      name: 'BBQ Chicken',
      category: 'Etli',
      description: 'BBQ soslu tavuk',
      price: 60,
      ingredients: ['BBQ sos', 'Tavuk', 'Soğan', 'Mozzarella'],
    },
    vegetarian: {
      name: 'Vegetarian',
      category: 'Vejetaryen',
      description: 'Sebzeli özel lezzet',
      price: 50,
      ingredients: ['Mantar', 'Biber', 'Soğan', 'Zeytin', 'Mozzarella'],
    },
    supreme: {
      name: 'Supreme',
      category: 'Özel',
      description: 'Zengin içerik',
      price: 70,
      ingredients: [
        'Pepperoni',
        'Sosis',
        'Biber',
        'Soğan',
        'Mantar',
        'Mozzarella',
      ],
    },
    'mexican-hot': {
      name: 'Mexican Hot',
      category: 'Özel',
      description: 'Baharatlı jalapeno ve mısır',
      price: 62,
      ingredients: ['Jalapeno', 'Mısır', 'Biber', 'Mozzarella'],
    },
    funghi: {
      name: 'Funghi',
      category: 'Vejetaryen',
      description: 'Bol mantarlı',
      price: 58,
      ingredients: ['Mantar', 'Mozzarella', 'Domates sosu'],
    },
    tonno: {
      name: 'Tonno',
      category: 'Özel',
      description: 'Ton balıklı',
      price: 68,
      ingredients: ['Ton balığı', 'Soğan', 'Zeytin', 'Mozzarella'],
    },
    pollo: {
      name: 'Pollo',
      category: 'Etli',
      description: 'Tavuklu',
      price: 63,
      ingredients: ['Tavuk', 'Mısır', 'Biber', 'Mozzarella'],
    },
    'cheesy-lovers': {
      name: 'Cheesy Lovers',
      category: 'Klasik',
      description: 'Dört peynirli',
      price: 70,
      ingredients: ['Mozzarella', 'Parmesan', 'Cheddar', 'Beyaz peynir'],
    },
    napoli: {
      name: 'Napoli',
      category: 'Klasik',
      description: 'Ançuez ve kaparili',
      price: 66,
      ingredients: ['Ançuez', 'Kapari', 'Domates sosu', 'Mozzarella'],
    },
    'pesto-verde': {
      name: 'Pesto Verde',
      category: 'Vejetaryen',
      description: 'Pesto soslu',
      price: 64,
      ingredients: ['Pesto sos', 'Domates', 'Mozzarella'],
    },
    'karisik-pizza': {
      name: 'Karışık Pizza',
      category: 'Etli',
      description: 'Bol malzemeli',
      price: 72,
      ingredients: ['Sucuk', 'Salam', 'Mısır', 'Biber', 'Mantar', 'Mozzarella'],
    },
  };

  let files: string[] = [];
  try {
    files = fs.existsSync(PUBLIC_PIZZAS_DIR)
      ? fs.readdirSync(PUBLIC_PIZZAS_DIR).filter(f => f.endsWith('.png'))
      : [];
  } catch {
    files = [];
  }

  const catalog: Pizza[] = files.map((file, idx) => {
    const base = path.basename(file, path.extname(file));
    const meta = metadata[base] || {};
    const prettyName =
      meta.name ||
      base.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      id: idx + 1,
      name: prettyName,
      description: meta.description || 'Lezzetli pizza',
      price: typeof meta.price === 'number' ? meta.price : 59,
      image: `/pizzas/${file}`,
      category: meta.category || 'Klasik',
      ingredients: Array.isArray(meta.ingredients) ? meta.ingredients : [],
      available: true,
    };
  });

  // Eğer public/pizzas bulunamazsa minimum bir fallback döndür
  if (catalog.length === 0) {
    return [
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
    ];
  }

  return catalog;
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  console.log(`🍕 [${requestId}] Pizza menu API başladı`);

  try {
    // SQLite Database bağlantısı
    let database;
    try {
      database = getDatabase();
      console.log(`💾 [${requestId}] SQLite Database bağlantısı kuruldu`);
    } catch (dbError) {
      console.error(
        `❌ [${requestId}] SQLite Database bağlantı hatası:`,
        dbError
      );
      // DB yoksa public'ten katalog oluştur
      const fallback = buildFallbackCatalogFromPublic();
      const uniqueCategories = Array.from(
        new Set(fallback.map(p => p.category))
      );
      const categories = uniqueCategories.map((name, index) => ({
        id: index + 1,
        name,
      }));
      return createSuccessResponse(
        'Pizza menüsü başarıyla getirildi (public fallback)',
        {
          pizzas: fallback,
          categories,
          total: fallback.length,
          source: 'fallback-public',
        },
        requestId,
        200
      );
    }

    // DB'den pizzaları getir
    let dbPizzas: any[] = [];
    try {
      dbPizzas = database
        .prepare('SELECT * FROM products WHERE available = 1')
        .all();
      console.log(
        `📋 [${requestId}] SQLite Database'den ${dbPizzas.length} pizza getirildi`
      );
    } catch (dbError) {
      console.error(
        `❌ [${requestId}] SQLite Database pizza getirme hatası:`,
        dbError
      );
      dbPizzas = [];
    }

    // Public katalog
    const fallbackCatalog = buildFallbackCatalogFromPublic();

    // DB -> fallback bind: aynı isimli ürünleri override et, ekstra DB ürünlerini ekle
    const nameToIndex = new Map<string, number>();
    fallbackCatalog.forEach((p, i) => nameToIndex.set(p.name.toLowerCase(), i));

    dbPizzas.forEach(row => {
      const name = (row.name || '').toString();
      const lower = name.toLowerCase();
      const mapped: Pizza = {
        id: typeof row.id === 'number' ? row.id : Number(row.id),
        name,
        description: row.description || 'Lezzetli pizza',
        price: Number(row.price),
        image:
          row.image ||
          row.image_url ||
          `/pizzas/${name.toLowerCase().replace(/\s+/g, '-')}.png`,
        category: row.category || 'Klasik',
        ingredients: row.ingredients
          ? String(row.ingredients)
              .split(',')
              .map((s: string) => s.trim())
          : [],
        available: true,
      };

      if (nameToIndex.has(lower)) {
        // Fallback üzerini DB verileriyle güncelle
        const idx = nameToIndex.get(lower)!;
        fallbackCatalog[idx] = {
          ...fallbackCatalog[idx],
          ...mapped,
          image: mapped.image || fallbackCatalog[idx].image,
        };
      } else {
        // Fallback'te yoksa sonuna ekle
        fallbackCatalog.push(mapped);
      }
    });

    const pizzas = fallbackCatalog;

    // Kategorileri otomatik oluştur
    const uniqueCategories = Array.from(new Set(pizzas.map(p => p.category)));
    const categories = uniqueCategories.map((name, index) => ({
      id: index + 1,
      name,
    }));

    console.log(
      `✅ [${requestId}] Menu hazır: ${pizzas.length} pizza, ${categories.length} kategori`
    );

    return createSuccessResponse(
      'Pizza menüsü başarıyla yüklendi',
      {
        pizzas,
        categories,
        total: pizzas.length,
        source: dbPizzas.length > 0 ? 'database+public' : 'public',
      },
      requestId
    );
  } catch (error) {
    console.error(`❌ [${requestId}] Pizza menu API kritik hatası:`, error);
    return createErrorResponse(
      'Menü yüklenirken beklenmeyen hata oluştu',
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      requestId,
      500
    );
  }
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
