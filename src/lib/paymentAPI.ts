// PayTR API ile ödeme entegrasyonu (Direkt API + Link API)
export class PayTRPaymentAPI {
    private config: any;

    constructor(config: any) {
        this.config = {
            // PayTR API (Direkt + Link)
            paytr: {
                merchantId: config.paytrMerchantId || process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
                merchantKey: config.paytrMerchantKey || process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
                merchantSalt: config.paytrMerchantSalt || process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
                direktApiUrl: 'https://www.paytr.com/odeme/api/get-token',
                linkApiUrl: 'https://www.paytr.com/odeme/api/get-token',
                testMode: 1 // Canlıya geçerken 0 yapın
            }
        };
    }

    // Ana ödeme fonksiyonu - PayTR Direkt API ile ödeme
    async processPayment(paymentData: any) {
        const { cardNumber, amount, currency = 'TRY', orderRef } = paymentData;
        
        try {
            console.log('🔄 PayTR Direkt API ile ödeme işlemi başlatılıyor...');
            
            // PayTR test kartları kontrolü
            const isTestCard = this.isPayTRTestCard(cardNumber);
            if (isTestCard) {
                console.log('✅ PayTR Test Kartı Algılandı');
                
                // Test kartları için özel simülasyon
                if (this.isTestEnvironment()) {
                    console.log('🎯 Test ortamı - PayTR simülasyonu başlatılıyor...');
                    return await this.simulatePayTRTestPayment(paymentData);
                }
            }
            
            const paymentResult = await this.processPayTRPayment(paymentData);
            return paymentResult;
            
        } catch (error) {
            console.error('❌ PayTR ödeme hatası:', error);
            throw this.handlePaymentError(error);
        }
    }

    // PayTR Link API ile ödeme linki oluştur
    async createPaymentLink(paymentData: any) {
        const { amount, email, user_name, user_address, user_phone, user_basket } = paymentData;
        
        try {
            console.log('🔗 PayTR Link API ile ödeme linki oluşturuluyor...');
            
            // Environment variables kontrolü
            if (this.isTestEnvironment()) {
                console.warn('⚠️ PayTR environment variables ayarlanmamış!');
                console.warn('📝 .env.local dosyasına PayTR bilgilerinizi ekleyin:');
                console.warn('PAYTR_MERCHANT_ID=your_merchant_id');
                console.warn('PAYTR_MERCHANT_KEY=your_merchant_key');
                console.warn('PAYTR_MERCHANT_SALT=your_merchant_salt');
                
                // Test ortamında simülasyon
                return await this.simulatePayTRLinkPayment(paymentData);
            }
            
            const linkResult = await this.processPayTRLinkPayment(paymentData);
            return linkResult;
            
        } catch (error) {
            console.error('❌ PayTR Link API hatası:', error);
            throw this.handlePaymentError(error);
        }
    }

    // PayTR Status Inquiry API ile işlem durumu sorgula
    async checkTransactionStatus(merchantOid: string) {
        try {
            console.log('🔍 PayTR Status Inquiry API ile işlem durumu sorgulanıyor...');
            console.log('📋 Merchant OID:', merchantOid);
            
            // Environment variables kontrolü
            if (this.isTestEnvironment()) {
                console.log('🎮 Test ortamında simüle edilmiş durum sorgusu');
                return await this.simulatePayTRStatusInquiry(merchantOid);
            }
            
            const statusResult = await this.processPayTRStatusInquiry(merchantOid);
            return statusResult;
            
        } catch (error) {
            console.error('❌ PayTR Status Inquiry API hatası:', error);
            throw this.handlePaymentError(error);
        }
    }

    // Test ortamı kontrolü
    isTestEnvironment() {
        return this.config.paytr.merchantId === 'YOUR_MERCHANT_ID' || 
               this.config.paytr.merchantKey === 'YOUR_MERCHANT_KEY' || 
               this.config.paytr.merchantSalt === 'YOUR_MERCHANT_SALT';
    }

    // PayTR test kartları için simülasyon
    async simulatePayTRTestPayment(paymentData: any) {
        const { cardNumber, amount } = paymentData;
        
        console.log('🎮 PayTR Test Kartı Simülasyonu...');
        
        // Simüle edilmiş işlem gecikmesi
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test kartı türünü belirle
        const cardType = this.identifyCardType(cardNumber);
        
        return {
            success: true,
            transactionId: `PAYTR_TEST_${Date.now()}`,
            authCode: 'PAYTR_TEST_AUTH_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            bank: cardType.bank,
            amount: amount,
            message: "PayTR Direkt API test ödeme başarıyla simüle edildi",
            token: 'PAYTR_TEST_TOKEN_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            isTestCard: true,
            isSimulated: true,
            cardType: cardType.type,
            testMode: true
        };
    }

