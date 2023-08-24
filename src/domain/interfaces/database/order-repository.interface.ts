import { OrderAggregate } from '@aggregates/order';
import {
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { RepositoryPort } from './repository.port';

export interface OrderRepositoryPort extends RepositoryPort<OrderAggregate> {
  updateStatusById(
    id: OrderIdValueObject,
    status: OrderStatusValueObject,
  ): Promise<OrderAggregate | null>;
}
export const orderRepositoryDiToken = Symbol('ORDER_REPOSITORY');
