import { NextRequest, NextResponse } from 'next/server';

// Simüle edilmiş kullanıcı verileri
const users = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    role: "admin",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Fatma Demir",
    email: "fatma@example.com",
    role: "user",
    createdAt: "2024-01-16"
  },
  {
    id: "3",
    name: "Mehmet Kaya",
    email: "mehmet@example.com", 
    role: "user",
    createdAt: "2024-01-17"
  }
];

export async function GET(request: NextRequest) {
  try {
    // Frontendci ve Mobilci için kullanıcı listesi
    return NextResponse.json({
      success: true,
      message: "Kullanıcılar başarıyla getirildi",
      data: users,
      count: users.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Kullanıcılar getirilemedi'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validasyon
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Tüm alanlar gerekli'
      }, { status: 400 });
    }

    // Yeni kullanıcı oluştur
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      data: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Kullanıcı oluşturulamadı'
    }, { status: 500 });
  }
} 