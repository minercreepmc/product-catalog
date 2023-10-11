import { Module } from '@nestjs/common';
import { OrderRepository, OrderService } from '@v2/order';
import { ShippingCreatedListener } from './shipping-created.listener';

@Module({
  imports: [],
  providers: [ShippingCreatedListener, OrderService, OrderRepository],
})
export class ShippingCreatedModule {}
