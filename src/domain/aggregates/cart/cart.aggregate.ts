import { AggregateRootBase } from '@base/domain';
import {
  CartCreatedDomainEvent,
  CartUpdatedDomainEvent,
} from '@domain-events/cart';
import { CartItemEntity } from '@entities';
import { CartIdValueObject, CartPriceValueObject } from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';
import {
  CartAggregateDetails,
  CreateCartAggregateOptions,
  UpdateCartAggregateOptions,
} from './cart.aggregate.interface';

export class CartAggregate implements AggregateRootBase, CartAggregateDetails {
  items: Map<ProductIdValueObject, CartItemEntity> = new Map();
  id: CartIdValueObject;
  userId: UserIdValueObject;

  constructor(options?: CartAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.items = options.items;
      this.userId = options.userId;
    } else {
      this.id = new CartIdValueObject();
    }
  }

  createCart(options: CreateCartAggregateOptions) {
    const { userId } = options;
    this.userId = userId;
    return new CartCreatedDomainEvent({ id: this.id, userId });
  }

  updateCart(options: UpdateCartAggregateOptions) {
    const { items } = options;
    this.items = items;
    return new CartUpdatedDomainEvent({
      id: this.id,
      items: Array.from(this.items.values()),
      userId: this.userId,
    });
  }

  get totalPrice(): CartPriceValueObject {
    let cartTotal: CartPriceValueObject = new CartPriceValueObject(0);
    for (const item of this.items.values()) {
      if (!item.isEmpty()) {
        cartTotal = cartTotal.plus(item.totalPrice);
      }
    }

    return cartTotal;
  }
}
