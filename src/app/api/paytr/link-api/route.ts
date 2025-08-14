import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchant_oid,
      email,
      payment_amount,
      payment_type,
      installment_count,
      currency,
      test_mode,
      non_3d,
      merchant_ok_url,
      merchant_fail_url,
      user_name,
      user_address,
      user_phone,
      user_basket,
      user_ip,
      timeout_limit,
      debug_on,
      client_lang,
      no_installment,
      max_installment,
      currency_rate,
      lang
    } = body;

    // PayTR Konfigürasyonu
    const PAYTR_CONFIG = {
      merchant_id: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
      merchant_key: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
      merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
      api_url: 'https://www.paytr.com/odeme/api/get-token',
      test_mode: 1 // Canlıya geçerken 0 yapın
    };

    // PayTR Link API için gerekli parametreler
    const params = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      user_ip: user_ip || '127.0.0.1',
      merchant_oid: merchant_oid || `PAYTR_${Date.now()}`,
      email: email || 'test@paytr.com',
      payment_amount: payment_amount || '10000', // kuruş cinsinden
      payment_type: payment_type || 'card',
      installment_count: installment_count || '0',
      currency: currency || 'TL',
      test_mode: PAYTR_CONFIG.test_mode.toString(),
      non_3d: non_3d || '0',
      merchant_ok_url: merchant_ok_url || `${request.headers.get('origin') || 'http://localhost:3000'}/success`,
      merchant_fail_url: merchant_fail_url || `${request.headers.get('origin') || 'http://localhost:3000'}/fail`,
      user_name: user_name || 'Test User',
      user_address: user_address || 'Test Address',
      user_phone: user_phone || '05555555555',
      user_basket: user_basket || JSON.stringify([['Test Product', '100.00', 1]]),
      timeout_limit: timeout_limit || '30',
      debug_on: debug_on || '1',
      client_lang: client_lang || 'tr',
      no_installment: no_installment || '0',
      max_installment: max_installment || '0',
      currency_rate: currency_rate || '1',
      lang: lang || 'tr'
    };

    // Hash oluşturma (PayTR Link API'nin beklediği format)
    const hash_str = `${PAYTR_CONFIG.merchant_id}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${params.user_basket}${PAYTR_CONFIG.test_mode}${PAYTR_CONFIG.merchant_salt}`;
    const paytr_token = crypto.createHmac('sha256', PAYTR_CONFIG.merchant_key).update(hash_str).digest('base64');

    console.log('=== PayTR Link API Debug Bilgileri ===');
    console.log('Merchant ID:', PAYTR_CONFIG.merchant_id);
    console.log('Test Mode:', PAYTR_CONFIG.test_mode);
    console.log('Hash String:', hash_str);
    console.log('Generated Token:', paytr_token);

    // PayTR Link API'ye istek gönderme
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('paytr_token', paytr_token);

    const response = await fetch(PAYTR_CONFIG.api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.text();
    console.log('PayTR Link API Response:', result);

    // PayTR'dan gelen yanıtı parse et
    if (result.startsWith('success:')) {
      const token = result.split(':')[1];
      const paymentUrl = `https://www.paytr.com/odeme/guvenli/${token}`;
      
      return NextResponse.json({
        success: true,
        token: token,
        payment_url: paymentUrl,
        debug_info: {
          merchant_id: PAYTR_CONFIG.merchant_id,
          test_mode: PAYTR_CONFIG.test_mode,
          hash_string: hash_str,
          generated_token: paytr_token,
          raw_response: result
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result,
        debug_info: {
          merchant_id: PAYTR_CONFIG.merchant_id,
          test_mode: PAYTR_CONFIG.test_mode,
          hash_string: hash_str,
          generated_token: paytr_token,
          raw_response: result
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('PayTR Link API hatası:', error);
    return NextResponse.json({
      success: false,
      error: 'PayTR Link API bağlantı hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}



