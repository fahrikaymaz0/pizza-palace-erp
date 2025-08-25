'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface PremiumCardPaymentProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (msg?: string) => void;
}

export default function PremiumCardPayment({ amount, onSuccess, onError }: PremiumCardPaymentProps) {
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const formattedNumber = useMemo(() => cardNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '' , [cardNumber]);
  const formattedExpiry = useMemo(() => {
    const onlyDigits = expiry.replace(/\D/g, '').slice(0, 4);
    if (onlyDigits.length <= 2) return onlyDigits;
    return `${onlyDigits.slice(0, 2)}/${onlyDigits.slice(2)}`;
  }, [expiry]);

  function validate(): boolean {
    let ok = true;
    if (holderName.trim().length < 3) ok = false;
    if (cardNumber.replace(/\s/g, '').length !== 16) ok = false;
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formattedExpiry)) ok = false;
    if (cvv.trim().length !== 3) ok = false;
    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      onError?.('Lütfen tüm alanları geçerli biçimde doldurun.');
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      onSuccess?.();
    } catch (err) {
      onError?.('Ödeme sırasında hata oluştu');
    } finally {
      setProcessing(false);
    }
  }

  const bgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    let t = 0;
    function animate() {
      t += 0.008;
      if (bgRef.current) {
        bgRef.current.style.background = `radial-gradient(circle at ${25 + Math.sin(t)*5}% 25%, rgba(59,130,246,0.14) 0%, transparent 50%), radial-gradient(circle at ${75 + Math.cos(t*0.8)*5}% 75%, rgba(139,92,246,0.14) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 50%)`;
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative">
      <div ref={bgRef} className="pointer-events-none absolute inset-0 rounded-2xl" />

      {/* Kart */}
      <div className="perspective-[1200px] w-full h-[220px] mb-6">
        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Ön */}
          <div className="absolute inset-0 rounded-2xl p-6 shadow-2xl text-white overflow-hidden bg-gradient-to-br from-slate-800 via-slate-600 to-slate-400 [backface-visibility:hidden]">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-100 font-extrabold tracking-[0.2em]">PREMIUM</div>
              <div className="text-xs font-semibold text-slate-200">PLATINUM</div>
            </div>
            <div className="w-12 h-9 rounded bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-inner mb-6" />
            <div className="font-mono text-lg tracking-widest drop-shadow">
              {formattedNumber || '0000 0000 0000 0000'}
            </div>
            <div className="flex items-end justify-between mt-6">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-200/80">Kart Sahibi</div>
                <div className="text-sm font-semibold">{holderName || 'AD SOYAD'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-200/80">Geçerlilik</div>
                <div className="text-sm font-semibold">{formattedExpiry || 'MM/YY'}</div>
              </div>
            </div>
          </div>
          {/* Arka */}
          <div className="absolute inset-0 rounded-2xl p-6 shadow-2xl text-white overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 rotate-y-180 [backface-visibility:hidden]">
            <div className="-mx-6 h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 mb-4" />
            <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded text-right font-mono tracking-[0.4em] shadow-inner">
              {cvv || '000'}
            </div>
            <p className="mt-4 text-[10px] text-slate-300 text-center">Bu kart uluslararası güvenlik standartlarına uygundur. Yetkisiz kullanımda derhal bildiriniz.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`relative z-10 rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl p-6 space-y-4 ${processing ? 'opacity-70 pointer-events-none' : ''}`}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kart Sahibinin Adı Soyadı</label>
          <input
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ\s]/g, ''))}
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            placeholder="AD SOYAD"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Kart Numarası</label>
          <input
            value={formattedNumber}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
              setCardNumber(digits);
            }}
            maxLength={19}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-mono tracking-widest"
            placeholder="0000 0000 0000 0000"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Son Kullanım</label>
            <input
              value={formattedExpiry}
              onChange={(e) => setExpiry(e.target.value)}
              onBlur={() => {
                if (/^[0-9]{1}$/.test(expiry)) setExpiry(`0${expiry}`);
              }}
              maxLength={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-mono"
              placeholder="AA/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">CVV</label>
            <input
              value={cvv}
              onFocus={() => setFlipped(true)}
              onBlur={() => setTimeout(() => setFlipped(false), 500)}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition font-mono tracking-[0.4em]"
              placeholder="000"
            />
          </div>
        </div>

        <button type="submit" className="w-full mt-2 rounded-xl py-3 font-semibold uppercase tracking-wide text-white bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 shadow-lg hover:brightness-110 transition">
          {processing ? 'İşlem Yapılıyor…' : `₺${amount} Öde`}
        </button>
        <p className="text-xs text-slate-500 text-center">Test modunda simülasyon yapılır. PayTR entegrasyonu bir sonraki adımda bağlanacaktır.</p>
      </form>
    </div>
  );
}
