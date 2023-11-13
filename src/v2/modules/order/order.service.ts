import { GlobalEvents, RequestWithUser } from '@constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CartRepository } from '@v2/cart';
import { OrderItemRepository } from '@v2/order-item/order-item.repository';
import { OrderRepository } from './order.repository';
import { AddressRepository } from '@v2/address';
import { OrderCreatedEvent, OrderUpdatedEvent } from './event';
import type { OrderGetAllDto, UpdateOrderDto } from './dto';
import { CreateOrderRO, OrderGetDetailsRO, OrderGetAllRO } from './ro';
import { USERS_ROLE } from '@v2/users/constants';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly addressRepository: AddressRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(memberId: string) {
    const cartId = await this.cartRepository.getIdByUserId(memberId);
    if (!cartId) {
      throw new NotFoundException('Cart not found');
    }

    const addressId = await this.cartRepository.getAddressId(cartId);
    if (!addressId) {
      throw new NotFoundException('Address not found');
    }

    const shippingFeeId = await this.cartRepository.getShippingFeeId(cartId);
    if (!shippingFeeId) {
      throw new NotFoundException('Shipping fee not found');
    }

    const shippingMethodId = await this.cartRepository.getShippingMethodId(
      cartId,
    );
    if (!shippingMethodId) {
      throw new NotFoundException('Shipping method not found');
    }

    const location = await this.addressRepository.getAddressLocation(addressId);
    const totalPrice = await this.cartRepository.getTotalPrice(cartId);

    const created = await this.orderRepository.store({
      totalPrice,
      memberId,
      addressId: location,
      shippingFeeId,
      shippingMethodId,
    });

    if (!created) {
      throw new Error('Cannot create order details');
    }

    const itemIds = await this.orderItemRepository.createOrderItems(
      created.id,
      cartId,
    );

    this.eventEmitter.emit(
      GlobalEvents.ORDER.CREATED,
      new OrderCreatedEvent({
        cartId,
      }),
    );
    return plainToInstance(
      CreateOrderRO,
      {
        ...created,
        cartId,
        itemIds,
      },
      { excludeExtraneousValues: true },
    );
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
    const orderDetails = await this.orderRepository.getOne(orderId);

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.orderItemRepository.getByOrderId(orderDetails.id);
    return plainToInstance(
      OrderGetDetailsRO,
      {
        ...orderDetails,
        items,
      },
      { excludeExtraneousValues: true },
    );
  }

  async getAll(dto: OrderGetAllDto, req: RequestWithUser) {
    const userId =
      req.user.role === USERS_ROLE.MEMBER ? req.user.id : undefined;
    const response = await this.orderRepository.findAll(dto, userId);

    return plainToInstance(OrderGetAllRO, response, {
      excludeExtraneousValues: true,
    });
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
