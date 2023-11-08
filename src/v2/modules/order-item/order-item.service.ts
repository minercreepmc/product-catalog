import { Injectable } from '@nestjs/common';
import { OrderItemRepository } from './order-item.repository';

@Injectable()
export class OrderItemService {
  constructor(private orderItemRepository: OrderItemRepository) {}

  async getByOrderId(orderId: string) {
    return this.orderItemRepository.getByOrderId(orderId);
  }
}
