import { ID } from '@base/domain';
import type { CartItemEntity } from '@entities';
import type { ProductIdValueObject } from '@value-objects/product';
import type { UserIdValueObject } from '@value-objects/user';

export interface CartAggregateDetails {
  id: ID;
  items: Map<ProductIdValueObject, CartItemEntity>;
  userId: UserIdValueObject;
}

export interface CreateCartAggregateOptions {
  userId: UserIdValueObject;
}

export interface UpdateCartAggregateOptions {
  items: Map<ProductIdValueObject, CartItemEntity>;
}
