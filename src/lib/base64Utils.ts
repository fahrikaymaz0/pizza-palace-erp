// Base64 dosya işlemleri için yardımcı fonksiyonlar
export class Base64Utils {
  // Dosyayı Base64'e çevir
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, kısmını kaldır
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Base64'ü dosyaya çevir
  static base64ToFile(
    base64: string,
    filename: string,
    mimeType: string
  ): File {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    return new File([blob], filename, { type: mimeType });
  }

  // Base64 boyutunu hesapla (MB)
  static getBase64Size(base64: string): number {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    const sizeInBytes = (base64.length * 3) / 4 - padding;
    return sizeInBytes / (1024 * 1024); // MB cinsinden
  }

  // Dosya türünü kontrol et
  static getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      mp4: 'video/mp4',
      avi: 'video/avi',
      mov: 'video/quicktime',
      webm: 'video/webm',
      pdf: 'application/pdf',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  // Dosya boyutunu kontrol et (max 10MB)
  static validateFileSize(base64: string, maxSizeMB: number = 10): boolean {
    const size = this.getBase64Size(base64);
    return size <= maxSizeMB;
  }

  // Base64'ü optimize et (resimler için)
  static async optimizeImage(
    base64: string,
    maxWidth: number = 800
  ): Promise<string> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(base64);
          return;
        }

        // Boyutları hesapla
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Resmi çiz
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG olarak kaydet (kalite: 0.8)
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(optimizedBase64.split(',')[1]);
      };

      img.onerror = () => resolve(base64);
      img.src = `data:image/jpeg;base64,${base64}`;
    });
  }

  // Video thumbnail oluştur
  static async createVideoThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context alınamadı'));
        return;
      }

      video.onloadedmetadata = () => {
        // Video'nun 1. saniyesinden thumbnail al
        video.currentTime = 1;
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail.split(',')[1]);
      };

      video.onerror = () => reject(new Error('Video yüklenemedi'));
      video.src = URL.createObjectURL(videoFile);
    });
  }
}
