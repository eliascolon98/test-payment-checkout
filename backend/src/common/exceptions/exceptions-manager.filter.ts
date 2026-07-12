import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainException } from '../../domain/model/exceptions/domain.exception';
import { HTTPResponse } from '../../model/http-response.model';

const DOMAIN_ERROR_STATUS: Record<string, HttpStatus> = {
  PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
  TRANSACTION_NOT_FOUND: HttpStatus.NOT_FOUND,
  INSUFFICIENT_STOCK: HttpStatus.CONFLICT,
  INVALID_TRANSACTION_STATE: HttpStatus.CONFLICT,
  PAYMENT_GATEWAY_ERROR: HttpStatus.BAD_GATEWAY,
};

@Catch()
export class ExceptionManager implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainException) {
      const status =
        DOMAIN_ERROR_STATUS[exception.code] ?? HttpStatus.UNPROCESSABLE_ENTITY;
      response
        .status(status)
        .json(new HTTPResponse(exception.code, exception.message));
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ??
            exception.message);

      response
        .status(status)
        .json(
          new HTTPResponse(
            HttpStatus[status] ?? 'HTTP_ERROR',
            Array.isArray(message) ? message.join(', ') : message,
          ),
        );
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(new HTTPResponse('INTERNAL_SERVER_ERROR', 'Unexpected error'));
  }
}
