import { DomainEventBase } from '@base/domain';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

export interface CategoryUpdatedDomainEventDetails {
  id: CategoryIdValueObject;
  name?: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  productIds?: ProductIdValueObject[];
}

export class CategoryUpdatedDomainEvent
  extends DomainEventBase
  implements CategoryUpdatedDomainEventDetails
{
  constructor(options: CategoryUpdatedDomainEventDetails) {
    super({
      eventName: CategoryUpdatedDomainEvent.name,
      entityType: CategoryUpdatedDomainEvent.name,
    });
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.productIds = options.productIds;
  }
  readonly id: CategoryIdValueObject;
  readonly name?: CategoryNameValueObject;
  readonly description?: CategoryDescriptionValueObject;
  readonly productIds?: ProductIdValueObject[];
}
