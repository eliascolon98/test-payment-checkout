import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentUseCase } from '../../domain/usecase/transactions/create-payment.usecase';
import { Transaction } from '../../domain/model/types/transaction.type';
import { CreatePaymentDto } from '../../model/dto/http/create-payment.dto';
import { HTTPResponse } from '../../model/http-response.model';

@Injectable()
export class CreatePaymentHandler {
  constructor(
    @Inject('CreatePaymentUseCase')
    private readonly createPaymentUseCase: CreatePaymentUseCase,
  ) {}

  async execute(dto: CreatePaymentDto): Promise<HTTPResponse<Transaction>> {
    const transaction = await this.createPaymentUseCase.execute({
      productId: dto.productId,
      quantity: dto.quantity,
      customerEmail: dto.customerEmail,
      installments: dto.installments ?? 1,
      card: {
        number: dto.card.number,
        cvc: dto.card.cvc,
        expMonth: dto.card.expMonth,
        expYear: dto.card.expYear,
        cardHolder: dto.card.cardHolder,
      },
    });

    return new HTTPResponse(
      'TRANSACTION_CREATED',
      'Transaction processed successfully',
      transaction,
    );
  }
}
