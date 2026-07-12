import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeliveryStatus } from '../../../../../domain/model/enum/delivery-status.enum';
import { TransactionStatus } from '../../../../../domain/model/enum/transaction-status.enum';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  reference!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'bigint', name: 'amount_in_cents' })
  amountInCents!: string;

  @Column({ default: 'COP' })
  currency!: string;

  @Column({ name: 'card_last_four' })
  cardLastFour!: string;

  @Column({ name: 'card_brand' })
  cardBrand!: string;

  @Column({ name: 'customer_email' })
  customerEmail!: string;

  @Column({
    name: 'delivery_status',
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.NOT_ASSIGNED,
  })
  deliveryStatus!: DeliveryStatus;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  externalId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
