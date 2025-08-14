'use client';

import React, { useState, useEffect } from 'react';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  focused: string;
}

export default function CreditCard({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  focused,
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [detectedCard, setDetectedCard] = useState<any>(null);

  // PayTR Test Kartları (Resmi Dokümantasyon)
  const paytrTestCards = {
    '4355084355084358': {
      bank: 'PayTR Test',
      type: 'VISA',
      subType: 'TEST',
      class: 'paytr-test',
      code: 'PAYTR',
      description: 'PayTR VISA test kartı - Direkt API',
    },
    '5406675406675403': {
      bank: 'PayTR Test',
      type: 'MASTERCARD',
      subType: 'TEST',
      class: 'paytr-test',
      code: 'PAYTR',
      description: 'PayTR MasterCard test kartı - Direkt API',
    },
    '9792030394440796': {
      bank: 'PayTR Test',
      type: 'TROY',
      subType: 'TEST',
      class: 'paytr-test',
      code: 'PAYTR',
      description: 'PayTR Troy test kartı - Direkt API',
    },
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
  };

  // Detect card type from number
  const detectCard = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');

    // PayTR Test Kartları
    if (paytrTestCards[cleanNumber as keyof typeof paytrTestCards]) {
      return paytrTestCards[cleanNumber as keyof typeof paytrTestCards];
    }

    // Genel kart türleri
    if (cleanNumber.startsWith('4')) {
      return {
        bank: 'VISA Kart',
        type: 'VISA',
        subType: 'CLASSIC',
        class: 'default',
        code: 'VISA',
      };
    }
    if (cleanNumber.startsWith('5')) {
      return {
        bank: 'Mastercard',
        type: 'MASTERCARD',
        subType: 'CLASSIC',
        class: 'default',
        code: 'MC',
      };
    }
    if (cleanNumber.startsWith('9792')) {
      return {
        bank: 'Troy Kart',
        type: 'TROY',
        subType: 'CLASSIC',
        class: 'default',
        code: 'TROY',
      };
    }

    return null;
  };

  // CVV alanına odaklanıldığında kartı çevir
  useEffect(() => {
    if (focused === 'cvv') {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [focused]);

  // Kart numarası değiştiğinde kart tespiti
  useEffect(() => {
    if (cardNumber.length >= 6) {
      const cleanNumber = cardNumber.replace(/\s+/g, '');
      const cardInfo = detectCard(cleanNumber);
      if (cardInfo) {
        setDetectedCard(cardInfo);
      }
    } else {
      setDetectedCard(null);
    }
  }, [cardNumber]); // Infinite loop'u önlemek için dependency'yi sadece cardNumber yaptım

  // Get card styling class
  const getCardClass = () => {
    if (!detectedCard) return 'bg-gradient-to-br from-blue-600 to-purple-700';

    if (detectedCard.class === 'paytr-test') {
      return 'bg-gradient-to-br from-orange-500 to-red-600 text-white';
    }

    const classMap: { [key: string]: string } = {
      default: 'bg-gradient-to-br from-gray-600 to-gray-800',
    };

    return classMap[detectedCard.class] || classMap.default;
  };

  // Get display values
  const getDisplayNumber = () => cardNumber || '•••• •••• •••• ••••';
  const getDisplayHolder = () => cardHolder || 'İSİM SOYİSİM';
  const getDisplayExpiry = () => expiryDate || 'AA/YY';
  const getDisplayCVV = () => cvv || '•••';
  const getBankName = () => (detectedCard ? detectedCard.bank : 'PayTR');
  const getCardType = () => (detectedCard ? detectedCard.subType : 'CLASSIC');
  const getCardBrand = () => (detectedCard ? detectedCard.type : 'VISA');

  return (
    <div className="perspective-1000 w-full max-w-md">
      <div
        className={`relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl backface-hidden ${getCardClass()} text-white p-6 flex flex-col justify-between overflow-hidden`}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>

          {/* Bank Info */}
          <div className="flex justify-between items-start relative z-10">
            <div className="text-lg font-bold tracking-wider">
              {getBankName()}
            </div>
            <div className="text-right text-xs opacity-90">
              <div>{getCardType()}</div>
              <div className="font-bold text-sm mt-1">{getCardBrand()}</div>
              {detectedCard?.class === 'paytr-test' && (
                <div className="text-xs text-yellow-300 font-bold">
                  TEST KARTI
                </div>
              )}
            </div>
          </div>

          {/* Chip */}
          <div className="w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-inner relative z-10">
            <div className="absolute inset-1 border border-yellow-600 rounded opacity-50"></div>
            <div className="absolute inset-2 grid grid-cols-3 grid-rows-2 gap-px">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-yellow-600 rounded-sm opacity-30"
                ></div>
              ))}
            </div>
          </div>

          {/* Card Number */}
          <div className="text-xl font-mono tracking-widest font-medium relative z-10">
            {getDisplayNumber()}
          </div>

          {/* Card Info */}
          <div className="flex justify-between items-end relative z-10">
            <div className="flex-1">
              <div className="text-xs opacity-80 mb-1 uppercase tracking-wide font-medium">
                Kart Sahibi
              </div>
              <div className="text-sm font-semibold tracking-wide">
                {getDisplayHolder()}
              </div>
            </div>
            <div className="text-center mx-4">
              <div className="text-xs opacity-80 mb-1 uppercase tracking-wide font-medium">
                Son Kullanım
              </div>
              <div className="text-sm font-semibold">{getDisplayExpiry()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1 uppercase tracking-wide font-medium">
                Ağ
              </div>
              <div className="text-sm font-bold">{getCardBrand()}</div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl backface-hidden rotate-y-180 ${getCardClass()} text-white overflow-hidden`}
        >
          {/* Magnetic Strip */}
          <div className="w-full h-12 bg-gradient-to-r from-gray-800 via-black to-gray-800 mt-6 shadow-inner"></div>

          <div className="p-6 pt-4">
            {/* CVV Area */}
            <div className="bg-white/95 backdrop-blur-sm text-black p-4 rounded-lg mb-4 shadow-lg">
              <div className="text-xs mb-2 uppercase tracking-wide font-semibold text-gray-600">
                CVV / CVC
              </div>
              <div className="text-lg font-mono font-bold tracking-wider bg-gray-100 px-3 py-1 rounded border-2 border-dashed border-gray-300">
                {getDisplayCVV()}
              </div>
              <div className="text-xs mt-2 text-gray-500">
                PayTR Direkt API ile doğrulanacak
              </div>
            </div>

            {/* Signature Strip */}
            <div className="bg-gray-100 h-10 rounded mb-4 flex items-center px-4 text-black text-sm italic shadow-inner border-t border-gray-300">
              <span className="text-gray-600">Authorized Signature</span>
            </div>

            {/* Security Features */}
            <div className="space-y-2">
              <div className="text-xs opacity-80 leading-relaxed">
                {getBankName()}
              </div>
              <div className="text-xs opacity-70 leading-relaxed">
                Bu kartı sadece yetkili kişi kullanabilir. PayTR Direkt API ile
                güvenli ödeme.
              </div>
              <div className="text-xs opacity-70 mt-3">
                PayTR Direkt API Test Sistemi
              </div>
            </div>

            {/* Security Hologram Area */}
            <div className="absolute bottom-4 right-6 w-12 h-8 bg-gradient-to-br from-silver-400 via-white to-silver-400 rounded border opacity-60 flex items-center justify-center">
              <div className="text-xs font-bold text-gray-600">PAYTR</div>
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

        @keyframes shine {
          0% {
            transform: translateX(-150%) translateY(-150%) rotate(30deg);
          }
          100% {
            transform: translateX(150%) translateY(150%) rotate(30deg);
          }
        }

        .animate-shine {
          animation: shine 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .card:hover {
          animation: float 2s ease-in-out infinite;
        }

        /* Responsive breakpoints */
        @media (max-width: 640px) {
          .perspective-1000 {
            perspective: 800px;
          }
        }
      `}</style>
    </div>
  );
}
