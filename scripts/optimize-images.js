const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Optimize edilecek klasörler
const FOLDERS_TO_OPTIMIZE = [
  'pizzas',
  'düşenpng'
];

// WebP ve AVIF kalite ayarları
const QUALITY = {
  webp: 80,
  avif: 70
};

// Boyut ayarları
const SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200
};

async function optimizeImage(inputPath, outputDir, filename) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // WebP versiyonu
    await image
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputDir, `${filename}.webp`));
    
    // AVIF versiyonu
    await image
      .avif({ quality: QUALITY.avif })
      .toFile(path.join(outputDir, `${filename}.avif`));
    
    // Farklı boyutlarda WebP
    for (const [sizeName, size] of Object.entries(SIZES)) {
      await image
        .resize(size, size, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `${filename}-${sizeName}.webp`));
    }
    
    console.log(`✅ ${filename} optimize edildi`);
  } catch (error) {
    console.error(`❌ ${filename} optimize edilemedi:`, error.message);
  }
}

async function processFolder(folderPath) {
  const optimizedFolderPath = path.join(OPTIMIZED_DIR, path.basename(folderPath));
  
  // Optimized klasörünü oluştur
  if (!fs.existsSync(optimizedFolderPath)) {
    fs.mkdirSync(optimizedFolderPath, { recursive: true });
  }
  
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg|gif)$/i.test(file)
  );
  
  console.log(`\n📁 ${folderPath} klasörü işleniyor...`);
  console.log(`📸 ${imageFiles.length} görsel bulundu`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(folderPath, file);
    const filename = path.parse(file).name;
    await optimizeImage(inputPath, optimizedFolderPath, filename);
  }
}

async function main() {
  console.log('🚀 Görsel optimizasyonu başlatılıyor...\n');
  
  // Ana optimized klasörünü oluştur
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }
  
  // Her klasörü işle
  for (const folderName of FOLDERS_TO_OPTIMIZE) {
    const folderPath = path.join(PUBLIC_DIR, folderName);
    if (fs.existsSync(folderPath)) {
      await processFolder(folderPath);
    } else {
      console.log(`⚠️  ${folderPath} klasörü bulunamadı`);
    }
  }
  
  console.log('\n🎉 Görsel optimizasyonu tamamlandı!');
  console.log(`📁 Optimized görseller: ${OPTIMIZED_DIR}`);
  
  // Kullanım örneği
  console.log('\n📝 Kullanım örneği:');
  console.log('<picture>');
  console.log('  <source srcset="/optimized/pizzas/margherita-large.avif" type="image/avif">');
  console.log('  <source srcset="/optimized/pizzas/margherita-large.webp" type="image/webp">');
  console.log('  <img src="/pizzas/margherita.png" alt="Margherita Pizza">');
  console.log('</picture>');
}

main().catch(console.error);




