'use client';

import React, { useState, useEffect } from 'react';

const PayTRDirektAPI = () => {
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiStatus, setApiStatus] = useState('disconnected');
  const [detectedCard, setDetectedCard] = useState<any>(null);
  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    brand: '',
    message: ''
  });
  const [testCards, setTestCards] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // PayTR Direkt API Test Kartları (Resmi Dokümantasyon)
  const PAYTR_TEST_CARDS = [
    {
      name: 'VISA Test Kartı',
      number: '4355084355084358',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'visa',
      pattern: /^4355084355084358$/,
      description: 'PayTR VISA test kartı - Direkt API'
    },
    {
      name: 'MasterCard Test Kartı',
      number: '5406675406675403',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'mastercard',
      pattern: /^5406675406675403$/,
      description: 'PayTR MasterCard test kartı - Direkt API'
    },
    {
      name: 'Troy Test Kartı',
      number: '9792030394440796',
      holder: 'PAYTR TEST',
      expiry: '12/30',
      cvv: '000',
      brand: 'troy',
      pattern: /^9792030394440796$/,
      description: 'PayTR Troy test kartı - Direkt API'
    }
  ];

  // Test kartlarını API'den al
  const fetchTestCards = async () => {
    try {
      const response = await fetch('/api/paytr/test-cards');
      const data = await response.json();
      if (data.success) {
        setTestCards(data.test_cards);
      }
    } catch (error) {
      console.error('Test kartları alınamadı:', error);
      setTestCards(PAYTR_TEST_CARDS);
    }
  };

  // Kart Numarası Algılama Fonksiyonu
  const detectCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    // PayTR Test Kartlarını Kontrol Et
    const testCard = PAYTR_TEST_CARDS.find(card => 
      card.pattern.test(cleanNumber)
    );
    
    if (testCard) {
      return {
        type: 'test',
        brand: testCard.brand,
        card: testCard,
        message: `PayTR Direkt API ${testCard.name} algılandı!`
      };
    }

    // Gerçek Kart Türlerini Algıla
    if (/^4/.test(cleanNumber)) {
      return { type: 'real', brand: 'visa', message: 'VISA kartı algılandı' };
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return { type: 'real', brand: 'mastercard', message: 'MasterCard algılandı' };
    } else if (/^9792/.test(cleanNumber)) {
      return { type: 'real', brand: 'troy', message: 'Troy kartı algılandı' };
    } else if (/^6/.test(cleanNumber)) {
      return { type: 'real', brand: 'discover', message: 'Discover kartı algılandı' };
    } else if (/^3[47]/.test(cleanNumber)) {
      return { type: 'real', brand: 'amex', message: 'American Express algılandı' };
    }
    
    return { type: 'unknown', brand: 'unknown', message: 'Kart türü algılanamadı' };
  };

  // Luhn Algoritması ile Kart Numarası Doğrulama
  const validateCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Test kartı otomatik yükleme
  const autoLoadTestCard = (detectedCard: any) => {
    if (detectedCard.type === 'test' && detectedCard.card) {
      setCardData({
        number: detectedCard.card.number,
        holder: detectedCard.card.holder,
        expiry: detectedCard.card.expiry,
        cvv: detectedCard.card.cvv
      });
      setDetectedCard(detectedCard.card);
      
      // Test kartı algılandığında kullanıcıya bilgi ver
      console.log('🎯 PayTR Test Kartı Otomatik Yüklendi:', detectedCard.card.description);
    }
  };

  // Get user IP (PayTR için gerekli)
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('IP alınamadı:', error);
      return '127.0.0.1';
    }
  };

  // PayTR Direkt API testi
  const testPayTRDirektAPI = async () => {
    setApiStatus('testing');
    setDebugInfo(null);
    
    try {
      const userIP = await getUserIP();
      const merchantOid = 'TEST_' + Date.now();
      
      const testData = {
        merchant_id: process.env.NEXT_PUBLIC_PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
        user_ip: userIP,
        merchant_oid: merchantOid,
        email: 'test@paytr.com',
        payment_amount: '10000', // 100.00 TL (kuruş cinsinden)
        payment_type: 'card',
        installment_count: '0',
        currency: 'TL',
        test_mode: '1',
        non_3d: '0',
        cc_owner: 'PAYTR TEST',
        card_number: '4355084355084358',
        expiry_month: '12',
        expiry_year: '30',
        cvv: '000',
        merchant_ok_url: window.location.origin + '/success',
        merchant_fail_url: window.location.origin + '/fail',
        user_name: 'PAYTR TEST',
        user_address: 'Test Address',
        user_phone: '05555555555',
        user_basket: JSON.stringify([['Test Product', '100.00', 1]]),
        debug_on: '1',
        client_lang: 'tr'
      };

      console.log('Test verisi gönderiliyor:', testData);

      const response = await fetch('/api/paytr/direkt-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      setApiResponse(result);
      setDebugInfo(result.debug_info);

      console.log('API Test sonucu:', result);

      if (result.success) {
        setApiStatus('connected');
        return true;
      } else {
        setApiStatus('disconnected');
        
        // Environment variables hatası kontrolü
        if (result.error === 'ENV_ERROR') {
          alert('⚠️ PayTR Environment Variables Ayarlanmamış!\n\n' +
                'Lütfen .env.local dosyasında aşağıdaki değerleri ayarlayın:\n\n' +
                'PAYTR_MERCHANT_ID=your_merchant_id\n' +
                'PAYTR_MERCHANT_KEY=your_merchant_key\n' +
                'PAYTR_MERCHANT_SALT=your_merchant_salt\n\n' +
                'Bu değerleri PayTR hesabınızdan alabilirsiniz.');
        }
        
        return false;
      }
    } catch (error) {
      console.error('PayTR Direkt API testi başarısız:', error);
      setApiStatus('disconnected');
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      
      // Kart türü algılama
      const cardDetection = detectCardType(value);
      setCardValidation({
        isValid: validateCardNumber(value),
        brand: cardDetection.brand,
        message: cardDetection.message
      });

      // Test kartı otomatik yükleme
      if (cardDetection.type === 'test') {
        autoLoadTestCard(cardDetection);
      }
      
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'holder') {
      formattedValue = value.toUpperCase();
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '');
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Validate form completeness
  const isFormComplete = () => {
    const cleanNumber = cardData.number.replace(/\s+/g, '');
    return cleanNumber.length >= 13 && 
           cardData.holder.length >= 3 && 
           cardData.expiry.length === 5 && 
           cardData.cvv.length >= 3 &&
           cardValidation.isValid;
  };

  // Handle payment - PayTR Direkt API
  const handlePayment = async () => {
    if (!isFormComplete()) {
      alert('Lütfen tüm kart bilgilerini doğru şekilde doldurun!');
      return;
    }

    setIsProcessing(true);
    setDebugInfo(null);
    
    try {
      const userIP = await getUserIP();
      const merchantOid = 'ORDER_' + Date.now();
      
      const paymentData = {
        merchant_id: process.env.NEXT_PUBLIC_PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
        user_ip: userIP,
        merchant_oid: merchantOid,
        email: 'test@paytr.com',
        payment_amount: '10000', // 100.00 TL (kuruş cinsinden)
        payment_type: 'card',
        installment_count: '0',
        currency: 'TL',
        test_mode: '1',
        non_3d: '0',
        cc_owner: cardData.holder,
        card_number: cardData.number.replace(/\s/g, ''),
        expiry_month: cardData.expiry.split('/')[0],
        expiry_year: cardData.expiry.split('/')[1],
        cvv: cardData.cvv,
        merchant_ok_url: window.location.origin + '/success',
        merchant_fail_url: window.location.origin + '/fail',
        user_name: cardData.holder,
        user_address: 'Test Address',
        user_phone: '05555555555',
        user_basket: JSON.stringify([['Test Product', '100.00', 1]]),
        debug_on: '1',
        client_lang: 'tr'
      };

      console.log('Ödeme verisi gönderiliyor:', paymentData);

      const response = await fetch('/api/paytr/direkt-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      setApiResponse(result);
      setDebugInfo(result.debug_info);

      console.log('Ödeme sonucu:', result);

      if (result.success) {
        console.log('✅ PayTR Direkt API başarılı!');
        console.log('🎯 Test Kartı:', detectedCard ? 'Evet' : 'Hayır');
        console.log('🔑 Token:', result.token);
        
        if (result.is_simulated) {
          console.log('🎮 Simüle edilmiş test ödeme');
          alert(`🎉 PayTR ${detectedCard?.brand || 'Test'} Kartı ile simüle edilmiş ödeme başarılı!\n\n` +
                `İşlem No: ${result.token}\n` +
                `Tutar: ₺100.00\n` +
                `Durum: Test Modu - Simüle Edilmiş`);
        } else {
          // PayTR'ye POST request
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://www.paytr.com/odeme';
          
          const formData: any = {
            ...paymentData,
            paytr_token: result.token
          };

          Object.keys(formData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }
      } else {
        let errorMessage = `PayTR Direkt API Hatası: ${result.error}\n\n`;
        
        if (result.error === 'ENV_ERROR') {
          errorMessage += '⚠️ Environment Variables Ayarlanmamış!\n\n' +
                         'Lütfen .env.local dosyasında PayTR bilgilerinizi ayarlayın.\n\n';
        }
        
        if (detectedCard) {
          errorMessage += `🎯 PayTR Test Kartı Algılandı:\n` +
                         `Kart: ${detectedCard.brand} Test Kartı\n` +
                         `Numara: ${cardData.number}\n` +
                         `Sahibi: ${cardData.holder}\n` +
                         `CVV: ${cardData.cvv}\n` +
                         `Tür: ${cardValidation.brand.toUpperCase()}\n\n`;
        } else {
          errorMessage += `Kart bilgileri:\n` + 
                         `Kart: ${cardData.number}\nSahibi: ${cardData.holder}\nCVV: ${cardData.cvv}\nTür: ${cardValidation.brand.toUpperCase()}\n\n`;
        }
        
        errorMessage += `💡 Test kartları için environment variables ayarlanmamış olsa bile simüle edilmiş ödeme yapılabilir.`;
        
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme işleminde hata oluştu: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Component mount
  useEffect(() => {
    fetchTestCards();
    testPayTRDirektAPI();
  }, []);

  // Display values
  const getDisplayNumber = () => cardData.number || '•••• •••• •••• ••••';
  const getDisplayHolder = () => cardData.holder || 'KART SAHİBİ';
  const getDisplayExpiry = () => cardData.expiry || 'AA/YY';
  const getDisplayCVV = () => cardData.cvv || '•••';

  // Get card styling based on brand
  const getCardGradient = () => {
    const brand = cardValidation.brand;
    switch(brand) {
      case 'visa':
        return 'from-blue-600 via-blue-700 to-blue-900';
      case 'mastercard':
        return 'from-red-600 via-red-700 to-red-900';
      case 'troy':
        return 'from-green-600 via-green-700 to-green-900';
      case 'amex':
        return 'from-green-500 via-green-600 to-green-800';
      case 'discover':
        return 'from-orange-500 via-orange-600 to-orange-800';
      default:
        return 'from-slate-700 via-slate-800 to-slate-900';
    }
  };

  // API Status indicator
  const getApiStatusColor = () => {
    switch(apiStatus) {
      case 'connected': return 'text-green-400';
      case 'testing': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getApiStatusText = () => {
    switch(apiStatus) {
      case 'connected': return 'PayTR Direkt API Bağlantısı OK';
      case 'testing': return 'PayTR Direkt API Test Ediliyor...';
      default: return 'PayTR Direkt API Bağlantısı Yok';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* PayTR Header */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">PayTR</h1>
          <p className="text-orange-200 text-sm">Direkt API Test Sistemi</p>
          <div className={`text-xs ${getApiStatusColor()}`}>
            {getApiStatusText()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full flex flex-col gap-8 items-center mt-16 lg:mt-0">
        
        {/* Test Kartları Bilgi Paneli */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-4 text-center">PayTR Direkt API Test Kartları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {PAYTR_TEST_CARDS.map((card, index) => (
              <div key={index} 
                   className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    card.brand === 'visa' ? 'bg-blue-500' :
                    card.brand === 'mastercard' ? 'bg-red-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-white font-semibold text-sm">{card.name}</span>
                </div>
                <div className="space-y-1 text-xs text-white/80">
                  <div>Kart: {card.number}</div>
                  <div>CVV: {card.cvv} | Tarih: {card.expiry}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-yellow-300 text-xs italic">
            Bu kart numaralarından birini girdiğinizde otomatik olarak algılanacak ve test kartı olarak işaretlenecek
          </p>
        </div>

        <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8 items-center">
          {/* Credit Card */}
          <div className="perspective-1000 w-full max-w-md">
            <div 
              className={`relative w-full h-64 transition-all duration-700 transform-style-preserve-3d cursor-pointer hover:scale-105 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front of Card */}
              <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl backface-hidden bg-gradient-to-br ${getCardGradient()} text-white p-6 flex flex-col justify-between overflow-hidden border border-white/20`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-current rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-current rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-current rounded-full"></div>
                </div>
                
                {/* Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      P
                    </div>
                    <span className="font-bold text-sm">PayTR</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">Direkt API</div>
                    <div className="text-lg font-bold">{cardValidation.brand.toUpperCase()}</div>
                    {detectedCard && (
                      <div className="text-xs text-green-300">TEST KARTI</div>
                    )}
                  </div>
                </div>

                {/* Chip */}
                <div className="w-14 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg relative z-10 border border-yellow-600">
                  <div className="absolute inset-1 grid grid-cols-4 grid-rows-3 gap-px p-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-yellow-600 rounded-sm opacity-40"></div>
                    ))}
                  </div>
                </div>

                {/* Card Number */}
                <div className="text-2xl font-mono tracking-wider font-medium relative z-10 text-center">
                  {getDisplayNumber()}
                </div>

                {/* Card Info */}
                <div className="flex justify-between items-end relative z-10">
                  <div className="flex-1">
                    <div className="text-xs opacity-70 mb-1 uppercase tracking-wider">Kart Sahibi</div>
                    <div className="text-sm font-semibold tracking-wide">{getDisplayHolder()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70 mb-1 uppercase tracking-wider">Geçerlilik</div>
                    <div className="text-sm font-semibold">{getDisplayExpiry()}</div>
                  </div>
                </div>

                {/* Card Validation Status */}
                {cardValidation.message && (
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="text-xs text-green-300 font-semibold">
                      {cardValidation.message}
                    </div>
                  </div>
                )}
              </div>

              {/* Back of Card */}
              <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl backface-hidden rotate-y-180 bg-gradient-to-br ${getCardGradient()} text-white overflow-hidden border border-white/20`}>
                {/* Magnetic Strip */}
                <div className="w-full h-12 bg-gradient-to-r from-gray-800 via-black to-gray-800 mt-8 shadow-inner"></div>
                
                <div className="p-6 pt-6">
                  {/* CVV Area */}
                  <div className="bg-white/95 backdrop-blur-sm text-black p-4 rounded-xl mb-6 shadow-lg border">
                    <div className="text-xs mb-2 uppercase tracking-wide font-semibold text-gray-600">CVV Güvenlik Kodu</div>
                    <div className="text-xl font-mono font-bold tracking-wider bg-gray-50 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300">
                      {getDisplayCVV()}
                    </div>
                    <div className="text-xs mt-2 text-gray-500">PayTR Direkt API ile doğrulanacak</div>
                  </div>

                  {/* PayTR Security */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs opacity-80">
                      <div className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span>PayTR Direkt API</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Dinamik Kart Algılama</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-80">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>3D Secure Destekli</span>
                    </div>
                  </div>

                  {/* API Status */}
                  <div className="absolute bottom-4 right-6 text-right">
                    <div className="text-xs opacity-70">API Mode</div>
                    <div className="text-xs font-semibold text-orange-300">Test</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Debug Info */}
            {debugInfo && (
              <div className="backdrop-blur-sm rounded-xl p-4 mb-6 border border-yellow-400/30 bg-yellow-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    🔍
                  </div>
                  <span className="text-sm font-semibold text-yellow-200">
                    Debug Bilgileri
                  </span>
                </div>
                <div className="space-y-2 text-xs text-yellow-100">
                  {debugInfo.hash_string && (
                    <div>• Hash: {debugInfo.hash_string.substring(0, 20)}...</div>
                  )}
                  {debugInfo.token_generated && (
                    <div>• Token: {debugInfo.token_generated.substring(0, 20)}...</div>
                  )}
                  {debugInfo.response_text && (
                    <div>• Response: {debugInfo.response_text}</div>
                  )}
                </div>
              </div>
            )}

            {/* API Response */}
            {apiResponse && (
              <div className={`backdrop-blur-sm rounded-xl p-4 mb-6 border ${
                apiResponse.success 
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30' 
                  : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    apiResponse.success ? 'bg-green-400' : 'bg-red-400'
                  }`}>
                    {apiResponse.success ? '✓' : '✗'}
                  </div>
                  <span className={`text-sm font-semibold ${
                    apiResponse.success ? 'text-green-200' : 'text-red-200'
                  }`}>
                    {apiResponse.success ? 'API Başarılı' : 'API Hatası'}
                  </span>
                </div>
                <div className={`space-y-2 text-xs ${
                  apiResponse.success ? 'text-green-100' : 'text-red-100'
                }`}>
                  <div>• API Türü: {apiResponse.api_type || 'Direkt API'}</div>
                  <div>• Mesaj: {apiResponse.message || apiResponse.error}</div>
                  {apiResponse.token && <div>• Token: {apiResponse.token.substring(0, 20)}...</div>}
                  {apiResponse.test_card_detected && <div>• Test Kartı: Algılandı</div>}
                </div>
              </div>
            )}

            {/* Kart Algılama Durumu */}
            {cardValidation.message && (
              <div className={`backdrop-blur-sm rounded-xl p-4 mb-6 border ${
                detectedCard 
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-400/30' 
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    detectedCard ? 'bg-green-400' : 'bg-blue-400'
                  }`}>
                    {detectedCard ? '✓' : '🔍'}
                  </div>
                  <span className={`text-sm font-semibold ${
                    detectedCard ? 'text-green-200' : 'text-blue-200'
                  }`}>
                    {detectedCard ? 'Test Kartı Algılandı!' : cardValidation.message}
                  </span>
                </div>
                <div className={`space-y-2 text-xs ${
                  detectedCard ? 'text-green-100' : 'text-blue-100'
                }`}>
                  <div>• Kart Türü: {cardValidation.brand.toUpperCase()}</div>
                  <div>• Geçerlilik: {cardValidation.isValid ? 'Geçerli' : 'Geçersiz'}</div>
                  {detectedCard && <div>• Test Modu: Aktif</div>}
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Kart Sahibinin Adı
                </label>
                <input
                  type="text"
                  value={cardData.holder}
                  onChange={(e) => handleInputChange('holder', e.target.value)}
                  placeholder="İsim Soyisim"
                  maxLength={25}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 font-medium"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 font-mono text-lg"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-white mb-2">
                    Son Kullanım
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                    placeholder="AA/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-white mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 font-medium"
                  />
                </div>
              </div>

              {/* API Test Button */}
              <button
                type="button"
                onClick={testPayTRDirektAPI}
                disabled={apiStatus === 'testing'}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                {apiStatus === 'testing' ? 'API Test Ediliyor...' : 'PayTR Direkt API Test Et'}
              </button>

              {/* Payment Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing || !isFormComplete()}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  isProcessing
                    ? 'bg-gray-500 cursor-not-allowed'
                    : isFormComplete()
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 hover:shadow-lg active:scale-95'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white shadow-xl`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ödeme Yapılıyor...</span>
                  </div>
                ) : (
                  'PayTR Direkt API ile Ödeme'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default PayTRDirektAPI;

