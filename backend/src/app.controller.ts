import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'SecondGo API', version: '1.0.0' };
  }
}
