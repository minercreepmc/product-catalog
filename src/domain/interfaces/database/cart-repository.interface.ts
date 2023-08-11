import { CartAggregate } from '@aggregates/cart';
import { RepositoryPort } from './repository.port';

export interface CartRepositoryPort extends RepositoryPort<CartAggregate> {}
export const cartRepositoryDiToken = Symbol('CART_REPOSITORY');
