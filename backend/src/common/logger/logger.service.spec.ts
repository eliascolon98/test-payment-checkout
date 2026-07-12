import { Logger } from '@nestjs/common';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  const service = new LoggerService('TestContext');

  it('delegates log messages to the Nest logger', () => {
    const spy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    service.log('hello');

    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('delegates warnings to the Nest logger', () => {
    const spy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    service.warn('careful');

    expect(spy).toHaveBeenCalledWith('careful');
  });

  it('extracts the message when logging an Error instance', () => {
    const spy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    service.error(new Error('boom'));

    expect(spy).toHaveBeenCalledWith('boom');
  });
});
