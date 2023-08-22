import { DomainExceptionBase, EntityBase } from '@base/domain';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartPriceValueObject,
} from '@value-objects/cart';
import { CartItemIdValueObject } from '@value-objects/cart/cart-item-id.value-object';
import { ProductIdValueObject } from '@value-objects/product';

export interface CartItemEntityOptions {
  id?: CartItemIdValueObject;
  price: CartPriceValueObject;
  productId: ProductIdValueObject;
  amount: CartAmountValueObject;
  cartId?: CartIdValueObject;
}

export class CartItemEntity implements EntityBase {
  id: CartItemIdValueObject;
  productId: ProductIdValueObject;
  cartId?: CartIdValueObject;
  price: CartPriceValueObject;
  amount: CartAmountValueObject;

  validate(): DomainExceptionBase[] {
    return [this.id?.validate?.(), this.productId?.validate()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

  constructor(options: CartItemEntityOptions) {
    this.id = options.id ?? new CartIdValueObject();
    this.price = options.price;
    this.amount = options.amount;
    this.productId = options.productId;
    this.cartId = options.cartId;
  }

  get totalPrice(): CartPriceValueObject {
    return new CartPriceValueObject(this.price!.value * this.amount!.value);
  }

  get value() {
    return {
      id: this.id.value,
      price: this.price?.value,
      productId: this.productId.value,
      amount: this.amount?.value,
      cartId: this.cartId?.value,
    };
  }

  isEmpty() {
    return this.amount?.value === 0;
  }

  updateAmount(amount: CartAmountValueObject) {
    this.amount = amount;
  }

  updatePrice(price: CartPriceValueObject) {
    this.price = price;
  }
}
