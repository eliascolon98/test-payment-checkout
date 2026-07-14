import {
  detectCardBrand,
  formatCardNumber,
  isValidCardHolder,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  sanitizeCardNumber,
} from './card';

describe('detectCardBrand', () => {
  it('detects VISA', () => {
    expect(detectCardBrand('4242424242424242')).toBe('VISA');
    expect(detectCardBrand('4111 1111 1111 1111')).toBe('VISA');
  });

  it('detects MASTERCARD in both ranges', () => {
    expect(detectCardBrand('5555555555554444')).toBe('MASTERCARD');
    expect(detectCardBrand('2221000000000009')).toBe('MASTERCARD');
  });

  it('returns UNKNOWN otherwise', () => {
    expect(detectCardBrand('378282246310005')).toBe('UNKNOWN');
    expect(detectCardBrand('')).toBe('UNKNOWN');
  });
});

describe('isValidCardNumber (Luhn)', () => {
  it('accepts valid numbers', () => {
    expect(isValidCardNumber('4242424242424242')).toBe(true);
    expect(isValidCardNumber('5555 5555 5555 4444')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(isValidCardNumber('4242424242424241')).toBe(false);
    expect(isValidCardNumber('1234')).toBe(false);
    expect(isValidCardNumber('')).toBe(false);
  });
});

describe('isValidExpiry', () => {
  const now = new Date('2026-06-15T00:00:00Z');

  it('accepts a future date', () => {
    expect(isValidExpiry('08', '28', now)).toBe(true);
    expect(isValidExpiry('06', '26', now)).toBe(true);
  });

  it('rejects past dates and malformed input', () => {
    expect(isValidExpiry('05', '26', now)).toBe(false);
    expect(isValidExpiry('01', '25', now)).toBe(false);
    expect(isValidExpiry('13', '28', now)).toBe(false);
    expect(isValidExpiry('1', '28', now)).toBe(false);
    expect(isValidExpiry('ab', 'cd', now)).toBe(false);
  });
});

describe('isValidCvc', () => {
  it('accepts 3 or 4 digits', () => {
    expect(isValidCvc('123')).toBe(true);
    expect(isValidCvc('1234')).toBe(true);
  });

  it('rejects otherwise', () => {
    expect(isValidCvc('12')).toBe(false);
    expect(isValidCvc('12a')).toBe(false);
  });
});

describe('isValidCardHolder', () => {
  it('requires at least 5 characters', () => {
    expect(isValidCardHolder('JOHN DOE')).toBe(true);
    expect(isValidCardHolder('ANNA')).toBe(false);
    expect(isValidCardHolder('   ')).toBe(false);
  });
});

describe('sanitizeCardNumber / formatCardNumber', () => {
  it('keeps only digits capped at 16', () => {
    expect(sanitizeCardNumber('4242-4242-4242-4242-9999')).toBe(
      '4242424242424242',
    );
  });

  it('formats in groups of 4', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('4242')).toBe('4242');
  });
});
