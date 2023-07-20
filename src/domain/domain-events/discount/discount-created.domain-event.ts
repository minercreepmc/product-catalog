import { DomainEventBase } from '@base/domain';
import { DiscountEntity } from '@src/domain/entities/discount';
import {
  DiscountIdValueObject,
  DiscountNameValueObject,
} from '@value-objects/discount';

interface DiscountCreatedDomainEventDetails {
  id: DiscountIdValueObject;
  name: DiscountNameValueObject;
}

export class DiscountCreatedDomainEvent
  extends DomainEventBase
  implements DiscountCreatedDomainEventDetails
{
  readonly id: DiscountIdValueObject;
  readonly name: DiscountNameValueObject;
  constructor(options: DiscountCreatedDomainEventDetails) {
    super({
      entityType: DiscountEntity.name,
      eventName: DiscountCreatedDomainEvent.name,
    });

    this.id = options.id;
    this.name = options.name;
  }
}
