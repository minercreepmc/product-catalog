import { ID } from '@base/domain';
import { CartItemEntity } from '@entities';
import { CartItemIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';

export interface CartAggregateDetails {
  id: ID;
  items: Map<CartItemIdValueObject, CartItemEntity>;
  userId: UserIdValueObject;
}

export interface CreateCartAggregateOptions {
  userId: UserIdValueObject;
}

export interface UpdateCartAggregateOptions {
  items: Map<CartItemIdValueObject, CartItemEntity>;
}
