import { CartAggregate } from '@aggregates/cart';
import { UserIdValueObject } from '@value-objects/user';
import { RepositoryPort } from './repository.port';

export interface CartRepositoryPort extends RepositoryPort<CartAggregate> {
  findOneByUserId(userId: UserIdValueObject): Promise<CartAggregate | null>;
  updateOneByUserId(
    userId: UserIdValueObject,
    newCart: CartAggregate,
  ): Promise<void>;
}
export const cartRepositoryDiToken = Symbol('CART_REPOSITORY');
