import { envValidationSchema } from './env.validation';

describe('envValidationSchema', () => {
  const validEnv = {
    DATABASE_URL: 'postgresql://user:pass@localhost:5433/db',
    PAYMENT_API_URL: 'https://api.payments.test/v1',
    PAYMENT_PUBLIC_KEY: 'pub_test',
    PAYMENT_PRIVATE_KEY: 'prv_test',
    PAYMENT_INTEGRITY_SECRET: 'integrity_test',
    PAYMENT_EVENTS_KEY: 'events_test',
  };

  it('accepts a complete environment and defaults PORT to 3001', () => {
    const result = envValidationSchema.validate(validEnv);

    expect(result.error).toBeUndefined();
    expect((result.value as { PORT: number }).PORT).toBe(3001);
  });

  it('rejects a missing DATABASE_URL', () => {
    const incomplete: Record<string, string> = { ...validEnv };
    delete incomplete.DATABASE_URL;

    const { error } = envValidationSchema.validate(incomplete);

    expect(error?.message).toContain('DATABASE_URL');
  });

  it('rejects a PAYMENT_API_URL that is not a valid uri', () => {
    const { error } = envValidationSchema.validate({
      ...validEnv,
      PAYMENT_API_URL: 'not-a-url',
    });

    expect(error?.message).toContain('PAYMENT_API_URL');
  });
});
