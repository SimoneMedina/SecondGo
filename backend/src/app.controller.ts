import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      service: 'SecondGo API',
      version: '1.0.0',
      health: '/api/health',
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'SecondGo API', version: '1.0.0' };
  }
}