    // PayTR Link API için simülasyon
    async simulatePayTRLinkPayment(paymentData: any) {
        const { amount, email, user_name } = paymentData;
        
        console.log('🎮 PayTR Link API Simülasyonu...');
        
        // Simüle edilmiş işlem gecikmesi
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const testToken = 'PAYTR_LINK_TEST_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const paymentUrl = `https://www.paytr.com/odeme/guvenli/${testToken}`;
        
        return {
            success: true,
            token: testToken,
            payment_url: paymentUrl,
            transactionId: `PAYTR_LINK_${Date.now()}`,
            amount: amount,
            message: "PayTR Link API test ödeme linki başarıyla simüle edildi",
            isSimulated: true,
            testMode: true,
            email: email,
            user_name: user_name
        };
    }

    // PayTR Status Inquiry için simülasyon
    async simulatePayTRStatusInquiry(merchantOid: string) {
        console.log('🎮 PayTR Status Inquiry Simülasyonu...');
        
        // Simüle edilmiş işlem gecikmesi
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            status: 'success',
            merchant_oid: merchantOid,
            total_amount: '10000',
            payment_type: 'card',
            currency: 'TL',
            test_mode: true,
            is_simulated: true,
            message: 'Test ortamında simüle edilmiş durum sorgusu',
            debug_info: {
                note: 'Environment variables ayarlanmamış - simüle edilmiş yanıt',
                merchant_oid: merchantOid
            }
        };
    }

    // PayTR Status Inquiry API ile işlem durumu sorgula
    async processPayTRStatusInquiry(merchantOid: string) {
        const payload = {
            merchant_id: this.config.paytr.merchantId,
            merchant_oid: merchantOid,
            test_mode: this.config.paytr.testMode.toString()
        };
        
        // Hash oluşturma (PayTR Status Inquiry API'nin beklediği format)
        const hashString = `${payload.merchant_id}${merchantOid}${payload.test_mode}${this.config.paytr.merchantSalt}`;
        const paytrToken = await this.generatePayTRSignature(hashString);
        
        // PayTR Status Inquiry API'ye istek gönder
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        formData.append('paytr_token', paytrToken);
        
        console.log('📡 PayTR Status Inquiry API isteği gönderiliyor...');
        console.log('Hash String:', hashString);
        console.log('Token:', paytrToken);
        
        const response = await fetch('https://www.paytr.com/odeme/api/get-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        const result = await response.text();
        console.log('📥 PayTR Status Inquiry API yanıtı:', result);
        
        // PayTR Status Inquiry response parsing
        if (result.startsWith('success:')) {
            const statusData = result.split(':')[1];
            const statusParts = statusData.split('|');
            
            // PayTR Status Inquiry yanıt formatı: success:status|total_amount|payment_type|currency
            const status = statusParts[0];
            const total_amount = statusParts[1];
            const payment_type = statusParts[2];
            const currency = statusParts[3];
            
            return {
                success: true,
                status: status,
                merchant_oid: merchantOid,
                total_amount: total_amount,
                payment_type: payment_type,
                currency: currency,
                test_mode: this.config.paytr.testMode === 1 ? 'Test Modu' : 'Canlı Mod',
                message: `İşlem durumu: ${status}`,
                debug_info: {
                    hash_string: hashString,
                    token_generated: paytrToken,
                    raw_response: result
                }
            };
        } else {
            throw new Error(`PAYTR_STATUS_ERROR: ${result}`);
        }
    }

    // PayTR Link API ile ödeme linki oluştur
    async processPayTRLinkPayment(paymentData: any) {
        const { amount, email, user_name, user_address, user_phone, user_basket } = paymentData;
        
        // Kullanıcı IP'sini al
        const userIP = await this.getClientIP();
        
        const payload = {
            merchant_id: this.config.paytr.merchantId,
            user_ip: userIP,
            merchant_oid: `PAYTR_LINK_${Date.now()}`,
            email: email || 'test@paytr.com',
            payment_amount: Math.round(amount * 100), // kuruş cinsinden
            payment_type: 'card',
            installment_count: '0',
            currency: 'TL',
            test_mode: this.config.paytr.testMode.toString(),
            non_3d: '0',
            merchant_ok_url: `${window.location.origin}/success`,
            merchant_fail_url: `${window.location.origin}/fail`,
            user_name: user_name || 'Test User',
            user_address: user_address || 'Test Address',
            user_phone: user_phone || '05555555555',
            user_basket: user_basket || JSON.stringify([['Test Product', amount.toFixed(2), 1]]),
            timeout_limit: '30',
            debug_on: '1',
            client_lang: 'tr',
            no_installment: '0',
            max_installment: '0',
            currency_rate: '1',
            lang: 'tr'
        };
        
        // Hash oluşturma (PayTR Link API'nin beklediği format)
        const hashString = `${payload.merchant_id}${payload.user_ip}${payload.merchant_oid}${payload.email}${payload.payment_amount}${payload.user_basket}${payload.test_mode}${this.config.paytr.merchantSalt}`;
        const paytrToken = await this.generatePayTRSignature(hashString);
        
        // PayTR Link API'ye istek gönder
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        formData.append('paytr_token', paytrToken);
        
        console.log('📡 PayTR Link API isteği gönderiliyor...');
        console.log('Hash String:', hashString);
        console.log('Token:', paytrToken);
        
        const response = await fetch(this.config.paytr.linkApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        const result = await response.text();
        console.log('📥 PayTR Link API yanıtı:', result);
        
        // PayTR response parsing
        if (result.startsWith('success:')) {
            const token = result.split(':')[1];
            const paymentUrl = `https://www.paytr.com/odeme/guvenli/${token}`;
            
            console.log('✅ PayTR Link Token alındı:', token);
            console.log('🔗 Ödeme URL:', paymentUrl);
            
            return {
                success: true,
                token: token,
                payment_url: paymentUrl,
                transactionId: `PAYTR_LINK_${Date.now()}`,
                amount: amount,
                message: "PayTR Link API ödeme linki başarıyla oluşturuldu",
                email: email,
                user_name: user_name
            };
        } else {
            throw new Error(`PAYTR_LINK_ERROR: ${result}`);
        }
    }

    // PayTR Direkt API ile ödeme
    async processPayTRPayment(paymentData: any) {
        const { cardNumber, expiryMonth, expiryYear, cvv, cardHolder, amount } = paymentData;
        
        // Environment variables kontrolü
        if (this.isTestEnvironment()) {
            console.warn('⚠️ PayTR environment variables ayarlanmamış!');
            console.warn('📝 .env.local dosyasına PayTR bilgilerinizi ekleyin:');
            console.warn('PAYTR_MERCHANT_ID=your_merchant_id');
            console.warn('PAYTR_MERCHANT_KEY=your_merchant_key');
            console.warn('PAYTR_MERCHANT_SALT=your_merchant_salt');
            
            // Test kartı ise simülasyon yap
            if (this.isPayTRTestCard(cardNumber)) {
                return await this.simulatePayTRTestPayment(paymentData);
            }
            
            throw new Error('ENV_ERROR: PayTR environment variables ayarlanmamış');
        }
        
        // Kullanıcı IP'sini al
        const userIP = await this.getClientIP();
        
        const payload = {
            merchant_id: this.config.paytr.merchantId,
            user_ip: userIP,
            merchant_oid: `PAYTR_${Date.now()}`,
            email: paymentData.email || 'test@paytr.com',
            payment_amount: Math.round(amount * 100), // kuruş cinsinden
            payment_type: 'card',
            installment_count: '0',
            currency: 'TL',
            test_mode: this.config.paytr.testMode.toString(),
            non_3d: '0',
            
            // Kart bilgileri
            cc_owner: cardHolder,
            card_number: cardNumber.replace(/\s/g, ''),
            expiry_month: expiryMonth,
            expiry_year: expiryYear,
            cvv: cvv,
            
            // Callback URL'leri
            merchant_ok_url: `${window.location.origin}/success`,
            merchant_fail_url: `${window.location.origin}/fail`,
            
            // Kullanıcı bilgileri
            user_name: cardHolder,
            user_address: paymentData.address || 'Test Address',
            user_phone: paymentData.phone || '05555555555',
            user_basket: JSON.stringify([['Test Product', amount.toFixed(2), 1]]),
            
            // Debug ve dil ayarları
            debug_on: '1',
            client_lang: 'tr'
        };
        
        // Hash oluşturma (PayTR Direkt API'nin beklediği format)
        const hashString = `${payload.merchant_id}${payload.user_ip}${payload.merchant_oid}${payload.email}${payload.payment_amount}${payload.user_basket}${payload.test_mode}${this.config.paytr.merchantSalt}`;
        const paytrToken = await this.generatePayTRSignature(hashString);
        
        // PayTR API'ye istek gönder
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        formData.append('paytr_token', paytrToken);
        
        console.log('📡 PayTR API isteği gönderiliyor...');
        console.log('Hash String:', hashString);
        console.log('Token:', paytrToken);
        
        const response = await fetch(this.config.paytr.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        const result = await response.text();
        console.log('📥 PayTR API yanıtı:', result);
        
        // PayTR response parsing
        if (result.startsWith('success:')) {
            const token = result.split(':')[1];
            console.log('✅ PayTR Token alındı:', token);
            
            // PayTR'ye POST request ile ödeme sayfasına yönlendir
            return await this.completePayTRPayment(token, payload, paymentData);
        } else {
            throw new Error(`PAYTR_ERROR: ${result}`);
        }
    }

    // PayTR ödeme tamamlama
    async completePayTRPayment(token: string, payload: any, paymentData: any) {
        // Test modunda simüle edilmiş başarılı ödeme
        if (this.config.paytr.testMode === 1) {
            return {
                success: true,
                transactionId: `PAYTR_${Date.now()}`,
                authCode: 'PAYTR_TEST_AUTH',
                bank: 'PayTR Direkt API',
                amount: paymentData.amount,
                message: "PayTR Direkt API test ödeme başarıyla tamamlandı",
                token: token,
                isTestCard: this.isPayTRTestCard(paymentData.cardNumber)
            };
        } else {
            // Canlı modda PayTR'ye yönlendir
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://www.paytr.com/odeme';
            
            const formData = {
                ...payload,
                paytr_token: token
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
            
            return {
                success: true,
                transactionId: `PAYTR_${Date.now()}`,
                authCode: 'PAYTR_REDIRECT',
                bank: 'PayTR Direkt API',
                amount: paymentData.amount,
                message: "PayTR ödeme sayfasına yönlendiriliyor...",
                token: token
            };
        }
    }

    // PayTR test kartları kontrolü
    isPayTRTestCard(cardNumber: string) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        const testCards = [
            '4355084355084358', // VISA Test - PayTR Resmi
            '5406675406675403', // MasterCard Test - PayTR Resmi
            '9792030394440796'  // Troy Test - PayTR Resmi
        ];
        
        return testCards.includes(cleanNumber);
    }

    // PayTR kart türü algılama
    identifyCardType(cardNumber: string) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        
        // PayTR Test Kartları
        if (this.isPayTRTestCard(cleanNumber)) {
            if (cleanNumber === '4355084355084358') {
                return { bank: "PayTR Test", type: "VISA", subType: "TEST" };
            } else if (cleanNumber === '5406675406675403') {
                return { bank: "PayTR Test", type: "MASTERCARD", subType: "TEST" };
            } else if (cleanNumber === '9792030394440796') {
                return { bank: "PayTR Test", type: "TROY", subType: "TEST" };
            }
        }
        
        // Genel kart türleri
        if (cleanNumber.startsWith('4')) {
            return { bank: "VISA Kart", type: "VISA", subType: "CLASSIC" };
        }
        if (cleanNumber.startsWith('5')) {
            return { bank: "Mastercard", type: "MASTERCARD", subType: "CLASSIC" };
        }
        if (cleanNumber.startsWith('9792')) {
            return { bank: "Troy Kart", type: "TROY", subType: "CLASSIC" };
        }
        
        return { bank: "Bilinmeyen Kart", type: "UNKNOWN", subType: "UNKNOWN" };
    }

    // Yardımcı fonksiyonlar
    async generatePayTRSignature(hashString: string) {
        // HMAC-SHA256 ile imza oluştur
        const encoder = new TextEncoder();
        const keyData = encoder.encode(this.config.paytr.merchantKey);
        const messageData = encoder.encode(hashString);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(signature))));
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('IP alınamadı:', error);
            return '127.0.0.1';
        }
    }

    handlePaymentError(error: any) {
        const errorMap: { [key: string]: string } = {
            'INSUFFICIENT_FUNDS': 'Yetersiz bakiye',
            'INVALID_CARD': 'Geçersiz kart bilgileri',
            'EXPIRED_CARD': 'Kart süresi dolmuş',
            'PAYTR_ERROR': 'PayTR sistemi hatası',
            'ENV_ERROR': 'PayTR environment variables ayarlanmamış',
            'NETWORK_ERROR': 'Ağ bağlantı hatası'
        };
        
        return {
            success: false,
            error: error.message,
            friendlyMessage: errorMap[error.message.split(':')[0]] || 'PayTR ödeme işlemi başarısız'
        };
    }
}

