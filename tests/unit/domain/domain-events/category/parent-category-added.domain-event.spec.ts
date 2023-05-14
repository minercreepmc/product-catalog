import { CategoryAggregate } from '@aggregates/category';
import {
  ParentCategoryAddedDomainEvent,
  ParentCategoryCreatedDetails,
  ParentCategoryCreatedOptions,
} from '@domain-events/category';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';

describe('ParentCategoryAddedDomainEvent', () => {
  let options: ParentCategoryCreatedOptions;
  let details: ParentCategoryCreatedDetails;
  let categoryId: CategoryIdValueObject;
  let parentIds: ParentCategoryIdValueObject[];

  beforeEach(() => {
    // You would initialize these objects according to your actual implementation
    categoryId =
      new CategoryIdValueObject(/* initialize with your actual value */);
    parentIds = [
      new ParentCategoryIdValueObject(/* initialize with your actual value */),
    ];

    details = {
      parentIds,
    };

    options = {
      id: categoryId,
      details,
    };
  });

  it('should correctly initialize event properties', () => {
    const event = new ParentCategoryAddedDomainEvent(options);

    expect(event.entityId).toEqual(categoryId);
    expect(event.eventName).toEqual(ParentCategoryAddedDomainEvent.name);
    expect(event.details).toEqual(details);
    expect(event.entityType).toEqual(CategoryAggregate.name);
  });

  it('should correctly return parentIds', () => {
    const event = new ParentCategoryAddedDomainEvent(options);

    expect(event.parentIds).toEqual(parentIds);
  });
});
