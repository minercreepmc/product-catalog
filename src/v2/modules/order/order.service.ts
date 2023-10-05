import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrderCreatedEvent } from './event';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(memberId: string, dto: CreateOrderDto) {
    const created = await this.orderRepository.create(memberId, dto);

    this.eventEmitter.emit(
      GlobalEvents.ORDER.ORDER_CREATED,
      new OrderCreatedEvent({
        cartId: created.cart_id,
      }),
    );
    return created;
  }

  update(id: string, dto: UpdateOrderDto) {
    return this.orderRepository.update(id, dto);
  }

  getOne(orderId: string) {
    return this.orderRepository.findOneById(orderId);
  }

  getByMember(memberId: string) {
    return this.orderRepository.findByMember(memberId);
  }

  getAll() {
    return this.orderRepository.findAll();
  }
}
