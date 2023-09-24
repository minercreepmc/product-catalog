import {
  V1ShippingFeeHttpController,
  V1ShippingStatusHttpController,
} from '@controllers/http/v1';
import { V1ShippingHttpController } from '@controllers/http/v1/shipping.http.controller.v1';
import {
  ShippingFeeRepository,
  ShippingRepository,
} from '@database/repositories/pg/shipping';
import { ShippingStatusRepository } from '@database/repositories/pg/shipping-status/shipping-status.repository';
import { Module, Provider } from '@nestjs/common';
import {
  ShippingFeeService,
  ShippingService,
  ShippingStatusService,
} from '@use-cases/command/shipping';
import { RulesModule } from '../rules.module';

const services: Provider[] = [
  ShippingService,
  ShippingStatusService,
  ShippingFeeService,
];

const repositories: Provider[] = [
  ShippingRepository,
  ShippingStatusRepository,
  ShippingFeeRepository,
];

@Module({
  imports: [RulesModule],
  controllers: [
    V1ShippingHttpController,
    V1ShippingStatusHttpController,
    V1ShippingFeeHttpController,
  ],
  providers: [...services, ...repositories],
})
export class ShippingModule {}
