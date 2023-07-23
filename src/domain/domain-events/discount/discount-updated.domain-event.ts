import { DiscountAggregate } from '@aggregates/discount';
import { DomainEventBase } from '@base/domain';
import {
  DiscountActiveValueObject,
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';

export interface DiscountUpdatedDomainEventDetails {
  id: DiscountIdValueObject;
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
  active: DiscountActiveValueObject;
}

export class DiscountUpdatedDomainEvent extends DomainEventBase {
  id: DiscountIdValueObject;
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
  active: DiscountActiveValueObject;
  constructor(options: DiscountUpdatedDomainEventDetails) {
    super({
      entityType: DiscountAggregate.name,
      eventName: DiscountUpdatedDomainEvent.name,
    });
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
  }
}
