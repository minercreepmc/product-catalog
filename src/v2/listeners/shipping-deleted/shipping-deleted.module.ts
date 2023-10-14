import { Module } from '@nestjs/common';
import { OrderRepository, OrderService } from '@v2/order';
import { ShippingDeletedListener } from './shipping-deleted.listener';

@Module({
  providers: [ShippingDeletedListener, OrderService, OrderRepository],
})
export class ShippingDeletedModule {}
