import { Module } from '@nestjs/common';
import { ShippingRepository, ShippingService } from '@v2/shipping';
import { OrderUpdatedListener } from './order-updated.listener';

@Module({
  providers: [ShippingService, ShippingRepository, OrderUpdatedListener],
})
export class OrderUpdatedModule {}
