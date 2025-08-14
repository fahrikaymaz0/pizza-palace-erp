import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchant_oid } = body;

    if (!merchant_oid) {
      return NextResponse.json({
        success: false,
        error: 'merchant_oid parametresi gerekli',
        message: 'İşlem numarası (merchant_oid) belirtilmelidir'
      }, { status: 400 });
    }

    // PayTR Status Inquiry API Konfigürasyonu
    const PAYTR_CONFIG = {
      merchant_id: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
      merchant_key: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
      merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
      api_url: 'https://www.paytr.com/odeme/api/get-status',
      test_mode: 1
    };

    // Environment variables kontrolü
    if (PAYTR_CONFIG.merchant_id === 'YOUR_MERCHANT_ID' || 
        PAYTR_CONFIG.merchant_key === 'YOUR_MERCHANT_KEY' || 
        PAYTR_CONFIG.merchant_salt === 'YOUR_MERCHANT_SALT') {
      
      console.log('⚠️ PayTR Status Inquiry - Environment variables ayarlanmamış!');
      
      // Test ortamında simüle edilmiş yanıt
      return NextResponse.json({
        success: true,
        status: 'success',
        merchant_oid: merchant_oid,
        total_amount: '10000',
        payment_type: 'card',
        currency: 'TL',
        test_mode: true,
        is_simulated: true,
        message: 'Test ortamında simüle edilmiş durum sorgusu',
        debug_info: {
          merchant_id: PAYTR_CONFIG.merchant_id,
          test_mode: PAYTR_CONFIG.test_mode,
          note: 'Environment variables ayarlanmamış - simüle edilmiş yanıt'
        }
      });
    }

    // PayTR Status Inquiry API için gerekli parametreler
    const params = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      merchant_oid: merchant_oid,
      test_mode: PAYTR_CONFIG.test_mode.toString()
    };

    // Hash oluşturma (PayTR Status Inquiry API'nin beklediği format)
    const hash_str = `${PAYTR_CONFIG.merchant_id}${merchant_oid}${PAYTR_CONFIG.test_mode}${PAYTR_CONFIG.merchant_salt}`;
    const paytr_token = crypto.createHmac('sha256', PAYTR_CONFIG.merchant_key).update(hash_str).digest('base64');

    // PayTR Status Inquiry API'ye istek gönderme
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('paytr_token', paytr_token);

    console.log('=== PayTR Status Inquiry API Debug Bilgileri ===');
    console.log('Merchant ID:', PAYTR_CONFIG.merchant_id);
    console.log('Merchant OID:', merchant_oid);
    console.log('Test Mode:', PAYTR_CONFIG.test_mode);
    console.log('Hash String:', hash_str);
    console.log('Token:', paytr_token);
    console.log('Form Data:', formData.toString());

    const response = await fetch(PAYTR_CONFIG.api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const result = await response.text();
    console.log('PayTR Status Inquiry API yanıtı:', result);

    // PayTR Status Inquiry API response parsing
    if (result.startsWith('success:')) {
      const statusData = result.split(':')[1];
      const statusParts = statusData.split('|');
      
      // PayTR Status Inquiry yanıt formatı: success:status|total_amount|payment_type|currency
      const status = statusParts[0];
      const total_amount = statusParts[1];
      const payment_type = statusParts[2];
      const currency = statusParts[3];

      return NextResponse.json({
        success: true,
        status: status,
        merchant_oid: merchant_oid,
        total_amount: total_amount,
        payment_type: payment_type,
        currency: currency,
        test_mode: PAYTR_CONFIG.test_mode === 1 ? 'Test Modu' : 'Canlı Mod',
        message: `İşlem durumu: ${status}`,
        debug_info: {
          hash_string: hash_str,
          token_generated: paytr_token,
          raw_response: result
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result,
        merchant_oid: merchant_oid,
        message: 'PayTR Status Inquiry API hatası',
        debug_info: {
          hash_string: hash_str,
          token_generated: paytr_token,
          raw_response: result
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('PayTR Status Inquiry API hatası:', error);
    return NextResponse.json({
      success: false,
      error: 'Status Inquiry işlemi sırasında hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}




