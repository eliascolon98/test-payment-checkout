import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Transaction } from '../../../../domain/model/types/transaction.type';
import { CreatePaymentHandler } from '../../../../handler/transactions/create-payment.handler';
import { GetTransactionStatusHandler } from '../../../../handler/transactions/get-transaction-status.handler';
import { CreatePaymentDto } from '../../../../model/dto/http/create-payment.dto';
import { HTTPResponse } from '../../../../model/http-response.model';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createPaymentHandler: CreatePaymentHandler,
    private readonly getTransactionStatusHandler: GetTransactionStatusHandler,
  ) {}

  @Post()
  async createPayment(
    @Body() dto: CreatePaymentDto,
  ): Promise<HTTPResponse<Transaction>> {
    return this.createPaymentHandler.execute(dto);
  }

  @Get(':id')
  async getTransactionStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HTTPResponse<Transaction>> {
    return this.getTransactionStatusHandler.execute(id);
  }
}
