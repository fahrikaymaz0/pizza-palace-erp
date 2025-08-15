'use client';

import React, { useState, useRef } from 'react';
import { Base64Utils } from '../lib/base64Utils';

interface Base64FileUploadProps {
  onFileSelect: (base64: string, filename: string, mimeType: string) => void;
  accept?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  label?: string;
  className?: string;
}

export default function Base64FileUpload({
  onFileSelect,
  accept = 'image/*,video/*',
  maxSizeMB = 10,
  showPreview = true,
  label = 'Dosya Seç',
  className = ''
}: Base64FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsLoading(true);

    try {
      // Dosya boyutunu kontrol et
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz`);
      }

      // Base64'e çevir
      const base64 = await Base64Utils.fileToBase64(file);
      
      // Boyut kontrolü
      if (!Base64Utils.validateFileSize(base64, maxSizeMB)) {
        throw new Error(`Base64 boyutu ${maxSizeMB}MB'dan büyük`);
      }

      const mimeType = Base64Utils.getMimeType(file.name);

      // Resim ise optimize et
      let optimizedBase64 = base64;
      if (mimeType.startsWith('image/')) {
        optimizedBase64 = await Base64Utils.optimizeImage(base64);
      }

      // Preview oluştur
      if (showPreview) {
        if (mimeType.startsWith('image/')) {
          setPreview(`data:${mimeType};base64,${optimizedBase64}`);
        } else if (mimeType.startsWith('video/')) {
          // Video için thumbnail oluştur
          const thumbnail = await Base64Utils.createVideoThumbnail(file);
          setPreview(`data:image/jpeg;base64,${thumbnail}`);
        }
      }

      // Callback'i çağır
      onFileSelect(optimizedBase64, file.name, mimeType);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dosya yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    // File input'a dosyayı set et
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      // Event tetikle
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className={`base64-upload ${className}`}>
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.3s ease'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Dosya işleniyor...</p>
          </div>
        ) : (
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: '#666' }}></i>
            <p style={{ margin: '10px 0', color: '#666' }}>{label}</p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>
              Maksimum boyut: {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error" style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {showPreview && preview && (
        <div className="preview" style={{ marginTop: '15px' }}>
          <h6>Önizleme:</h6>
          <div style={{ maxWidth: '200px', maxHeight: '200px', overflow: 'hidden' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .base64-upload {
          margin: 15px 0;
        }
        
        .upload-area:hover {
          border-color: #007bff !important;
        }
        
        .loading .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 