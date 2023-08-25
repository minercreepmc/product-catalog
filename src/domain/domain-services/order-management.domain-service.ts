import {
  CreateOrderAggregateOptions,
  OrderAggregate,
  UpdateOrderAggregateOptions,
} from '@aggregates/order';
import {
  orderRepositoryDiToken,
  OrderRepositoryPort,
  unitOfWorkDiToken,
  UnitOfWorkPort,
} from '@domain-interfaces/database';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { OrderIdValueObject } from '@value-objects/order';
import { OrderVerificationDomainService } from './order-verification.domain-service';

@Injectable()
export class OrderManagementDomainService {
  constructor(
    @Inject(orderRepositoryDiToken)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly orderVerification: OrderVerificationDomainService,
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly eventBus: EventBus,
  ) {}
  async createOrder(options: CreateOrderAggregateOptions) {
    const orderCreated = await this.unitOfWork.runInTransaction(async () => {
      const order = new OrderAggregate();
      const orderCreated = order.createOrder(options);
      await this.orderRepository.create(order);
      return orderCreated;
    });

    this.eventBus.publish(orderCreated);
    return orderCreated;
  }

  async updateOrder(
    id: OrderIdValueObject,
    payload: UpdateOrderAggregateOptions,
  ) {
    const order = await this.orderVerification.findOneOrThrow(id);
    const orderUpdated = order.updateOrder(payload);
    await this.orderRepository.updateOneById(id, order);
    return orderUpdated;
  }
}
