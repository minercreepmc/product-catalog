import { DomainExceptionBase, EntityBase } from '@base/domain';
import { ImageUrlValueObject } from '@value-objects';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartPriceValueObject,
  CartItemDiscountValueObject,
  CartItemNameValueObject,
  CartItemIdValueObject,
} from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';

export interface CartItemEntityOptions {
  id?: CartItemIdValueObject;
  price: CartPriceValueObject;
  totalPrice?: CartPriceValueObject;
  productId: ProductIdValueObject;
  amount: CartAmountValueObject;
  discount?: CartItemDiscountValueObject;
  name: CartItemNameValueObject;
  imageUrl?: ImageUrlValueObject;
  cartId: CartIdValueObject;
}

export interface CartItemUpdateOptions {
  price?: CartPriceValueObject;
  amount?: CartAmountValueObject;
  discount?: CartItemDiscountValueObject;
}

export class CartItemEntity implements EntityBase, CartItemEntityOptions {
  id: CartItemIdValueObject;
  productId: ProductIdValueObject;
  cartId: CartIdValueObject;
  price: CartPriceValueObject;
  discount: CartItemDiscountValueObject;
  amount: CartAmountValueObject;
  name: CartItemNameValueObject;
  imageUrl?: ImageUrlValueObject;

  validate(): DomainExceptionBase[] {
    return [this.id?.validate?.(), this.productId?.validate()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

  constructor(options: CartItemEntityOptions) {
    this.id = options.id ?? new CartItemIdValueObject();
    this.price = options.price;
    this.amount = options.amount;
    this.productId = options.productId;
    this.cartId = options.cartId;
    this.discount = options.discount || new CartItemDiscountValueObject(0);
    this.name = options.name;
    this.imageUrl = options.imageUrl;
  }

  getTotalPrice(): CartPriceValueObject {
    console.log(this.price.value);
    console.log(this.discount.value);
    console.log(this.amount.value);
    return new CartPriceValueObject(
      (this.price.value - (this.price.value * this.discount.value) / 100) *
        this.amount.value,
    );
  }

  static totalPrice(
    amount: CartAmountValueObject,
    price: CartPriceValueObject,
    discount: CartItemDiscountValueObject,
  ): CartPriceValueObject {
    return new CartPriceValueObject(
      (price.value - (price.value * discount.value) / 100) * amount.value,
    );
  }

  get value() {
    return {
      id: this.id.value,
      price: this.price?.value,
      productId: this.productId.value,
      amount: this.amount?.value,
      cartId: this.cartId?.value,
      name: this.name.value,
      imageUrl: this.imageUrl?.value,
    };
  }

  get discountPrice() {
    return this.price.value - this.price?.value * (this.discount?.value / 100);
  }

  isEmpty() {
    return this.amount?.value === 0;
  }

  updateItem(options: CartItemUpdateOptions) {
    if (options.price) {
      this.price = options.price;
    }

    if (options.amount) {
      this.amount = options.amount;
    }

    if (options.discount) {
      this.discount = options.discount;
    }
  }

  updateAmount(amount: CartAmountValueObject) {
    this.amount = amount;
  }

  updatePrice(price: CartPriceValueObject) {
    this.price = price;
  }
}
