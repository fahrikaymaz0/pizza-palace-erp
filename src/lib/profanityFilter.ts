export class ProfanityFilter {
  private static instance: ProfanityFilter;
  private profanityWords: Set<string>;

  private constructor() {
    // Türkçe küfür kelimeleri (örnek)
    this.profanityWords = new Set([
      'küfür1',
      'küfür2',
      'küfür3', // Gerçek kelimeler yerine placeholder
    ]);
  }

  public static getInstance(): ProfanityFilter {
    if (!ProfanityFilter.instance) {
      ProfanityFilter.instance = new ProfanityFilter();
    }
    return ProfanityFilter.instance;
  }

  public getProfanityCount(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;

    for (const word of words) {
      if (this.profanityWords.has(word)) {
        count++;
      }
    }

    return count;
  }

  public hasProfanity(text: string): boolean {
    return this.getProfanityCount(text) > 0;
  }
}
