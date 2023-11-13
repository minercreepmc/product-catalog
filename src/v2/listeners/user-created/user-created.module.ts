import { Module } from '@nestjs/common';
import { CartRepository, CartService } from '@v2/cart';
import { CartItemRepository } from '@v2/cart-item';
import { UserCreatedListener } from './user-created.listener';

@Module({
  providers: [
    UserCreatedListener,
    CartService,
    CartRepository,
    CartItemRepository,
  ],
})
export class UserCreatedModule {}
