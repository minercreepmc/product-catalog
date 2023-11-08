import { GlobalEvents } from '@constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CartRepository } from '@v2/cart';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { OrderRepository } from './order.repository';
import { OrderCreatedEvent, OrderUpdatedEvent } from './event';
import type { OrderGetByMemberStatusQueryDto, UpdateOrderDto } from './dto';
import { CreateOrderRO, OrderDetailsRO } from './ro';

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

    if (!created) {
      throw new Error('Cannot create order details');
    }

    created.items = await this.orderItemRepository.createOrderItems(
      created.id,
      cartId,
    );

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
        cartId,
      }),
    );
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.orderRepository.update(id, dto);

    if (!updated) {
      throw new NotFoundException('Order not found');
    }

    this.eventEmitter.emit(
      GlobalEvents.ORDER.UPDATED,
      new OrderUpdatedEvent({
        status: dto.status,
        orderId: id,
      }),
    );

    return updated;
  }

  async getOne(orderId: string) {
    const orderDetails = await this.orderRepository.findOneById(orderId);

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    const order: OrderDetailsRO = {
      id: orderDetails.id,
      total_price: orderDetails.total_price,
      status: orderDetails.status,
      fee_price: orderDetails.fee_price,
      fee_name: orderDetails.fee_name,
      member_name: orderDetails.member_name,
      member_phone: orderDetails.member_phone,
      address_location: orderDetails.address_location,
      updated_at: orderDetails.updated_at,
      items: [],
    };

    order.items = await this.orderItemRepository.getByOrderId(order.id);
    return order;
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
