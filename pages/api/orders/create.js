export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST istekleri destekleniyor' });
  }

  try {
    const { items, customer, delivery, payment, total } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sipariş öğeleri gereklidir' 
      });
    }

    if (!customer.name || !customer.phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Müşteri adı ve telefonu gereklidir' 
      });
    }

    if (delivery.type === 'delivery' && !delivery.address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Teslimat adresi gereklidir' 
      });
    }

    // Sipariş numarası oluştur
    const orderNumber = 'SP' + Date.now().toString().slice(-6);

    // Siparişi veritabanına kaydet (burada örnek veri kullanıyoruz)
    const orderData = {
      orderNumber,
      items,
      customer,
      delivery,
      payment,
      total,
      status: 'received', // received, preparing, cooking, delivery, completed
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: delivery.type === 'delivery' ? 45 : 20 // dakika
    };

    // Burada normalde veritabanına kaydedersiniz
    // await Order.create(orderData);

    // E-posta/SMS bildirimi gönder (isteğe bağlı)
    // await sendOrderConfirmation(customer.email, orderData);

    // WhatsApp bildirimi gönder (isteğe bağlı)
    // await sendWhatsAppNotification(customer.phone, orderData);

    res.status(200).json({ 
      success: true, 
      message: 'Siparişiniz başarıyla alındı!',
      order: {
        orderNumber,
        status: orderData.status,
        estimatedDeliveryTime: orderData.estimatedDeliveryTime,
        total
      }
    });

  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sipariş işlemi sırasında bir hata oluştu.' 
    });
  }
}