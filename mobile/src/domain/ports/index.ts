export * from './payment-gateway.port';
export * from './product-gateway.port';

import type { IPaymentGateway } from './payment-gateway.port';
import type { IProductGateway } from './product-gateway.port';

/**
 * Container with every outbound port of the app. It is injected into the
 * Redux thunks (extraArgument), so use cases depend on these interfaces
 * and never on concrete HTTP implementations.
 */
export type Gateways = {
  productGateway: IProductGateway;
  paymentGateway: IPaymentGateway;
};
