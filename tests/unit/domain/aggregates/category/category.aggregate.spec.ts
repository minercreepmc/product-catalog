import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

describe('CategoryAggregate', () => {
  let categoryAggregate: CategoryAggregate;

  beforeEach(() => {
    categoryAggregate = new CategoryAggregate();
  });

  describe('createCategory', () => {
    it('should create a CategoryCreatedDomainEvent with correct properties', () => {
      // Arrange
      const name = new CategoryNameValueObject('some-name');
      const description = new CategoryDescriptionValueObject(
        'some-description',
      );
      const parentIds = [new ParentCategoryIdValueObject('some-parent-id')];
      const subCategoryIds = [
        new SubCategoryIdValueObject('some-sub-category-id'),
      ];
      const productIds = [new ProductIdValueObject('some-product-id')];

      const options: CreateCategoryAggregateOptions = {
        name,
        description,
        parentIds,
        subCategoryIds,
        productIds,
      };

      // Act
      const result = categoryAggregate.createCategory(options);

      // Assert
      expect(result).toBeDefined();
      expect(result.entityId).toEqual(categoryAggregate.id);
      expect(result.details.name).toEqual(name);
      expect(result.details.description).toEqual(description);
      expect(result.details.parentIds).toEqual(parentIds);
      expect(result.details.subCategoryIds).toEqual(subCategoryIds);
      expect(result.details.productIds).toEqual(productIds);
    });
  });
});