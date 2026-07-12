import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { InsufficientStockException } from '../../domain/model/exceptions/insufficient-stock.exception';
import { ProductNotFoundException } from '../../domain/model/exceptions/product-not-found.exception';
import { ExceptionManager } from './exceptions-manager.filter';

describe('ExceptionManager', () => {
  const filter = new ExceptionManager();

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps ProductNotFoundException to 404', () => {
    filter.catch(new ProductNotFoundException('product-1'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
    );
  });

  it('maps InsufficientStockException to 409', () => {
    filter.catch(new InsufficientStockException('product-1', 1, 5), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'INSUFFICIENT_STOCK' }),
    );
  });

  it('respects the status of HttpException and joins array messages', () => {
    filter.catch(
      new BadRequestException(['field a invalid', 'field b invalid']),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'field a invalid, field b invalid',
      }),
    );
  });

  it('maps unknown errors to 500', () => {
    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'INTERNAL_SERVER_ERROR' }),
    );
  });
});
