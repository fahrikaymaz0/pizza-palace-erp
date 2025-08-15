'use client';

import React, { useState } from 'react';
import { ImageToBase64 } from '../../lib/imageToBase64';

export default function ConvertImagesPage() {
  const [convertedImages, setConvertedImages] = useState<{ [key: string]: string }>({});
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<string>('');

  // Mevcut resimleriniz
  const currentImages = {
    domates: '/düşenpng/domates.png',
    biber: '/düşenpng/biber.png',
    mantar: '/düşenpng/mantar.png',
    mısır: '/düşenpng/mısır.png',
    sucuk: '/düşenpng/sucuk.png',
    zeytin: '/düşenpng/zeytin.png',
  };

  const handleConvertImages = async () => {
    setIsConverting(true);
    setResults('');

    try {
      console.log('🔄 Resimler dönüştürülüyor...');
      
      const base64Images = await ImageToBase64.convertImagesToBase64(currentImages);
      setConvertedImages(base64Images);

      // Sonuçları göster
      let resultText = '✅ Dönüştürme tamamlandı!\n\n';
      
      for (const [key, base64] of Object.entries(base64Images)) {
        const size = ImageToBase64.getBase64Size(base64);
        resultText += `${key}: ${size.toFixed(2)} KB\n`;
      }

      resultText += '\n📋 Base64 kodları:\n';
      resultText += 'const INGREDIENT_BASE64 = {\n';
      
      for (const [key, base64] of Object.entries(base64Images)) {
        resultText += `  ${key}: '${base64}',\n`;
      }
      
      resultText += '};';

      setResults(resultText);
      console.log('✅ Tüm resimler dönüştürüldü!');

    } catch (error) {
      console.error('❌ Dönüştürme hatası:', error);
      setResults(`❌ Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results);
    alert('Kod panoya kopyalandı!');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resimleri Base64'e Çevir</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mevcut Resimler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mevcut Resimler</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(currentImages).map(([key, url]) => (
              <div key={key} className="text-center">
                <img 
                  src={url} 
                  alt={key}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <p className="text-sm font-medium">{key}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleConvertImages}
            disabled={isConverting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isConverting ? '🔄 Dönüştürülüyor...' : '🔄 Base64\'e Çevir'}
          </button>
        </div>

        {/* Dönüştürülen Resimler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dönüştürülen Resimler</h2>
          
          {Object.keys(convertedImages).length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(convertedImages).map(([key, base64]) => (
                <div key={key} className="text-center">
                  <img 
                    src={base64} 
                    alt={key}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-xs text-gray-500">
                    {ImageToBase64.getBase64Size(base64).toFixed(2)} KB
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Henüz dönüştürülmedi</p>
          )}
        </div>
      </div>

      {/* Sonuçlar */}
      {results && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Base64 Kodları</h2>
            <button
              onClick={copyToClipboard}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              📋 Kopyala
            </button>
          </div>
          
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
            {results}
          </pre>
        </div>
      )}

      {/* Performans Karşılaştırması */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Performans Karşılaştırması</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-medium text-red-600">❌ Mevcut Yöntem</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• 6 ayrı HTTP isteği</li>
              <li>• 2-5 saniye yükleme</li>
              <li>• Network gecikmesi</li>
              <li>• Cache bağımlılığı</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-medium text-green-600">✅ Base64 Yöntemi</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Tek seferde yükleme</li>
              <li>• 0.1-0.5 saniye</li>
              <li>• Anında erişim</li>
              <li>• Cache bağımsız</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-medium text-blue-600">📊 İyileştirme</h3>
            <ul className="text-sm mt-2 space-y-1">
              <li>• %90 daha hızlı</li>
              <li>• Daha akıcı animasyon</li>
              <li>• Daha iyi UX</li>
              <li>• Offline çalışma</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 