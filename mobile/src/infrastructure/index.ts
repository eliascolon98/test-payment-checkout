import type { Gateways } from '../domain/ports';
import { HttpPaymentGateway } from './http/payment-gateway.http';
import { HttpProductGateway } from './http/product-gateway.http';

/**
 * Composition root of the outbound adapters. This is the only place where
 * the application layer meets concrete infrastructure implementations.
 */
export const gateways: Gateways = {
  productGateway: new HttpProductGateway(),
  paymentGateway: new HttpPaymentGateway(),
};
