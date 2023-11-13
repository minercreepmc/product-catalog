import { Module } from '@nestjs/common';
import { AddressRepository } from '@v2/address';
import { CartRepository } from '@v2/cart';
import { OrderRepository, OrderService } from '@v2/order';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { ShippingDeletedListener } from './shipping-deleted.listener';

@Module({
  providers: [
    ShippingDeletedListener,
    OrderService,
    OrderRepository,
    CartRepository,
    OrderItemRepository,
    AddressRepository,
  ],
})
export class ShippingDeletedModule {}
