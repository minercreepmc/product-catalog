import { OrderAggregate } from '@aggregates/order';
import { DomainEventBase } from '@base/domain';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';

export interface OrderUpdatedDomainEventDetails {
  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
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
  }

  id: OrderIdValueObject;
  address: OrderAddressValueObject;
  status: OrderStatusValueObject;
}
