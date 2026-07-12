import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PAYMENT_API_URL: Joi.string().uri().required(),
  PAYMENT_PUBLIC_KEY: Joi.string().required(),
  PAYMENT_PRIVATE_KEY: Joi.string().required(),
  PAYMENT_INTEGRITY_SECRET: Joi.string().required(),
  PAYMENT_EVENTS_KEY: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
