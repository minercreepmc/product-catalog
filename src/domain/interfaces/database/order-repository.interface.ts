import { OrderAggregate } from '@aggregates/order';
import { RepositoryPort } from './repository.port';

export interface OrderRepositoryPort extends RepositoryPort<OrderAggregate> {}
export const orderRepositoryDiToken = Symbol('ORDER_REPOSITORY');
