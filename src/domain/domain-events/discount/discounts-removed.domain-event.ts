import { DiscountAggregate } from '@aggregates/discount';
import { DomainEventBase } from '@base/domain';
import { DiscountIdValueObject } from '@value-objects/discount';

export interface DiscountsRemovedDomainEventDetails {
  id: DiscountIdValueObject;
}

export class DiscountRemovedDomainEvent
  extends DomainEventBase
  implements DiscountsRemovedDomainEventDetails
{
  constructor(options: DiscountsRemovedDomainEventDetails) {
    super({
      eventName: DiscountRemovedDomainEvent.name,
      entityType: DiscountAggregate.name,
    });
    this.id = options.id;
  }
  id: DiscountIdValueObject;
}
