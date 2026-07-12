import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from '../../../../domain/model/types/transaction.type';
import { CreatePaymentHandler } from '../../../../handler/transactions/create-payment.handler';
import { GetTransactionStatusHandler } from '../../../../handler/transactions/get-transaction-status.handler';
import { CreatePaymentDto } from '../../../../model/dto/http/create-payment.dto';
import { HTTPResponse } from '../../../../model/http-response.model';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createPaymentHandler: CreatePaymentHandler,
    private readonly getTransactionStatusHandler: GetTransactionStatusHandler,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a credit card payment',
    description:
      'Creates a PENDING transaction, tokenizes the card and requests the ' +
      'payment to the provider. Poll GET /transactions/:id for the final status.',
  })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Insufficient stock' })
  @ApiResponse({
    status: 502,
    description: 'Payment provider rejected or failed to process the payment',
  })
  async createPayment(
    @Body() dto: CreatePaymentDto,
  ): Promise<HTTPResponse<Transaction>> {
    return this.createPaymentHandler.execute(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get the transaction status',
    description:
      'Returns the transaction. While PENDING, it refreshes the status ' +
      'against the payment provider and updates stock on approval.',
  })
  @ApiParam({ name: 'id', description: 'Internal transaction id (uuid)' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HTTPResponse<Transaction>> {
    return this.getTransactionStatusHandler.execute(id);
  }
}
