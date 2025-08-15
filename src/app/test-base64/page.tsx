'use client';

import React, { useState } from 'react';
import Base64FileUpload from '../../components/Base64FileUpload';

export default function TestBase64Page() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (base64: string, filename: string, mimeType: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/upload/base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64,
          filename,
          mimeType,
          category: 'test'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUploadedFiles(prev => [...prev, result.data]);
        alert('Dosya başarıyla yüklendi!');
      } else {
        alert(`Hata: ${result.error}`);
      }
    } catch (error) {
      alert('Yükleme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const displayFile = (file: any) => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <img 
          src={`data:${file.mimeType};base64,${file.base64}`}
          alt={file.originalName}
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      );
    } else if (file.mimeType.startsWith('video/')) {
      return (
        <video 
          controls
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        >
          <source src={`data:${file.mimeType};base64,${file.base64}`} type={file.mimeType} />
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      );
    } else {
      return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
          <p>Dosya: {file.originalName}</p>
          <p>Boyut: {file.size.toFixed(2)} MB</p>
          <p>Tür: {file.mimeType}</p>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Base64 Dosya Yükleme Testi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yükleme Alanı */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dosya Yükle</h2>
          
          <Base64FileUpload
            onFileSelect={handleFileUpload}
            accept="image/*,video/*"
            maxSizeMB={5}
            showPreview={true}
            label="Resim veya Video Seç"
          />

          {loading && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">
              Dosya yükleniyor...
            </div>
          )}
        </div>

        {/* Yüklenen Dosyalar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Yüklenen Dosyalar</h2>
          
          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500">Henüz dosya yüklenmedi</p>
          ) : (
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded p-3">
                  <h3 className="font-medium mb-2">{file.originalName}</h3>
                  <div className="mb-2">
                    {displayFile(file)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Boyut: {file.size.toFixed(2)} MB</p>
                    <p>Tür: {file.mimeType}</p>
                    <p>ID: {file.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performans Bilgileri */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Performans Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium">Avantajlar:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Basit entegrasyon</li>
              <li>Hızlı geliştirme</li>
              <li>Offline çalışma</li>
              <li>Güvenli</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Dezavantajlar:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>%33 daha büyük boyut</li>
              <li>Büyük dosyalar yavaşlatabilir</li>
              <li>Daha fazla RAM kullanımı</li>
              <li>Cache sorunları</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Öneriler:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Maksimum 5MB dosya</li>
              <li>Resimleri optimize edin</li>
              <li>Video için thumbnail kullanın</li>
              <li>Lazy loading uygulayın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 