import { ProductAggregate } from '@aggregates/product';
import { DomainEventBase } from '@base/domain';
import { ProductIdValueObject } from '@value-objects/product';

export interface ProductRemovedDomainEventDetails {
  id: ProductIdValueObject;
}

export class ProductRemovedDomainEvent
  extends DomainEventBase
  implements ProductRemovedDomainEventDetails
{
  constructor(options: ProductRemovedDomainEventDetails) {
    super({
      eventName: ProductRemovedDomainEvent.name,
      entityType: ProductAggregate.name,
    });
    this.id = options.id;
  }
  readonly id: ProductIdValueObject;
}
