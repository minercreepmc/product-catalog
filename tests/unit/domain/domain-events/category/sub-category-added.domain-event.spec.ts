import { CategoryAggregate } from '@aggregates/category';
import {
  SubCategoryCreatedDetails,
  SubCategoryAddedDomainEvent,
  SubCategoryCreatedOptions,
} from '@domain-events/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

describe('SubCategoryAddedDomainEvent', () => {
  let options: SubCategoryCreatedOptions;
  let details: SubCategoryCreatedDetails;
  let categoryId: CategoryIdValueObject;
  let subCategoryIds: SubCategoryIdValueObject[];

  beforeEach(() => {
    // You would initialize these objects according to your actual implementation
    categoryId =
      new CategoryIdValueObject(/* initialize with your actual value */);
    subCategoryIds = [
      new SubCategoryIdValueObject(/* initialize with your actual value */),
    ];

    details = {
      subCategoryIds,
    };

    options = {
      id: categoryId,
      details,
    };
  });

  it('should correctly initialize event properties', () => {
    const event = new SubCategoryAddedDomainEvent(options);

    expect(event.entityId).toEqual(categoryId);
    expect(event.eventName).toEqual(SubCategoryAddedDomainEvent.name);
    expect(event.details).toEqual(details);
    expect(event.entityType).toEqual(CategoryAggregate.name);
  });

  it('should correctly return subCategoryIds', () => {
    const event = new SubCategoryAddedDomainEvent(options);

    expect(event.subCategoryIds).toEqual(subCategoryIds);
  });
});
