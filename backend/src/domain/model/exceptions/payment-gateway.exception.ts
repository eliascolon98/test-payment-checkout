import { DomainException } from './domain.exception';

export class PaymentGatewayException extends DomainException {
  readonly code = 'PAYMENT_GATEWAY_ERROR';

  constructor() {
    super('The payment could not be processed by the payment provider');
    this.name = PaymentGatewayException.name;
  }
}
