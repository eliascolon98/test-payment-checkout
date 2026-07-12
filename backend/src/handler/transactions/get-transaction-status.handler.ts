import { Inject, Injectable } from '@nestjs/common';
import { GetTransactionStatusUseCase } from '../../domain/usecase/transactions/get-transaction-status.usecase';
import { Transaction } from '../../domain/model/types/transaction.type';
import { HTTPResponse } from '../../model/http-response.model';

@Injectable()
export class GetTransactionStatusHandler {
  constructor(
    @Inject('GetTransactionStatusUseCase')
    private readonly getTransactionStatusUseCase: GetTransactionStatusUseCase,
  ) {}

  async execute(transactionId: string): Promise<HTTPResponse<Transaction>> {
    const transaction =
      await this.getTransactionStatusUseCase.execute(transactionId);

    return new HTTPResponse(
      'TRANSACTION_FOUND',
      'Transaction status retrieved successfully',
      transaction,
    );
  }
}
