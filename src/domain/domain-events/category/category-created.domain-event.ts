import { CategoryAggregate } from '@aggregates/category';
import { DomainEventBase } from '@base/domain';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

export interface CategoryCreatedDetails {
  id: CategoryIdValueObject;
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
}

export class CategoryCreatedDomainEvent
  extends DomainEventBase
  implements CategoryCreatedDetails
{
  constructor(options: CategoryCreatedDetails) {
    super({
      eventName: CategoryCreatedDomainEvent.name,
      entityType: CategoryAggregate.name,
    });
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
  }
  id: CategoryIdValueObject;
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
}
