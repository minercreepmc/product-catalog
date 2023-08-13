import { SchemaMapperBase } from '@base/database/repositories/pg';
import { CartItemEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartItemIdValueObject,
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
    const { id, amount, cart_id, product_id, product } = model;

    const entity: Partial<CartItemEntity> = {
      id: new CartItemIdValueObject(id),
      amount: amount ? new CartAmountValueObject(amount) : undefined,
      price:
        product && product.price
          ? new CartPriceValueObject(product.price)
          : undefined,
      cartId: new CartIdValueObject(cart_id),
      productId: new ProductIdValueObject(product_id),
    };

    return new CartItemEntity(entity as CartItemEntity);
  }
  toPersistance(model: Partial<CartItemEntity>): Partial<CartItemSchema> {
    const { id, amount, cartId, productId } = model;
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

    return plainToInstance(CartItemSchema, entity);
  }
}
