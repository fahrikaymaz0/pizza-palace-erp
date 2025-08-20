// Telefon numarası formatı testleri
describe('Phone Number Formatting', () => {
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 && numbers.startsWith('5');
  };

  test('should format 10-digit Turkish phone number correctly', () => {
    const input = '5551234567';
    const expected = '555 123 45 67';
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  test('should format phone number with spaces correctly', () => {
    const input = '555 123 45 67';
    const expected = '555 123 45 67';
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  test('should format phone number with dashes correctly', () => {
    const input = '555-123-45-67';
    const expected = '555 123 45 67';
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  test('should validate correct Turkish phone number', () => {
    const phone = '5551234567';
    expect(validatePhoneNumber(phone)).toBe(true);
  });

  test('should reject invalid phone number length', () => {
    const phone = '555123456';
    expect(validatePhoneNumber(phone)).toBe(false);
  });

  test('should reject phone number not starting with 5', () => {
    const phone = '4441234567';
    expect(validatePhoneNumber(phone)).toBe(false);
  });

  test('should handle empty input', () => {
    const input = '';
    const expected = '';
    expect(formatPhoneNumber(input)).toBe(expected);
    expect(validatePhoneNumber(input)).toBe(false);
  });
});




