import { OrderAggregate } from '@aggregates/order';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject, CartItemIdValueObject } from '@value-objects/cart';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';
import { plainToInstance } from 'class-transformer';
import { OrderSchema } from './order.schema';

@Injectable()
export class OrderSchemaMapper
  implements SchemaMapperBase<OrderAggregate, OrderSchema>
{
  toDomain(model: OrderSchema): OrderAggregate {
    const { status, address, cart_id, user_id, id } = model;
    return new OrderAggregate({
      id: new OrderIdValueObject(id),
      cartId: new CartIdValueObject(cart_id),
      address: new OrderAddressValueObject(address),
      userId: new UserIdValueObject(user_id),
      status: new OrderStatusValueObject(status),
    });
  }
  toPersistance(domain: Partial<OrderAggregate>): Partial<OrderSchema> {
    const { id, status, address, cartId, userId } = domain;

    const model: Partial<OrderSchema> = {
      id: id?.value,
      status: status?.value,
      address: address?.value,
      cart_id: cartId?.value,
      user_id: userId?.value,
    };

    return plainToInstance(OrderSchema, model);
  }
}
