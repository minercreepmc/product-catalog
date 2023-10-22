import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateOrderDto } from './dto';
import { OrderCreatedEvent, OrderUpdatedEvent } from './event';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(memberId: string) {
    const created = await this.orderRepository.create(memberId);

    this.eventEmitter.emit(
      GlobalEvents.ORDER.CREATED,
      new OrderCreatedEvent({
        cartId: created.cartId,
      }),
    );
    return created;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.orderRepository.update(id, dto);

    this.eventEmitter.emit(
      GlobalEvents.ORDER.UPDATED,
      new OrderUpdatedEvent({
        status: updated.status,
        orderId: updated.id,
      }),
    );

    return updated;
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
