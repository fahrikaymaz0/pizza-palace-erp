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

    // PayTR Direkt API Konfigürasyonu
    const PAYTR_CONFIG = {
      merchant_id: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
      merchant_key: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
      merchant_salt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
      api_url: 'https://www.paytr.com/odeme/api/get-token',
      test_mode: 1,
    };

    // PayTR Resmi Test Kartları Kontrolü
    const PAYTR_TEST_CARDS = [
      {
        number: '4355084355084358',
        brand: 'VISA',
        description: 'PayTR VISA Test Kartı - Direkt API',
      },
      {
        number: '5406675406675403',
        brand: 'MasterCard',
        description: 'PayTR MasterCard Test Kartı - Direkt API',
      },
      {
        number: '9792030394440796',
        brand: 'Troy',
        description: 'PayTR Troy Test Kartı - Direkt API',
      },
    ];

    const cleanCardNumber = card_number.replace(/\s/g, '');
    const testCard = PAYTR_TEST_CARDS.find(
      card => card.number === cleanCardNumber
    );
    const isTestCard = !!testCard;

    if (isTestCard) {
      console.log('✅ PayTR Test Kartı Algılandı:', testCard.description);
      console.log('🎯 Test Kartı Detayları:', {
        number: cleanCardNumber,
        brand: testCard.brand,
        description: testCard.description,
      });
    }

    // PayTR Direkt API için gerekli parametreler
    const params = {
      merchant_id: PAYTR_CONFIG.merchant_id,
      user_ip: user_ip || '127.0.0.1',
      merchant_oid: merchant_oid,
      email: email || 'test@paytr.com',
      payment_amount: payment_amount || '10000',
      payment_type: payment_type || 'card',
      installment_count: installment_count || '0',
      currency: currency || 'TL',
      test_mode: PAYTR_CONFIG.test_mode.toString(),
      non_3d: non_3d || '0',
      cc_owner: cc_owner || 'PAYTR TEST',
      card_number: card_number,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      cvv: cvv,
      merchant_ok_url: merchant_ok_url || 'https://localhost:3000/success',
      merchant_fail_url: merchant_fail_url || 'https://localhost:3000/fail',
      user_name: user_name || 'PAYTR TEST',
      user_address: user_address || 'Test Address',
      user_phone: user_phone || '05555555555',
      user_basket:
        user_basket || JSON.stringify([['Test Product', '100.00', 1]]),
      debug_on: debug_on || '1',
      client_lang: client_lang || 'tr',
    };

    // Hash oluşturma (PayTR Direkt API'nin beklediği format)
    const hash_str = `${PAYTR_CONFIG.merchant_id}${params.user_ip}${params.merchant_oid}${params.email}${params.payment_amount}${params.user_basket}${PAYTR_CONFIG.test_mode}${PAYTR_CONFIG.merchant_salt}`;
    const paytr_token = crypto
      .createHmac('sha256', PAYTR_CONFIG.merchant_key)
      .update(hash_str)
      .digest('base64');

    // PayTR Direkt API'ye istek gönderme
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('paytr_token', paytr_token);

    console.log('=== PayTR Direkt API Debug Bilgileri ===');
    console.log('Merchant ID:', PAYTR_CONFIG.merchant_id);
    console.log('Test Mode:', PAYTR_CONFIG.test_mode);
    console.log('Hash String:', hash_str);
    console.log('Token:', paytr_token);
    console.log('Card Number:', card_number);
    console.log('Is Test Card:', isTestCard);
    console.log('Form Data:', formData.toString());

    // Environment variables kontrolü
    if (
      PAYTR_CONFIG.merchant_id === 'YOUR_MERCHANT_ID' ||
      PAYTR_CONFIG.merchant_key === 'YOUR_MERCHANT_KEY' ||
      PAYTR_CONFIG.merchant_salt === 'YOUR_MERCHANT_SALT'
    ) {
      console.log('⚠️ PayTR Environment variables ayarlanmamış!');

      // Test kartı ise simüle edilmiş başarılı yanıt döndür
      if (isTestCard) {
        console.log(
          '🎮 Test kartı için simüle edilmiş başarılı yanıt oluşturuluyor...'
        );

        const simulatedToken =
          'PAYTR_TEST_TOKEN_' +
          Math.random().toString(36).substring(2, 10).toUpperCase();

        return NextResponse.json({
          success: true,
          token: simulatedToken,
          message: `PayTR ${testCard.brand} Test Kartı ile simüle edilmiş başarılı ödeme`,
          api_type: 'direkt_api',
          test_mode: 'Test Modu',
          test_card_detected: true,
          test_card_details: {
            brand: testCard.brand,
            description: testCard.description,
            number:
              cleanCardNumber.substring(0, 4) +
              '****' +
              cleanCardNumber.substring(-4),
          },
          is_simulated: true,
          debug_info: {
            note: 'Environment variables ayarlanmamış - test kartı için simüle edilmiş yanıt',
            test_card: testCard.description,
            simulated_token: simulatedToken,
          },
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'ENV_ERROR',
          message:
            'PayTR environment variables ayarlanmamış. Lütfen .env.local dosyasını kontrol edin.',
          details: {
            merchant_id_set: PAYTR_CONFIG.merchant_id !== 'YOUR_MERCHANT_ID',
            merchant_key_set: PAYTR_CONFIG.merchant_key !== 'YOUR_MERCHANT_KEY',
            merchant_salt_set:
              PAYTR_CONFIG.merchant_salt !== 'YOUR_MERCHANT_SALT',
          },
          api_type: 'direkt_api',
          test_card_detected: isTestCard,
        },
        { status: 400 }
      );
    }

    const response = await fetch(PAYTR_CONFIG.api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.text();
    console.log('PayTR Direkt API yanıtı:', result);

    // PayTR Direkt API response parsing
    if (result.startsWith('success:')) {
      const token = result.split(':')[1];
      return NextResponse.json({
        success: true,
        token: token,
        message: isTestCard
          ? `PayTR ${testCard.brand} Test Kartı ile başarılı ödeme token'ı oluşturuldu`
          : 'PayTR Direkt API token başarıyla oluşturuldu',
        api_type: 'direkt_api',
        test_mode: PAYTR_CONFIG.test_mode === 1 ? 'Test Modu' : 'Canlı Mod',
        test_card_detected: isTestCard,
        test_card_details: isTestCard
          ? {
              brand: testCard.brand,
              description: testCard.description,
              number:
                cleanCardNumber.substring(0, 4) +
                '****' +
                cleanCardNumber.substring(-4),
            }
          : null,
        debug_info: {
          hash_string: hash_str,
          token_generated: paytr_token,
          raw_response: result,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result,
          message: isTestCard
            ? `PayTR ${testCard.brand} Test Kartı ile ödeme işlemi başarısız: ${result}`
            : 'PayTR Direkt API token oluşturulamadı',
          api_type: 'direkt_api',
          test_card_detected: isTestCard,
          test_card_details: isTestCard
            ? {
                brand: testCard.brand,
                description: testCard.description,
                number:
                  cleanCardNumber.substring(0, 4) +
                  '****' +
                  cleanCardNumber.substring(-4),
              }
            : null,
          debug_info: {
            hash_string: hash_str,
            token_generated: paytr_token,
            response_text: result,
          },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('PayTR Direkt API hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Direkt API işlemi sırasında hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
        api_type: 'direkt_api',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
