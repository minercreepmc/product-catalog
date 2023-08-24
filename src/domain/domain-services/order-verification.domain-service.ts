import { OrderDomainExceptions } from '@domain-exceptions/order';
import {
  orderRepositoryDiToken,
  OrderRepositoryPort,
} from '@domain-interfaces/database/order-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { OrderIdValueObject } from '@value-objects/order';

@Injectable()
export class OrderVerificationDomainService {
  constructor(
    @Inject(orderRepositoryDiToken)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async doesOrderExist(id: OrderIdValueObject) {
    const exist = await this.orderRepository.findOneById(id);

    return !!exist;
  }

  async findOneOrThrow(id: OrderIdValueObject) {
    const order = await this.orderRepository.findOneById(id);

    if (!order) {
      throw new OrderDomainExceptions.DoesNotExist();
    }

    return order;
  }
}
