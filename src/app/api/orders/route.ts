import { NextRequest, NextResponse } from 'next/server';

// Simüle edilmiş sipariş verileri
const orders = [
  {
    id: "1",
    userId: "1",
    userName: "Ahmet Yılmaz",
    products: [
      {
        productId: "1",
        productName: "iPhone 15 Pro",
        quantity: 1,
        price: 89999.99
      }
    ],
    totalAmount: 89999.99,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T11:00:00Z"
  },
  {
    id: "2",
    userId: "2", 
    userName: "Fatma Demir",
    products: [
      {
        productId: "2",
        productName: "Samsung Galaxy S24",
        quantity: 1,
        price: 74999.99
      },
      {
        productId: "4",
        productName: "AirPods Pro",
        quantity: 2,
        price: 8999.99
      }
    ],
    totalAmount: 92999.97,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "3",
    userId: "3",
    userName: "Mehmet Kaya", 
    products: [
      {
        productId: "3",
        productName: "MacBook Pro M3",
        quantity: 1,
        price: 129999.99
      }
    ],
    totalAmount: 129999.99,
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    let filteredOrders = [...orders];

    // Durum filtresi
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }

    // Kullanıcı filtresi
    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId);
    }

    return NextResponse.json({
      success: true,
      message: "Siparişler başarıyla getirildi",
      data: filteredOrders,
      count: filteredOrders.length,
      filters: {
        status,
        userId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Siparişler getirilirken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Siparişler getirilemedi'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, products, totalAmount } = body;

    // Validasyon
    if (!userId || !products || !totalAmount) {
      return NextResponse.json({
        success: false,
        error: 'Gerekli alanlar eksik'
      }, { status: 400 });
    }

    // Kullanıcı adını bul
    const user = {
      id: "1",
      name: "Ahmet Yılmaz"
    }; // Gerçek uygulamada veritabanından çekilir

    // Yeni sipariş oluştur
    const newOrder = {
      id: (orders.length + 1).toString(),
      userId,
      userName: user.name,
      products,
      totalAmount: parseFloat(totalAmount),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      message: "Sipariş başarıyla oluşturuldu",
      data: newOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Sipariş oluşturulurken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Sipariş oluşturulamadı'
    }, { status: 500 });
  }
} 