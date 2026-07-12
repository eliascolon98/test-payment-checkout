import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

describe('CreatePaymentDto', () => {
  const validPayload = {
    productId: 'e95a0aab-d9db-4490-a939-34934d88efde',
    quantity: 1,
    customerEmail: 'customer@test.com',
    card: {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'Test User',
    },
  };

  const buildDto = (payload: object): CreatePaymentDto =>
    plainToInstance(CreatePaymentDto, payload);

  it('accepts a valid payload', async () => {
    const errors = await validate(buildDto(validPayload));

    expect(errors).toHaveLength(0);
  });

  it('rejects a card number that fails the Luhn check', async () => {
    const errors = await validate(
      buildDto({
        ...validPayload,
        card: { ...validPayload.card, number: '4242424242424241' },
      }),
    );

    expect(errors.some((error) => error.property === 'card')).toBe(true);
  });

  it('rejects an invalid expiration month', async () => {
    const errors = await validate(
      buildDto({
        ...validPayload,
        card: { ...validPayload.card, expMonth: '13' },
      }),
    );

    expect(errors.some((error) => error.property === 'card')).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const errors = await validate(
      buildDto({ ...validPayload, customerEmail: 'not-an-email' }),
    );

    expect(errors.some((error) => error.property === 'customerEmail')).toBe(
      true,
    );
  });

  it('rejects a quantity below 1', async () => {
    const errors = await validate(buildDto({ ...validPayload, quantity: 0 }));

    expect(errors.some((error) => error.property === 'quantity')).toBe(true);
  });

  it('rejects installments above 36', async () => {
    const errors = await validate(
      buildDto({ ...validPayload, installments: 48 }),
    );

    expect(errors.some((error) => error.property === 'installments')).toBe(
      true,
    );
  });
});
