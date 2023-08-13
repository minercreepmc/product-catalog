import { AggregateRootBase } from '@base/domain';
import {
  DiscountCreatedDomainEvent,
  DiscountRemovedDomainEvent,
  DiscountUpdatedDomainEvent,
} from '@domain-events/discount';
import {
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';
import { DiscountActiveValueObject } from '@value-objects/discount/discount-active.value-object';

export interface DiscountAggregateDetails {
  id: DiscountIdValueObject;
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
  active: DiscountActiveValueObject;
}

export interface DiscountAggregateCreateOptions {
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
}

export interface DiscountAggregateUpdateOptions {
  id: DiscountIdValueObject;
  name?: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage?: DiscountPercentageValueObject;
  active?: DiscountActiveValueObject;
}

export class DiscountAggregate
  implements AggregateRootBase, DiscountAggregateDetails
{
  constructor(options?: DiscountAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.description = options.description;
      this.percentage = options.percentage;
      this.active = options.active;
    } else {
      this.id = new DiscountIdValueObject();
      this.active = new DiscountActiveValueObject(false);
    }
  }

  readonly id: DiscountIdValueObject;
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
  active: DiscountActiveValueObject;

  createDiscount(options: DiscountAggregateCreateOptions) {
    const { name, description, percentage } = options;

    this.name = name;
    this.description = description;
    this.percentage = percentage;

    return new DiscountCreatedDomainEvent({
      id: this.id,
      name: this.name,
      description: this.description,
      percentage: this.percentage,
      active: this.active,
    });
  }

  updateDiscount(options: DiscountAggregateUpdateOptions) {
    const { name, description, percentage, active } = options;

    if (name) {
      this.name = name;
    }

    if (description) {
      this.description = description;
    }

    if (percentage) {
      this.percentage = percentage;
    }

    if (active) {
      this.active = active;
    }

    return new DiscountUpdatedDomainEvent({
      id: this.id,
      name: this.name,
      description: this.description,
      percentage: this.percentage,
      active: this.active,
    });
  }

  removeDiscount() {
    this.active = new DiscountActiveValueObject(false);
    return new DiscountRemovedDomainEvent({
      id: this.id,
    });
  }
}
