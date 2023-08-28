import { OrderAggregate } from '@aggregates/order';
import { DomainEventBase } from '@base/domain';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';

export interface OrderCreatedDomainEventDetails {
  id: OrderIdValueObject;
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;
  productIds: ProductIdValueObject[];
}

export class OrderCreatedDomainEvent
  extends DomainEventBase
  implements OrderCreatedDomainEventDetails
{
  constructor(options: OrderCreatedDomainEventDetails) {
    super({
      eventName: OrderCreatedDomainEvent.name,
      entityType: OrderAggregate.name,
    });
    this.id = options.id;
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
    this.productIds = options.productIds;
  }

  id: OrderIdValueObject;
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;
  productIds: ProductIdValueObject[];
}
