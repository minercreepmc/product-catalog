import { CategoryAggregate } from '@aggregates/category';
import {
  CategoryCreatedDetails,
  CategoryCreatedDomainEvent,
  CategoryCreatedOptions,
} from '@domain-events/category/category-created.domain-event';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

describe('CategoryCreatedDomainEvent', () => {
  it('should create a CategoryCreatedDomainEvent correctly', () => {
    const id = new CategoryIdValueObject('some-id');
    const name = new CategoryNameValueObject('some-name');
    const description = new CategoryDescriptionValueObject('some-description');
    const parentIds = [new ParentCategoryIdValueObject('some-parent-id')];
    const subCategoryIds = [
      new SubCategoryIdValueObject('some-sub-category-id'),
    ];
    const productIds = [new ProductIdValueObject('some-product-id')];

    const details: CategoryCreatedDetails = {
      name,
      description,
      parentIds,
      subCategoryIds,
      productIds,
    };

    const options: CategoryCreatedOptions = {
      id,
      details,
    };

    const event = new CategoryCreatedDomainEvent(options);

    expect(event.entityId).toEqual(id);
    expect(event.eventName).toEqual(CategoryCreatedDomainEvent.name);
    expect(event.details).toEqual(details);
    expect(event.entityType).toEqual(CategoryAggregate.name);
  });
});
