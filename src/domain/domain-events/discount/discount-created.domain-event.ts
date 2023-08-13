import { DiscountAggregate } from '@aggregates/discount';
import { DomainEventBase } from '@base/domain';
import {
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';
import { DiscountActiveValueObject } from '@value-objects/discount/discount-active.value-object';

interface DiscountCreatedDomainEventDetails {
  id: DiscountIdValueObject;
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
  active: DiscountActiveValueObject;
}

export class DiscountCreatedDomainEvent
  extends DomainEventBase
  implements DiscountCreatedDomainEventDetails
{
  constructor(options: DiscountCreatedDomainEventDetails) {
    super({
      entityType: DiscountAggregate.name,
      eventName: DiscountCreatedDomainEvent.name,
    });

    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
  }
  readonly id: DiscountIdValueObject;
  readonly name: DiscountNameValueObject;
  readonly description?: DiscountDescriptionValueObject;
  readonly percentage: DiscountPercentageValueObject;
  readonly active: DiscountActiveValueObject;
}
