import { CategoryAggregate } from '@aggregates/category';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  CategoryManagementDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { CreateCategoryProcess } from '@use-cases/create-category/application-services';
import { CreateCategoryDomainOptions } from '@use-cases/create-category/dtos';
import {
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateCategoryProcess', () => {
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: MockProxy<CategoryManagementDomainService>;
  let productManagementService: MockProxy<ProductManagementDomainService>;
  let existingCategory: CategoryAggregate;
  const existingName = new CategoryNameValueObject('existing_category');

  beforeEach(() => {
    categoryManagementService = mock<CategoryManagementDomainService>();
    productManagementService = mock<ProductManagementDomainService>();
    createCategoryProcess = new CreateCategoryProcess(
      categoryManagementService,
      productManagementService,
    );

    existingCategory = new CategoryAggregate();
    existingCategory.createCategory({ name: existingName });
  });

  describe('execute', () => {
    it('should not create a category if it already exists', async () => {
      // Arrange
      const newCategoryOptions: CreateCategoryDomainOptions = {
        name: existingName,
        // other properties...
      };
      categoryManagementService.doesCategoryNameExist.mockResolvedValue(true);

      // Act
      const result = await createCategoryProcess.execute(newCategoryOptions);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.AlreadyExist(),
      ]);
    });

    it('should not create a category if parentIds, subCategoryIds and productIds was provided but does not exist', async () => {
      // Arrange
      const newCategoryOptions: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject('New Category'),
        parentIds: [new ParentCategoryIdValueObject('not_existing_parent_id')],
        subCategoryIds: [
          new SubCategoryIdValueObject('not_existing_sub_category_id'),
        ],
        productIds: [new ProductIdValueObject('not_existing_product_id')],
        // other properties...
      };

      // Act
      const result = await createCategoryProcess.execute(newCategoryOptions);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.ParentIdDoesNotExist(),
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
        new ProductDomainExceptions.DoesNotExist(),
      ]);
    });
    // Add similar tests to cover other failure scenarios (parentIds and subCategoryIds not existing)
  });
});
