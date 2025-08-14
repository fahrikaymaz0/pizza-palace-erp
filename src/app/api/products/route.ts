import { NextRequest, NextResponse } from 'next/server';

// Simüle edilmiş ürün verileri
const products = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 89999.99,
    description: "Apple iPhone 15 Pro 256GB",
    image: "https://example.com/iphone15.jpg",
    category: "electronics",
    stock: 50,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 74999.99,
    description: "Samsung Galaxy S24 Ultra 512GB",
    image: "https://example.com/galaxy-s24.jpg",
    category: "electronics", 
    stock: 30,
    createdAt: "2024-01-16"
  },
  {
    id: "3",
    name: "MacBook Pro M3",
    price: 129999.99,
    description: "Apple MacBook Pro 14 inch M3",
    image: "https://example.com/macbook-pro.jpg",
    category: "computers",
    stock: 15,
    createdAt: "2024-01-17"
  },
  {
    id: "4",
    name: "AirPods Pro",
    price: 8999.99,
    description: "Apple AirPods Pro 2. Nesil",
    image: "https://example.com/airpods-pro.jpg",
    category: "accessories",
    stock: 100,
    createdAt: "2024-01-18"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filteredProducts = [...products];

    // Kategori filtresi
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Fiyat filtresi
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    return NextResponse.json({
      success: true,
      message: "Ürünler başarıyla getirildi",
      data: filteredProducts,
      count: filteredProducts.length,
      filters: {
        category,
        minPrice,
        maxPrice
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ürünler getirilirken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Ürünler getirilemedi'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, image, category, stock } = body;

    // Validasyon
    if (!name || !price || !description || !category) {
      return NextResponse.json({
        success: false,
        error: 'Gerekli alanlar eksik'
      }, { status: 400 });
    }

    // Yeni ürün oluştur
    const newProduct = {
      id: (products.length + 1).toString(),
      name,
      price: parseFloat(price),
      description,
      image: image || "https://example.com/default.jpg",
      category,
      stock: stock || 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      message: "Ürün başarıyla oluşturuldu",
      data: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error('Ürün oluşturulurken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Ürün oluşturulamadı'
    }, { status: 500 });
  }
} 