import { Transaction } from '../../../../../domain/model/types/transaction.type';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDomain(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      reference: entity.reference,
      productId: entity.productId,
      quantity: entity.quantity,
      amountInCents: Number(entity.amountInCents),
      currency: entity.currency,
      cardLastFour: entity.cardLastFour,
      cardBrand: entity.cardBrand,
      customerEmail: entity.customerEmail,
      deliveryStatus: entity.deliveryStatus,
      status: entity.status,
      externalId: entity.externalId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(domain: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = domain.id;
    entity.reference = domain.reference;
    entity.productId = domain.productId;
    entity.quantity = domain.quantity;
    entity.amountInCents = String(domain.amountInCents);
    entity.currency = domain.currency;
    entity.cardLastFour = domain.cardLastFour;
    entity.cardBrand = domain.cardBrand;
    entity.customerEmail = domain.customerEmail;
    entity.deliveryStatus = domain.deliveryStatus;
    entity.status = domain.status;
    entity.externalId = domain.externalId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
