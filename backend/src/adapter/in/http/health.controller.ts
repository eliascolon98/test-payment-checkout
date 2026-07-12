import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTPResponse } from '../../../model/http-response.model';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Service health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check(): HTTPResponse<{ status: string }> {
    return new HTTPResponse('OK', 'Service is healthy', { status: 'up' });
  }
}
