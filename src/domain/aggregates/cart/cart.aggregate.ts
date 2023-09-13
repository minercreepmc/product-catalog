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
  totalPrice: CartPriceValueObject;

  calculateTotalPrice(
    items: Map<ProductIdValueObject, CartItemEntity>,
  ): CartPriceValueObject {
    let cartTotal: CartPriceValueObject = new CartPriceValueObject(0);
    for (const item of items.values()) {
      if (!item.isEmpty()) {
        cartTotal = cartTotal.plus(item.getTotalPrice());
      }
    }

    return cartTotal;
  }

  constructor(options?: CartAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.items = options.items;
      this.userId = options.userId;
      this.totalPrice = options.totalPrice;
    } else {
      this.id = new CartIdValueObject();
    }
  }

  createCart(options: CreateCartAggregateOptions) {
    const { userId } = options;
    this.userId = userId;
    this.totalPrice = new CartPriceValueObject(0);
    return new CartCreatedDomainEvent({
      id: this.id,
      userId,
      totalPrice: this.totalPrice,
    });
  }

  updateCart(options: UpdateCartAggregateOptions) {
    const { items } = options;

    this.items = items;
    this.totalPrice = this.calculateTotalPrice(items);

    return new CartUpdatedDomainEvent({
      id: this.id,
      items: Array.from(this.items.values()),
      userId: this.userId,
      totalPrice: this.totalPrice,
    });
  }
}
