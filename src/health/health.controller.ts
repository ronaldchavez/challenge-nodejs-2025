import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('ping')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Ping the API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is alive', 
    schema: { example: { status: 'ok', timestamp: new Date() } } 
  })
  ping() {
    return { status: 'ok', timestamp: new Date() };
  }
}