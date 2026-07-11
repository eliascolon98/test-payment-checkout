import { CardBrand } from '../model/enum/card-brand.enum';

const VISA_PATTERN = /^4/;
const MASTERCARD_PATTERN =
  /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/;

export const detectCardBrand = (cardNumber: string): CardBrand => {
  const digits = cardNumber.replace(/\D/g, '');

  if (VISA_PATTERN.test(digits)) {
    return CardBrand.VISA;
  }
  if (MASTERCARD_PATTERN.test(digits)) {
    return CardBrand.MASTERCARD;
  }
  return CardBrand.UNKNOWN;
};
