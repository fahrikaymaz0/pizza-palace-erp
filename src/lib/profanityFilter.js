// Profanity filter sınıfı
class ProfanityFilter {
  constructor() {
    // Türkçe küfür listesi (örnek)
    this.badWords = [
      'küfür1',
      'küfür2',
      'küfür3'
    ];
  }

  // Metni kontrol et
  check(text) {
    if (!text) return { isClean: true, foundWords: [] };
    
    const lowerText = text.toLowerCase();
    const foundWords = [];
    
    for (const word of this.badWords) {
      if (lowerText.includes(word.toLowerCase())) {
        foundWords.push(word);
      }
    }
    
    return {
      isClean: foundWords.length === 0,
      foundWords: foundWords
    };
  }

  // Metni temizle
  clean(text) {
    if (!text) return text;
    
    let cleanText = text;
    for (const word of this.badWords) {
      const regex = new RegExp(word, 'gi');
      cleanText = cleanText.replace(regex, '*'.repeat(word.length));
    }
    
    return cleanText;
  }

  // Kelime ekle
  addWord(word) {
    if (!this.badWords.includes(word)) {
      this.badWords.push(word);
    }
  }

  // Kelime çıkar
  removeWord(word) {
    const index = this.badWords.indexOf(word);
    if (index > -1) {
      this.badWords.splice(index, 1);
    }
  }

  // Singleton instance al
  static getInstance() {
    if (!ProfanityFilter.instance) {
      ProfanityFilter.instance = new ProfanityFilter();
    }
    return ProfanityFilter.instance;
  }

  // Profanity sayısını al
  getProfanityCount() {
    return this.badWords.length;
  }

  // Profanity kelimelerini al
  getProfanityWords() {
    return [...this.badWords];
  }

  // Liste güncel mi kontrol et
  async isProfanityListUpToDate() {
    return true; // Basit implementasyon
  }

  // Listeyi yenile
  async refreshProfanityList() {
    // Basit implementasyon - gerçekte API'den çekilebilir
    return true;
  }
}

// Singleton instance
const profanityFilter = new ProfanityFilter();

module.exports = profanityFilter;
