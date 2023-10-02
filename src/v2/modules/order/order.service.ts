import { Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  create(memberId: string, dto: CreateOrderDto) {
    return this.orderRepository.create(memberId, dto);
  }

  update(id: string, dto: UpdateOrderDto) {
    return this.orderRepository.update(id, dto);
  }

  getOne(orderId: string) {
    return this.orderRepository.findOneById(orderId);
  }
}
