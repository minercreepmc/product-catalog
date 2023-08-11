import { CartAggregate } from '@aggregates/cart';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';
import { CartDetailsSchema, CartSchema } from './cart.schema';
import { CartItemSchemaMapper } from './cart-item.schema.mapper';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartSchemaMapper extends SchemaMapperBase<
  CartAggregate,
  CartDetailsSchema
> {
  constructor(private readonly cartItemMapper: CartItemSchemaMapper) {
    super();
  }
  toDomain(model: CartDetailsSchema): CartAggregate {
    const { id, user, items } = model;

    const itemsDomain =
      items &&
      items?.map((item) => {
        return this.cartItemMapper.toDomain(item);
      });

    return new CartAggregate({
      id: new CartIdValueObject(id),
      userId: new UserIdValueObject(user?.id),
      items:
        itemsDomain && new Map(itemsDomain?.map((item) => [item?.id, item])),
    });
  }
  toPersistance(domain: Partial<CartAggregate>): Partial<CartSchema> {
    const { id, userId, items } = domain;
    console.log(domain);

    const model: CartSchema = {
      id: id?.value,
      userId: userId?.value,
      itemIds: items && Array.from(items?.keys())?.map?.((id) => id?.value),
    };

    return plainToInstance(CartSchema, model);
  }
}
