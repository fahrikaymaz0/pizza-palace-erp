import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // PayTR'dan gelen parametreler
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;

    // PayTR Konfigürasyonu
    const PAYTR_CONFIG = {
      merchant_key: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
      merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT'
    };

    // Hash doğrulama
    const hash_str = `${merchant_oid}${PAYTR_CONFIG.merchant_salt}${status}${total_amount}`;
    const calculated_hash = crypto.createHmac('sha256', PAYTR_CONFIG.merchant_key).update(hash_str).digest('base64');

    if (hash !== calculated_hash) {
      console.error('PayTR hash doğrulama başarısız');
      return NextResponse.json({ 
        success: false, 
        error: 'Hash doğrulama başarısız' 
      }, { status: 400 });
    }

    // Ödeme durumunu kontrol et
    if (status === 'success') {
      console.log(`Ödeme başarılı: ${merchant_oid}, Tutar: ${total_amount}`);
      
      // Burada veritabanına kayıt yapabilirsiniz
      // await savePaymentToDatabase(merchant_oid, total_amount, 'success');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Ödeme başarılı',
        merchant_oid,
        total_amount
      });
    } else {
      console.log(`Ödeme başarısız: ${merchant_oid}, Durum: ${status}`);
      
      return NextResponse.json({ 
        success: false, 
        message: 'Ödeme başarısız',
        merchant_oid,
        status
      });
    }

  } catch (error) {
    console.error('PayTR callback hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Callback işleme hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}




