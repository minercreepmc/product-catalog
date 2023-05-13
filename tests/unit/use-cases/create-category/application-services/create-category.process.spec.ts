import { CategoryAggregate } from '@aggregates/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
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
  let categoryVerificationService: MockProxy<CategoryVerificationDomainService>;
  let existingCategory: CategoryAggregate;
  const existingName = new CategoryNameValueObject('existing_category');

  beforeEach(() => {
    categoryManagementService = mock<CategoryManagementDomainService>();
    productManagementService = mock<ProductManagementDomainService>();
    categoryVerificationService = mock<CategoryVerificationDomainService>();
    createCategoryProcess = new CreateCategoryProcess(
      categoryManagementService,
      categoryVerificationService,
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
      categoryVerificationService.doesCategoryNameExist.mockResolvedValue(true);

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

    it('should not create a category if parentIds and subCategoryIds overlap', async () => {
      // Arrange
      const newCategoryOptions: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject('New Category'),
        parentIds: [new ParentCategoryIdValueObject('same_id')],
        subCategoryIds: [new SubCategoryIdValueObject('same_id')],
        // other properties...
      };
      // Mock the return value
      categoryVerificationService.doesParentIdsAndCategoryIdsOverlap.mockReturnValue(
        true,
      );

      // Act
      const result = await createCategoryProcess.execute(newCategoryOptions);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap(),
      ]);
    });
  });
});
