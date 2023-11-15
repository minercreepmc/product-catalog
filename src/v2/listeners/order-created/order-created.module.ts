import { Module } from '@nestjs/common';
import { CartRepository, CartService } from '@v2/cart';
import { CartItemRepository } from '@v2/cart-item';
import { ShippingFeeRepository } from '@v2/shipping-fee';
import { OrderCreatedListener } from './order-created.listener';

@Module({
  providers: [
    OrderCreatedListener,
    CartService,
    CartRepository,
    CartItemRepository,
    ShippingFeeRepository,
  ],
})
export class OrderCreatedModule {}
