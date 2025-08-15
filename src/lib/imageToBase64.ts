// Resimleri base64'e çevirmek için yardımcı fonksiyonlar
export class ImageToBase64 {
  
  // URL'den resmi base64'e çevir
  static async urlToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // CORS sorunları için
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context alınamadı'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Resmi canvas'a çiz
        ctx.drawImage(img, 0, 0);
        
        // Base64'e çevir
        const base64 = canvas.toDataURL('image/png', 0.9);
        resolve(base64);
      };
      
      img.onerror = () => {
        reject(new Error('Resim yüklenemedi'));
      };
      
      img.src = imageUrl;
    });
  }

  // Dosyadan base64'e çevir
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Base64'ü optimize et
  static async optimizeBase64(base64: string, maxWidth: number = 128): Promise<string> {
    return new Promise((resolve) => {
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
        
        // PNG olarak kaydet (şeffaflık için)
        const optimizedBase64 = canvas.toDataURL('image/png', 0.9);
        resolve(optimizedBase64);
      };
      
      img.onerror = () => resolve(base64);
      img.src = base64;
    });
  }

  // Toplu resim dönüştürme
  static async convertImagesToBase64(imageUrls: { [key: string]: string }): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};
    
    for (const [key, url] of Object.entries(imageUrls)) {
      try {
        const base64 = await this.urlToBase64(url);
        const optimized = await this.optimizeBase64(base64, 128); // 128px max width
        result[key] = optimized;
        console.log(`✅ ${key} dönüştürüldü`);
      } catch (error) {
        console.error(`❌ ${key} dönüştürülemedi:`, error);
        // Fallback olarak placeholder kullan
        result[key] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      }
    }
    
    return result;
  }

  // Base64 boyutunu hesapla
  static getBase64Size(base64: string): number {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    const sizeInBytes = (base64.length * 3) / 4 - padding;
    return sizeInBytes / 1024; // KB cinsinden
  }
} 