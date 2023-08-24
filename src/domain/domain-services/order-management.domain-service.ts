import { CreateOrderAggregateOptions, OrderAggregate } from '@aggregates/order';
import {
  orderRepositoryDiToken,
  OrderRepositoryPort,
} from '@domain-interfaces/database/order-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { OrderStatusValueObject } from '@value-objects/order';

@Injectable()
export class OrderManagementDomainService {
  constructor(
    @Inject(orderRepositoryDiToken)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}
  async createOrder(options: CreateOrderAggregateOptions) {
    const order = new OrderAggregate();
    const orderCreated = order.createOrder(options);
    await this.orderRepository.create(order);
    return orderCreated;
  }

  async updateStatus(status: OrderStatusValueObject) {
    const order = new OrderAggregate();
    const orderUpdated = order.updateStatus(status);
    await this.orderRepository.updateStatusById(order.id, status);
    return orderUpdated;
  }
}
