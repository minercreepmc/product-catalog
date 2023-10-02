import { Module } from '@nestjs/common';
import { CartRepository, CartService } from '@v2/cart';
import { UserCreatedListener } from './user-created.listener';

@Module({
  providers: [UserCreatedListener, CartService, CartRepository],
})
export class UserCreatedModule {}
