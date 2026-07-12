import { randomUUID } from 'node:crypto';
import { detectCardBrand } from '../../common/card-brand.util';
import { IPaymentGateway } from '../../interface/services/payment-gateway.service.interface';
import { IProductRepository } from '../../interface/services/product.repository.interface';
import { ITransactionRepository } from '../../interface/services/transaction.repository.interface';
import { TransactionStatus } from '../../model/enum/transaction-status.enum';
import { InsufficientStockException } from '../../model/exceptions/insufficient-stock.exception';
import { ProductNotFoundException } from '../../model/exceptions/product-not-found.exception';
import { CreateTransactionInput } from '../../model/types/create-transaction.type';
import { Product } from '../../model/types/product.type';
import { Transaction } from '../../model/types/transaction.type';

export class CreatePaymentUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    const product = await this.findProductWithStock(
      input.productId,
      input.quantity,
    );

    let transaction: Transaction = {
      id: randomUUID(),
      reference: `TX-${randomUUID()}`,
      productId: product.id,
      quantity: input.quantity,
      amountInCents: product.price * input.quantity,
      currency: 'COP',
      cardLastFour: input.card.number.slice(-4),
      cardBrand: detectCardBrand(input.card.number),
      status: TransactionStatus.PENDING,
      externalId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.transactionRepository.save(transaction);

    try {
      const token = await this.paymentGateway.tokenizeCard(input.card);
      const payment = await this.paymentGateway.createPayment({
        reference: transaction.reference,
        amountInCents: transaction.amountInCents,
        currency: transaction.currency,
        cardToken: token.tokenId,
        installments: input.installments,
        customerEmail: input.customerEmail,
      });

      transaction = {
        ...transaction,
        externalId: payment.externalId,
        status: payment.status,
        updatedAt: new Date(),
      };
    } catch {
      transaction = {
        ...transaction,
        status: TransactionStatus.ERROR,
        updatedAt: new Date(),
      };
    }

    await this.transactionRepository.save(transaction);

    if (transaction.status === TransactionStatus.APPROVED) {
      await this.productRepository.updateStock(
        product.id,
        product.stock - transaction.quantity,
      );
    }

    return transaction;
  }

  private async findProductWithStock(
    productId: string,
    quantity: number,
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    if (product.stock < quantity) {
      throw new InsufficientStockException(productId, product.stock, quantity);
    }

    return product;
  }
}
