import { NextRequest, NextResponse } from 'next/server';

// Simüle edilmiş müşteri verileri
const clients = [
  {
    id: "pizza-customer-1",
    name: "Pizza Dükkanı",
    email: "pizza@example.com",
    industry: "Restoran",
    createdAt: new Date().toISOString(),
    databasePath: "/databases/pizza-customer-1.db"
  }
];

// GET /api/clients - Tüm müşterileri listele
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: clients,
      message: 'Müşteriler başarıyla getirildi'
    });
  } catch (error) {
    console.error('Müşteri listesi alınırken hata:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Müşteri listesi alınamadı',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

// POST /api/clients - Yeni müşteri oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, industry } = body;

    // Validation
    if (!name || !email || !industry) {
      return NextResponse.json({
        success: false,
        error: 'Eksik bilgi',
        details: 'İsim, email ve sektör alanları zorunludur'
      }, { status: 400 });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz email formatı'
      }, { status: 400 });
    }

    // Client ID oluştur (email'den hash)
    const clientId = Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    const newClient = {
      id: clientId,
      name,
      email,
      industry,
      createdAt: new Date().toISOString(),
      databasePath: `/databases/${clientId}.db`
    };

    clients.push(newClient);

    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Müşteri başarıyla oluşturuldu'
    }, { status: 201 });

  } catch (error) {
    console.error('Müşteri oluşturulurken hata:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Müşteri oluşturulamadı',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 