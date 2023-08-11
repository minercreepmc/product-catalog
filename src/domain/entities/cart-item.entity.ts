import { EntityBase } from '@base/domain';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartPriceValueObject,
} from '@value-objects/cart';
import { CartItemIdValueObject } from '@value-objects/cart/cart-item-id.value-object';

export interface CartItemEntityOptions {
  id?: CartItemIdValueObject;
  price: CartPriceValueObject;
  amount: CartAmountValueObject;
  cartId: CartIdValueObject;
}

export class CartItemEntity implements EntityBase {
  id: CartItemIdValueObject;
  cartId: CartIdValueObject;
  price: CartPriceValueObject;
  amount: CartAmountValueObject;

  constructor(options: CartItemEntityOptions) {
    this.id = options.id ?? new CartIdValueObject();
    this.price = options.price;
    this.amount = options.amount;
  }

  get totalPrice(): CartPriceValueObject {
    return new CartPriceValueObject(this.price.value * this.amount.value);
  }

  isEmpty() {
    return this.amount.value === 0;
  }

  updateAmount(amount: CartAmountValueObject) {
    this.amount = amount;
  }

  updatePrice(price: CartPriceValueObject) {
    this.price = price;
  }
}
