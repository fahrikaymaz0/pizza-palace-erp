'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Clock, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Utensils,
  Home
} from 'lucide-react';

interface OrderFlowProps {
  cartItems: any[];
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

const OrderFlow: React.FC<OrderFlowProps> = ({ cartItems, isOpen, onClose, totalPrice }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    },
    deliveryInfo: {
      type: 'delivery', // delivery or pickup
      address: '',
      city: '',
      district: '',
      notes: ''
    },
    paymentInfo: {
      method: 'cash', // cash, card, online
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  const steps = [
    { id: 1, title: 'Sipariş Özeti', icon: ShoppingCart },
    { id: 2, title: 'Müşteri Bilgileri', icon: User },
    { id: 3, title: 'Teslimat', icon: MapPin },
    { id: 4, title: 'Ödeme', icon: CreditCard },
    { id: 5, title: 'Onay', icon: CheckCircle }
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitOrder = async () => {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customer: orderData.customerInfo,
          delivery: orderData.deliveryInfo,
          payment: orderData.paymentInfo,
          total: totalPrice
        })
      });

      const result = await response.json();
      if (result.success) {
        setCurrentStep(5);
      }
    } catch (error) {
      console.error('Sipariş hatası:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Sipariş Ver</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${currentStep >= step.id 
                    ? 'bg-white text-red-600 border-white' 
                    : 'border-white/50 text-white/50'
                  }
                `}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-1 mx-2 transition-all
                    ${currentStep > step.id ? 'bg-white' : 'bg-white/30'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Sipariş Özeti */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sipariş Özeti</h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Adet: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{item.price * item.quantity} ₺</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Toplam:</span>
                    <span className="text-red-600">{totalPrice} ₺</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Müşteri Bilgileri */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Müşteri Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      value={orderData.customerInfo.name}
                      onChange={(e) => handleInputChange('customerInfo', 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={orderData.customerInfo.phone}
                      onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">E-posta (İsteğe bağlı)</label>
                    <input
                      type="email"
                      value={orderData.customerInfo.email}
                      onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Teslimat */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Teslimat Seçenekleri</h3>
                
                {/* Delivery Type */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('deliveryInfo', 'type', 'delivery')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      orderData.deliveryInfo.type === 'delivery'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Home className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <p className="font-semibold">Eve Teslimat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">30-45 dakika</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('deliveryInfo', 'type', 'pickup')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      orderData.deliveryInfo.type === 'pickup'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Utensils className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <p className="font-semibold">Gel Al</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">15-20 dakika</p>
                  </button>
                </div>

                {/* Address Fields */}
                {orderData.deliveryInfo.type === 'delivery' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Adres</label>
                      <textarea
                        value={orderData.deliveryInfo.address}
                        onChange={(e) => handleInputChange('deliveryInfo', 'address', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        rows={3}
                        placeholder="Teslimat adresinizi detaylı olarak yazın"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">İl</label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.city}
                          onChange={(e) => handleInputChange('deliveryInfo', 'city', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="İl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">İlçe</label>
                        <input
                          type="text"
                          value={orderData.deliveryInfo.district}
                          onChange={(e) => handleInputChange('deliveryInfo', 'district', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="İlçe"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Ödeme */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ödeme Yöntemi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleInputChange('paymentInfo', 'method', 'cash')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      orderData.paymentInfo.method === 'cash'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">💵</div>
                    <p className="font-semibold">Nakit</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kapıda ödeme</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('paymentInfo', 'method', 'card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      orderData.paymentInfo.method === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">Kredi Kartı</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kapıda kart</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('paymentInfo', 'method', 'online')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      orderData.paymentInfo.method === 'online'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <p className="font-semibold">Online</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Şimdi öde</p>
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Toplam Tutar:</span>
                    <span className="text-2xl font-bold text-red-600">{totalPrice} ₺</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Onay */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Siparişiniz Alındı!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Siparişiniz başarıyla alındı. Tahmini teslimat süresi: 30-45 dakika.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sipariş No: #12345</p>
                  <p className="text-lg font-semibold">Toplam: {totalPrice} ₺</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {currentStep < 5 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>

            <button
              onClick={currentStep === 4 ? submitOrder : nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {currentStep === 4 ? 'Siparişi Tamamla' : 'İlerle'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderFlow;
