import { Module } from '@nestjs/common';
import { CartRepository, CartService } from '@v2/cart';
import { CartItemRepository } from '@v2/cart-item';
import { OrderCreatedListener } from './order-created.listener';

@Module({
  providers: [
    OrderCreatedListener,
    CartService,
    CartRepository,
    CartItemRepository,
  ],
})
export class OrderCreatedModule {}
