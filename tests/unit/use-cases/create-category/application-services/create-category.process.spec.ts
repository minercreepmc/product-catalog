import { CategoryAggregate } from '@aggregates/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { CategoryManagementDomainService } from '@domain-services';
import { CreateCategoryProcess } from '@use-cases/create-category/application-services';
import { CreateCategoryDomainOptions } from '@use-cases/create-category/dtos';
import { CategoryNameValueObject } from '@value-objects/category';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateCategoryProcess', () => {
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: MockProxy<CategoryManagementDomainService>;
  let existingCategory: CategoryAggregate;
  const existingName = new CategoryNameValueObject('existing_category');

  beforeEach(() => {
    categoryManagementService = mock<CategoryManagementDomainService>();
    createCategoryProcess = new CreateCategoryProcess(
      categoryManagementService,
    );

    existingCategory = new CategoryAggregate();
    existingCategory.createCategory({ name: existingName });
  });

  describe('validateCategoryMustNotExist', () => {
    it('should not throw an exception when the category does not exist', async () => {
      // Arrange
      const name = new CategoryNameValueObject('nonexistent_category');
      categoryManagementService.doesCategoryNameExist.mockResolvedValue(false);

      // Act
      await (createCategoryProcess as any).validateCategoryMustNotExist(name);

      // Assert
      expect(createCategoryProcess.exceptions.length).toBe(0);
    });

    it('should throw an exception when the category exists', async () => {
      // Arrange
      const name = new CategoryNameValueObject('existing_category');
      categoryManagementService.doesCategoryNameExist.mockResolvedValue(true);

      // Act
      await (createCategoryProcess as any).validateCategoryMustNotExist(name);

      // Assert
      expect(createCategoryProcess.exceptions).toIncludeAllMembers([
        new CategoryDomainExceptions.AlreadyExist(),
      ]);
    });
  });

  describe('execute', () => {
    it('should validate and return a result when a category with the name does not exist', async () => {
      // Arrange
      const domainOptions: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject('New Category'),
        // other properties...
      };
      categoryManagementService.doesCategoryNameExist.mockResolvedValue(false);

      // Act
      const result = await createCategoryProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(
        categoryManagementService.doesCategoryNameExist,
      ).toHaveBeenCalled();
    });

    it('should validate and return an exception when a category with the name exists', async () => {
      // Arrange
      const domainOptions: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject('Existing Category'),
        // other properties...
      };
      categoryManagementService.doesCategoryNameExist.mockResolvedValue(true);

      // Act
      const result = await createCategoryProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.AlreadyExist(),
      ]);
      expect(
        categoryManagementService.doesCategoryNameExist,
      ).toHaveBeenCalled();
    });
  });
});
