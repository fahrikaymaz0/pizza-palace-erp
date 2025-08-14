'use client';

import { useState, useRef, useEffect } from 'react';

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export default function VerificationCodeInput({
  length = 6,
  onComplete,
  onResend,
  isLoading = false,
  error,
  success,
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // İlk input'a focus ol
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    // Kod tamamlandığında callback'i çağır
    const fullCode = code.join('');
    if (fullCode.length === length) {
      onComplete(fullCode);
    }
  }, [code, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    // Sadece rakam kabul et
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Sonraki input'a geç
    if (value && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Backspace ile önceki input'a geç
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');

    if (pastedData.length === length) {
      const newCode = pastedData.split('').slice(0, length);
      setCode(newCode);
      setFocusedIndex(length - 1);
      inputRefs.current[length - 1]?.focus();
    }
  };

  const clearCode = () => {
    setCode(new Array(length).fill(''));
    setFocusedIndex(0);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Kod Giriş Alanları */}
      <div className="flex justify-center space-x-3">
        {code.map((digit, index) => (
          <div key={index} className="relative">
            <input
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(index)}
              className={`
                w-12 h-12 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300
                ${
                  focusedIndex === index
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-300 bg-white text-gray-700'
                }
                ${error ? 'border-red-500 bg-red-50' : ''}
                ${success ? 'border-green-500 bg-green-50' : ''}
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              disabled={isLoading}
            />
            {/* Animasyonlu alt çizgi */}
            <div
              className={`
              absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300
              ${
                focusedIndex === index
                  ? 'bg-orange-500 scale-x-100'
                  : 'bg-transparent scale-x-0'
              }
            `}
            />
          </div>
        ))}
      </div>

      {/* Mesajlar */}
      {error && (
        <div className="text-center">
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="text-center">
          <p className="text-green-500 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={clearCode}
          disabled={isLoading}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 disabled:opacity-50"
        >
          Temizle
        </button>

        <button
          onClick={onResend}
          disabled={isLoading}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 disabled:opacity-50"
        >
          Tekrar Gönder
        </button>
      </div>

      {/* Güvenlik Uyarısı */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          🔒 Bu kodu kimseyle paylaşmayınız. Kod 5 dakika geçerlidir.
        </p>
      </div>

      {/* Loading Animasyonu */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