// Test ödeme fonksiyonu (Direkt API)
export async function makeTestPayment(cardData: any, amount: number) {
    const paymentAPI = new PayTRPaymentAPI({
        // PayTR API bilgileri (environment variables'dan alınır)
        paytrMerchantId: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
        paytrMerchantKey: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
        paytrMerchantSalt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT'
    });

    try {
        console.log('🔄 PayTR Direkt API test ödeme başlatılıyor...');
        console.log('Kart Numarası:', cardData.cardNumber);
        console.log('Tutar:', amount);
        
        const result = await paymentAPI.processPayment({
            cardNumber: cardData.cardNumber,
            expiryMonth: cardData.expiryDate.split('/')[0],
            expiryYear: cardData.expiryDate.split('/')[1],
            cvv: cardData.cvv,
            cardHolder: cardData.cardHolder,
            amount: amount,
            email: 'test@paytr.com',
            address: 'Test Address',
            phone: '05555555555'
        });

        if (result.success) {
            console.log('✅ PayTR test ödeme başarılı!');
            console.log(`İşlem No: ${result.transactionId}`);
            console.log(`Banka: ${result.bank}`);
            console.log(`Tutar: ₺${result.amount}`);
            if (result.isTestCard) {
                console.log('🎯 PayTR Test Kartı kullanıldı');
            }
            if ((result as any).isSimulated) {
                console.log('🎮 Simüle edilmiş test ödeme');
            }
        }

        return result;
        
    } catch (error) {
        console.error('❌ PayTR test ödeme hatası:', error);
        return error;
    }
}

