import { Module } from '@nestjs/common';
import { PaymentProviderService } from './services/payment-provider.service';

@Module({
  providers: [PaymentProviderService],
  exports: [PaymentProviderService],
})
export class PaymentProviderModule {}
