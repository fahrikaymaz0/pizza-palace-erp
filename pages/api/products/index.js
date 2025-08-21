import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, search, sortBy } = req.query;

    let where = {
      isActive: true
    };

    // Category filter
    if (category && category !== 'all') {
      where.category = category;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Sort options
    let orderBy = { name: 'asc' };
    
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'name':
      default:
        orderBy = { name: 'asc' };
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        originalPrice: true,
        image: true,
        category: true,
        rating: true,
        reviewCount: true,
        isPremium: true,
        isVegetarian: true,
        isSpicy: true,
        ingredients: true,
        preparationTime: true,
        calories: true,
        badge: true
      }
    });

    // Parse ingredients JSON
    const productsWithParsedIngredients = products.map(product => ({
      ...product,
      ingredients: JSON.parse(product.ingredients || '[]')
    }));

    return res.status(200).json({
      success: true,
      products: productsWithParsedIngredients,
      count: productsWithParsedIngredients.length
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ürünler yüklenirken bir hata oluştu'
    });
  }
}
