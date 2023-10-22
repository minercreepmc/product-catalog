import { Module } from '@nestjs/common';
import { OrderItemController } from './order-item.controller';
import { OrderItemRepository } from './order-item.repository';
import { OrderItemService } from './order-item.service';

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService, OrderItemRepository],
})
export class OrderItemModule {}
