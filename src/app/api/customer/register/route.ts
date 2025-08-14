import { NextRequest, NextResponse } from 'next/server';
import { customerManager } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, name, email, password, companyName } = body;

    // Validasyon
    if (!customerId || !name || !email || !password || !companyName) {
      return NextResponse.json({
        success: false,
        error: 'Tüm alanlar gerekli'
      }, { status: 400 });
    }

    // Müşteri veritabanı oluştur
    const customerDb = await customerManager.createCustomerDatabase(customerId);

    // Admin kullanıcısı oluştur
    const hashedPassword = await bcrypt.hash(password, 12);
    await customerDb.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'Müşteri başarıyla oluşturuldu',
      data: {
        customerId,
        name,
        email,
        companyName,
        databaseCreated: true
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Müşteri oluşturulurken hata:', error);
    return NextResponse.json({
      success: false,
      error: 'Müşteri oluşturulamadı'
    }, { status: 500 });
  }
} 