// Test ödeme linki oluşturma fonksiyonu (Link API)
export async function createTestPaymentLink(paymentData: any) {
    const paymentAPI = new PayTRPaymentAPI({
        // PayTR API bilgileri (environment variables'dan alınır)
        paytrMerchantId: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
        paytrMerchantKey: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
        paytrMerchantSalt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT'
    });

    try {
        console.log('🔗 PayTR Link API test ödeme linki oluşturuluyor...');
        console.log('Email:', paymentData.email);
        console.log('Tutar:', paymentData.amount);
        console.log('Kullanıcı:', paymentData.user_name);
        
        const result = await paymentAPI.createPaymentLink({
            amount: paymentData.amount,
            email: paymentData.email,
            user_name: paymentData.user_name,
            user_address: paymentData.user_address,
            user_phone: paymentData.user_phone,
            user_basket: paymentData.user_basket
        });

        if (result.success) {
            console.log('✅ PayTR Link API test linki başarılı!');
            console.log(`İşlem No: ${result.transactionId}`);
            console.log(`Ödeme URL: ${result.payment_url}`);
            console.log(`Token: ${result.token}`);
            if ((result as any).isSimulated) {
                console.log('🎮 Simüle edilmiş test link');
            }
        }

        return result;
        
    } catch (error) {
        console.error('❌ PayTR Link API test hatası:', error);
        return error;
    }
}

// Test işlem durumu sorgulama fonksiyonu (Status Inquiry API)
export async function checkTestTransactionStatus(merchantOid: string) {
    const paymentAPI = new PayTRPaymentAPI({
        // PayTR API bilgileri (environment variables'dan alınır)
        paytrMerchantId: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
        paytrMerchantKey: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
        paytrMerchantSalt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT'
    });

    try {
        console.log('🔍 PayTR Status Inquiry API test işlem durumu sorgulanıyor...');
        console.log('Merchant OID:', merchantOid);
        
        const result = await paymentAPI.checkTransactionStatus(merchantOid);

        if (result.success) {
            console.log('✅ PayTR Status Inquiry API test sorgusu başarılı!');
            console.log(`İşlem No: ${result.merchant_oid}`);
            console.log(`Durum: ${result.status}`);
            console.log(`Tutar: ₺${(parseInt(result.total_amount) / 100).toFixed(2)}`);
            console.log(`Ödeme Türü: ${result.payment_type}`);
            if ((result as any).is_simulated) {
                console.log('🎮 Simüle edilmiş test sorgusu');
            }
        }

        return result;
        
    } catch (error) {
        console.error('❌ PayTR Status Inquiry API test hatası:', error);
        return error;
    }
}


