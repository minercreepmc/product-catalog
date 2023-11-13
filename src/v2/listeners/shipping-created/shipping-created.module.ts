import { Module } from '@nestjs/common';
import { AddressRepository } from '@v2/address';
import { CartRepository } from '@v2/cart';
import { OrderRepository, OrderService } from '@v2/order';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { ShippingCreatedListener } from './shipping-created.listener';

@Module({
  imports: [],
  providers: [
    ShippingCreatedListener,
    OrderService,
    OrderRepository,
    CartRepository,
    OrderItemRepository,
    AddressRepository,
  ],
})
export class ShippingCreatedModule {}
