import { Controller, Get } from '@nestjs/common';
import { HTTPResponse } from '../../../model/http-response.model';

@Controller('health')
export class HealthController {
  @Get()
  check(): HTTPResponse<{ status: string }> {
    return new HTTPResponse('OK', 'Service is healthy', { status: 'up' });
  }
}
