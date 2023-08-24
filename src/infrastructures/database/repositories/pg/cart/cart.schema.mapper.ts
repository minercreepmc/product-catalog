import { CartAggregate } from '@aggregates/cart';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject, CartPriceValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';
import { CartDetailsSchema, CartSchema } from './cart.schema';
import { CartItemSchemaMapper } from './cart-item.schema.mapper';
import { plainToInstance } from 'class-transformer';
import { CartItemDetailsSchema, CartItemSchema } from './cart-item.schema';

@Injectable()
export class CartSchemaMapper extends SchemaMapperBase<
  CartAggregate,
  CartDetailsSchema
> {
  constructor(private readonly cartItemMapper: CartItemSchemaMapper) {
    super();
  }
  toDomain(model: CartSchema | CartDetailsSchema): CartAggregate {
    const { id, user_id, total_price } = model;
    let items: Partial<CartItemDetailsSchema>[];

    if ('items' in model) {
      items = model.items;
    } else {
      items = [];
    }

    const itemsDomain =
      items &&
      items?.map((item) => {
        return this.cartItemMapper.toDomain(item);
      });

    return new CartAggregate({
      id: new CartIdValueObject(id),
      userId: new UserIdValueObject(user_id),
      items: itemsDomain
        ? new Map(itemsDomain?.map((item) => [item?.id, item]))
        : new Map(),
      totalPrice: new CartPriceValueObject(total_price),
    });
  }
  toPersistance(domain: Partial<CartAggregate>): Partial<CartDetailsSchema> {
    const { id, userId, totalPrice } = domain;

    const items: Partial<CartItemSchema>[] = [];
    const itemIds: string[] = [];

    if (domain.items && domain.items?.size > 0) {
      for (const item of domain?.items?.values()) {
        const model = this.cartItemMapper.toPersistance(item);
        if (model && model.id) {
          items.push(model);
          itemIds.push(model.id);
        }
      }
    }

    const model: Partial<CartDetailsSchema> = {
      id: id?.value,
      items,
      item_ids: itemIds,
      user_id: userId?.value,
      total_price: totalPrice?.value,
    };

    return plainToInstance(CartDetailsSchema, model);
  }
}
