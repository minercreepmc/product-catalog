import { Module } from '@nestjs/common';
import { CartItemRepository } from '@v2/cart-item';
import { ShippingFeeRepository } from '@v2/shipping-fee';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    CartItemRepository,
    ShippingFeeRepository,
  ],
})
export class CartModule {}
