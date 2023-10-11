import { Module } from '@nestjs/common';
import { ShippingStatusController } from './shipping-status.controller';
import { ShippingStatusRepository } from './shipping-status.repository';
import { ShippingStatusService } from './shipping-status.service';

@Module({
  controllers: [ShippingStatusController],
  providers: [ShippingStatusService, ShippingStatusRepository],
})
export class ShippingStatusModule {}
