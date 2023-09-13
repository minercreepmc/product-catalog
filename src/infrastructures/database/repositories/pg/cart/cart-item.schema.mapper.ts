import { SchemaMapperBase } from '@base/database/repositories/pg';
import { CartItemEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { ImageUrlValueObject } from '@value-objects';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartItemDiscountValueObject,
  CartItemIdValueObject,
  CartItemNameValueObject,
  CartPriceValueObject,
} from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';
import { plainToInstance } from 'class-transformer';
import { CartItemDetailsSchema, CartItemSchema } from './cart-item.schema';

@Injectable()
export class CartItemSchemaMapper extends SchemaMapperBase<
  CartItemEntity,
  CartItemSchema
> {
  toDomain(model: Partial<CartItemDetailsSchema>): CartItemEntity {
    const {
      id,
      amount,
      cart_id,
      product_id,
      discount,
      name,
      image_url,
      price,
    } = model;

    const entity: Partial<CartItemEntity> = {
      id: new CartItemIdValueObject(id),
      amount: amount ? new CartAmountValueObject(amount) : undefined,
      price: price ? new CartPriceValueObject(price) : undefined,
      cartId: new CartIdValueObject(cart_id),
      productId: new ProductIdValueObject(product_id),
      discount: discount
        ? new CartItemDiscountValueObject(discount)
        : undefined,
      name: name ? new CartItemNameValueObject(name) : undefined,
      imageUrl: image_url ? new ImageUrlValueObject(image_url) : undefined,
    };

    return new CartItemEntity(entity as CartItemEntity);
  }
  toPersistance(model: Partial<CartItemEntity>): Partial<CartItemSchema> {
    const { id, amount, cartId, productId, discount, imageUrl, name, price } =
      model;

    const entity: Partial<CartItemSchema> = {};

    if (id) {
      entity.id = id.value;
    }

    if (amount) {
      entity.amount = amount.value;
    }

    if (cartId) {
      entity.cart_id = cartId.value;
    }

    if (productId) {
      entity.product_id = productId.value;
    }

    if (discount) {
      entity.discount = discount.value;
    }

    if (imageUrl) {
      entity.image_url = imageUrl.value;
    }

    if (name) {
      entity.name = name.value;
    }

    if (price) {
      entity.price = price.value;
    }

    if (price && amount && discount) {
      entity.total_price = CartItemEntity.totalPrice(
        amount,
        price,
        discount,
      ).value;
    }
    console.log(entity);

    return plainToInstance(CartItemSchema, entity);
  }
}
