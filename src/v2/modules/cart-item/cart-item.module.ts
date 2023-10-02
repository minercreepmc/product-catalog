import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemRepository } from './cart-item.repository';
import { CartItemService } from './cart-item.service';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, CartItemRepository],
})
export class CartItemModule {}
