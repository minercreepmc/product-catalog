import { SchemaMapperBase } from '@base/database/repositories/pg';
import { CartItemEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import {
  CartAmountValueObject,
  CartIdValueObject,
  CartItemIdValueObject,
  CartPriceValueObject,
} from '@value-objects/cart';
import { plainToInstance } from 'class-transformer';
import { CartItemSchema } from './cart-item.schema';

@Injectable()
export class CartItemSchemaMapper extends SchemaMapperBase<
  CartItemEntity,
  CartItemSchema
> {
  toDomain(model: CartItemSchema): CartItemEntity {
    const { id, amount, product, cart_id } = model;
    return new CartItemEntity({
      id: new CartItemIdValueObject(id),
      amount: new CartAmountValueObject(amount),
      price: new CartPriceValueObject(product.price),
      cartId: new CartIdValueObject(cart_id),
    });
  }
  toPersistance(model: Partial<CartItemEntity>): Partial<CartItemSchema> {
    const { id, amount, cartId } = model;
    const entity: CartItemSchema = {
      id: id.value,
      cart_id: cartId.value,
      amount: amount.value,
    };

    return plainToInstance(CartItemSchema, entity);
  }
}
