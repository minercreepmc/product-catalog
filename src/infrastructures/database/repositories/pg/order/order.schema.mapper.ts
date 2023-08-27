import { OrderAggregate } from '@aggregates/order';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';
import { plainToInstance } from 'class-transformer';
import { OrderSchema } from './order.schema';

@Injectable()
export class OrderSchemaMapper
  implements SchemaMapperBase<OrderAggregate, OrderSchema>
{
  toDomain(model: OrderSchema): OrderAggregate {
    const { status, address, user_id, id, total_price } = model;
    return new OrderAggregate({
      id: new OrderIdValueObject(id),
      address: new OrderAddressValueObject(address),
      userId: new UserIdValueObject(user_id),
      status: new OrderStatusValueObject(status),
      totalPrice: new OrderTotalPriceValueObject(total_price),
    });
  }
  toPersistance(domain: Partial<OrderAggregate>): Partial<OrderSchema> {
    const { id, status, address, userId, totalPrice } = domain;

    const model: Partial<OrderSchema> = {
      id: id?.value,
      status: status?.value,
      address: address?.value,
      user_id: userId?.value,
      total_price: totalPrice?.value,
    };

    return plainToInstance(OrderSchema, model);
  }
}
