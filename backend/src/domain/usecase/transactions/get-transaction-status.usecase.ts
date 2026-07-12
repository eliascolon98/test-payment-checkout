import { IPaymentGateway } from '../../interface/services/payment-gateway.service.interface';
import { IProductRepository } from '../../interface/services/product.repository.interface';
import { ITransactionRepository } from '../../interface/services/transaction.repository.interface';
import { TransactionStatus } from '../../model/enum/transaction-status.enum';
import { TransactionNotFoundException } from '../../model/exceptions/transaction-not-found.exception';
import { Transaction } from '../../model/types/transaction.type';

export class GetTransactionStatusUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(transactionId: string): Promise<Transaction> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundException(transactionId);
    }
    if (
      transaction.status !== TransactionStatus.PENDING ||
      !transaction.externalId
    ) {
      return transaction;
    }

    const payment = await this.paymentGateway.getPaymentStatus(
      transaction.externalId,
    );
    if (payment.status === TransactionStatus.PENDING) {
      return transaction;
    }

    const updated: Transaction = {
      ...transaction,
      status: payment.status,
      updatedAt: new Date(),
    };
    await this.transactionRepository.save(updated);

    if (updated.status === TransactionStatus.APPROVED) {
      await this.deliverProduct(updated.productId, updated.quantity);
    }

    return updated;
  }

  private async deliverProduct(
    productId: string,
    quantity: number,
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (product) {
      await this.productRepository.updateStock(
        product.id,
        product.stock - quantity,
      );
    }
  }
}
