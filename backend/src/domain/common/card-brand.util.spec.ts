import { CardBrand } from '../model/enum/card-brand.enum';
import { detectCardBrand } from './card-brand.util';

describe('detectCardBrand', () => {
  it('detects VISA cards', () => {
    expect(detectCardBrand('4242424242424242')).toBe(CardBrand.VISA);
    expect(detectCardBrand('4111 1111 1111 1111')).toBe(CardBrand.VISA);
  });

  it('detects MASTERCARD cards in the 51-55 range', () => {
    expect(detectCardBrand('5555555555554444')).toBe(CardBrand.MASTERCARD);
    expect(detectCardBrand('5105105105105100')).toBe(CardBrand.MASTERCARD);
  });

  it('detects MASTERCARD cards in the 2221-2720 range', () => {
    expect(detectCardBrand('2221000000000009')).toBe(CardBrand.MASTERCARD);
    expect(detectCardBrand('2720990000000000')).toBe(CardBrand.MASTERCARD);
  });

  it('returns UNKNOWN for unsupported brands', () => {
    expect(detectCardBrand('378282246310005')).toBe(CardBrand.UNKNOWN);
    expect(detectCardBrand('6011111111111117')).toBe(CardBrand.UNKNOWN);
  });
});
