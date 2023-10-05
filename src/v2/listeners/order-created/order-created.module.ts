import { Module } from '@nestjs/common';
import { CartRepository, CartService } from '@v2/cart';
import { OrderCreatedListener } from './order-created.listener';

@Module({
  providers: [OrderCreatedListener, CartService, CartRepository],
})
export class OrderCreatedModule {}
