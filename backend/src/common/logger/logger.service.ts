import { Logger } from '@nestjs/common';
import { type ILogger } from '../../domain/interface/logger.interface';

export class LoggerService implements ILogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  log(message: string): void {
    this.logger.log(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string | Error): void {
    this.logger.error(message instanceof Error ? message.message : message);
  }
}
