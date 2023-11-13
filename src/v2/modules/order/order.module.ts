import { Module } from '@nestjs/common';
import { AddressRepository } from '@v2/address';
import { CartRepository } from '@v2/cart';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    CartRepository,
    OrderItemRepository,
    AddressRepository,
  ],
})
export class OrderModule {}
