import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CartRepository } from '@v2/cart';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { plainToInstance } from 'class-transformer';
import { OrderGetByMemberStatusQueryDto, UpdateOrderDto } from './dto';
import { OrderCreatedEvent, OrderUpdatedEvent } from './event';
import { OrderRepository } from './order.repository';
import { CreateOrderRO, OrderDetailsRO } from './ro';

// const cartId = res.rows[0].id;
// const totalPrice = await this.getTotalPrice(cartId);
// const orderDetails = await this.createOrderDetails(
//   memberId,
//   cartId,
//   totalPrice,
// );
// const order: CreateOrderRO = {
//   ...orderDetails,
//   itemIds: [],
// };
//
// order.itemIds = await this.createOrderItems(order.id, cartId);
// return { ...order, cartId };

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(memberId: string) {
    const cartId = await this.cartRepository.getIdByUserId(memberId);
    const totalPrice = await this.cartRepository.getTotalPrice(cartId);
    const created = await this.orderRepository.create(
      memberId,
      cartId,
      totalPrice,
    );

    created.items = await this.orderItemRepository.createOrderItems(
      created.id,
      cartId,
    );
    console.log(created);

    const order = plainToInstance(
      CreateOrderRO,
      {
        ...created,
        cartId,
      },
      { excludeExtraneousValues: true },
    );

    this.eventEmitter.emit(
      GlobalEvents.ORDER.CREATED,
      new OrderCreatedEvent({
        cartId: order.cartId,
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

  getByMember(memberId: string, query: OrderGetByMemberStatusQueryDto) {
    const { status } = query;
    return this.orderRepository.findByMemberAndStatus(memberId, status);
  }

  getAll() {
    return this.orderRepository.findAll();
  }

  countDaily() {
    return this.orderRepository.countDaily();
  }

  countMonthly() {
    return this.orderRepository.countMonthly();
  }

  countWeekly() {
    return this.orderRepository.countWeekly();
  }
}
