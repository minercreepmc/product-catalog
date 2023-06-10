import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private mikroOrmHealthIndicator: MikroOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.mikroOrmHealthIndicator.pingCheck('database'),
    ]);
  }
}

export default HealthController;
