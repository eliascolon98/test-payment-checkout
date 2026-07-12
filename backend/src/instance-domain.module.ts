import { Module } from '@nestjs/common';
import { HealthController } from './adapter/in/http/health.controller';
import { LoggerService } from './common/logger/logger.service';
import { ProductsController } from './adapter/in/http/products/products.controller';
import { TransactionsController } from './adapter/in/http/transactions/transactions.controller';
import { PostgresModule } from './adapter/out/database/postgres/postgres.module';
import { ProductRepository } from './adapter/out/database/postgres/repositories/product/product.repository';
import { TransactionRepository } from './adapter/out/database/postgres/repositories/transaction/transaction.repository';
import { PaymentProviderModule } from './adapter/out/services/payment-provider/payment-provider.module';
import { PaymentProviderService } from './adapter/out/services/payment-provider/services/payment-provider.service';
import { ListProductsUseCase } from './domain/usecase/products/list-products.usecase';
import { CreatePaymentUseCase } from './domain/usecase/transactions/create-payment.usecase';
import { GetTransactionStatusUseCase } from './domain/usecase/transactions/get-transaction-status.usecase';
import { ListProductsHandler } from './handler/products/list-products.handler';
import { CreatePaymentHandler } from './handler/transactions/create-payment.handler';
import { GetTransactionStatusHandler } from './handler/transactions/get-transaction-status.handler';

@Module({
  imports: [PostgresModule, PaymentProviderModule],
  controllers: [HealthController, ProductsController, TransactionsController],
  providers: [
    {
      provide: 'ListProductsUseCase',
      useFactory: (productRepository: ProductRepository) =>
        new ListProductsUseCase(productRepository),
      inject: [ProductRepository],
    },
    {
      provide: 'CreatePaymentUseCase',
      useFactory: (
        productRepository: ProductRepository,
        transactionRepository: TransactionRepository,
        paymentGateway: PaymentProviderService,
      ) =>
        new CreatePaymentUseCase(
          productRepository,
          transactionRepository,
          paymentGateway,
          new LoggerService(CreatePaymentUseCase.name),
        ),
      inject: [
        ProductRepository,
        TransactionRepository,
        PaymentProviderService,
      ],
    },
    {
      provide: 'GetTransactionStatusUseCase',
      useFactory: (
        transactionRepository: TransactionRepository,
        paymentGateway: PaymentProviderService,
        productRepository: ProductRepository,
      ) =>
        new GetTransactionStatusUseCase(
          transactionRepository,
          paymentGateway,
          productRepository,
        ),
      inject: [
        TransactionRepository,
        PaymentProviderService,
        ProductRepository,
      ],
    },
    ListProductsHandler,
    CreatePaymentHandler,
    GetTransactionStatusHandler,
  ],
})
export class InstanceDomainModule {}
