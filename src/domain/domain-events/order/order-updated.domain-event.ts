import { OrderAggregate } from '@aggregates/order';
import { DomainEventBase } from '@base/domain';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { ProductIdValueObject } from '@value-objects/product';

export interface OrderUpdatedDomainEventDetails {
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  productIds: ProductIdValueObject[];
}

export class OrderUpdatedDomainEvent
  extends DomainEventBase
  implements OrderUpdatedDomainEventDetails
{
  constructor(options: OrderUpdatedDomainEventDetails) {
    super({
      eventName: OrderUpdatedDomainEvent.name,
      entityType: OrderAggregate.name,
    });
    this.id = options.id;
    this.address = options.address;
    this.status = options.status;
    this.productIds = options.productIds;
  }

  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
  productIds: ProductIdValueObject[];
}
