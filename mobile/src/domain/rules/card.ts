export type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN';

const VISA_PATTERN = /^4/;
const MASTERCARD_PATTERN =
  /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/;

/** Detects the card brand from its number (VISA / MasterCard). */
export const detectCardBrand = (cardNumber: string): CardBrand => {
  const digits = cardNumber.replace(/\D/g, '');
  if (VISA_PATTERN.test(digits)) {
    return 'VISA';
  }
  if (MASTERCARD_PATTERN.test(digits)) {
    return 'MASTERCARD';
  }
  return 'UNKNOWN';
};

/** Validates a card number using the Luhn algorithm. */
export const isValidCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
};

/** Validates an expiration date (MM / YY) is well formed and not in the past. */
export const isValidExpiry = (
  month: string,
  year: string,
  now: Date = new Date(),
): boolean => {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return false;
  }
  const monthNum = Number(month);
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  const fullYear = 2000 + Number(year);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (fullYear < currentYear) {
    return false;
  }
  if (fullYear === currentYear && monthNum < currentMonth) {
    return false;
  }
  return true;
};

/** Validates the CVC (3 or 4 digits). */
export const isValidCvc = (cvc: string): boolean => /^\d{3,4}$/.test(cvc);

/** Maximum digits for the supported brands (VISA / MasterCard: 16). */
export const MAX_CARD_DIGITS = 16;

/** CVC length: VISA / MasterCard use 3 digits (Amex would use 4). */
export const CVC_LENGTH = 3;

/** Keeps only digits, capped at the max card length. */
export const sanitizeCardNumber = (cardNumber: string): string =>
  cardNumber.replace(/\D/g, '').slice(0, MAX_CARD_DIGITS);

/** Formats a raw card number into groups of 4 digits. */
export const formatCardNumber = (cardNumber: string): string => {
  const digits = sanitizeCardNumber(cardNumber);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};
