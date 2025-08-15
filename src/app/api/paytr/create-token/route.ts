import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      payment_type,
      installment_count,
      currency,
      test_mode,
      non_3d,
      cc_owner,
      card_number,
      expiry_month,
      expiry_year,
      cvv,
      merchant_ok_url,
      merchant_fail_url,
      user_name,
      user_address,
      user_phone,
      user_basket,
      debug_on,
      client_lang,
    } = body;

    // PayTR Konfigürasyonu (Environment variables'dan alınmalı)
    const PAYTR_CONFIG = {
      merchant_id: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
      merchant_key: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
      merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
      api_url: 'https://www.paytr.com/odeme/api/get-token',
      test_mode: 1,
    };

    // PayTR için gerekli parametreler
    const params = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      user_ip: user_ip,
      merchant_oid: merchant_oid,
      email: email,
      payment_amount: payment_amount,
      payment_type: payment_type,
      installment_count: installment_count,
      currency: currency,
      test_mode: PAYTR_CONFIG.test_mode.toString(),
      non_3d: non_3d,
      cc_owner: cc_owner,
      card_number: card_number,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      cvv: cvv,
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      user_name: user_name,
      user_address: user_address,
      user_phone: user_phone,
      user_basket: user_basket,
      debug_on: debug_on,
      client_lang: client_lang,
    };

    // Hash oluşturma (PayTR'nin beklediği format)
    const hash_str = `${PAYTR_CONFIG.merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${PAYTR_CONFIG.test_mode}${PAYTR_CONFIG.merchant_salt}`;
    const paytr_token = crypto
      .createHmac('sha256', PAYTR_CONFIG.merchant_key)
      .update(hash_str)
      .digest('base64');

    // PayTR API'ye istek gönderme
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append('paytr_token', paytr_token);

    const response = await fetch(PAYTR_CONFIG.api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.text();

    // PayTR response parsing
    if (result.startsWith('success:')) {
      const token = result.split(':')[1];
      return NextResponse.json({
        success: true,
        token: token,
        message: 'PayTR token başarıyla oluşturuldu',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result,
          message: 'PayTR token oluşturulamadı',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('PayTR token oluşturma hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Token oluşturma sırasında hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}

