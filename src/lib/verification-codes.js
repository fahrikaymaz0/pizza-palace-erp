// Global verification codes storage
// Gerçek uygulamada Redis veya veritabanı kullanılır
const verificationCodes = new Map();

// 6 haneli kod oluştur
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Kodu sakla
function storeCode(email, data) {
  verificationCodes.set(email, {
    ...data,
    createdAt: Date.now(),
  });

  // 10 dakika sonra kodu sil
  setTimeout(
    () => {
      verificationCodes.delete(email);
    },
    10 * 60 * 1000
  );
}

// Kodu getir
function getCode(email) {
  return verificationCodes.get(email);
}

// Kodu sil
function deleteCode(email) {
  verificationCodes.delete(email);
}

// Tüm kodları listele (debug için)
function getAllCodes() {
  return Array.from(verificationCodes.keys());
}

module.exports = {
  generateVerificationCode,
  storeCode,
  getCode,
  deleteCode,
  getAllCodes,
};
