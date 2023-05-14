import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { AddParentCategoriesProcess } from '@use-cases/add-parent-categories/application-services';
import { AddParentCategoriesDomainOptions } from '@use-cases/add-parent-categories/dtos';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AddParentCategoriesProcess', () => {
  let addParentCategoriesProcess: AddParentCategoriesProcess;
  let categoryManagementService: MockProxy<CategoryManagementDomainService>;
  let categoryVerificationService: MockProxy<CategoryVerificationDomainService>;
  const existingCategoryId = new CategoryIdValueObject('existing_category');
  const parentIds = [
    new ParentCategoryIdValueObject('parent_category_1'),
    new ParentCategoryIdValueObject('parent_category_2'),
  ];

  beforeEach(() => {
    categoryManagementService = mock<CategoryManagementDomainService>();
    categoryVerificationService = mock<CategoryVerificationDomainService>();
    addParentCategoriesProcess = new AddParentCategoriesProcess(
      categoryManagementService,
      categoryVerificationService,
    );
  });

  describe('execute', () => {
    it('should not add parent categories if the categoryId does not exist', async () => {
      // Arrange
      const addParentCategoriesOptions: AddParentCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        parentIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(false);

      // Act
      const result = await addParentCategoriesProcess.execute(
        addParentCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.DoesNotExist(),
      ]);
    });

    it('should not add parent categories if any of the parentIds does not exist', async () => {
      // Arrange
      const addParentCategoriesOptions: AddParentCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        parentIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(false);

      // Act
      const result = await addParentCategoriesProcess.execute(
        addParentCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.ParentIdDoesNotExist(),
      ]);
    });

    it('should not add parent categories if the categoryId and parentIds do overlap', async () => {
      // Arrange
      const addParentCategoriesOptions: AddParentCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        parentIds: [existingCategoryId],
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(true);

      categoryManagementService.addParentCategories.mockResolvedValue(
        new ParentCategoryAddedDomainEvent({
          id: existingCategoryId,
          details: {
            parentIds,
          },
        }),
      );

      categoryVerificationService.doesParentIdsOverlap.mockReturnValue(true);

      // Act
      const result = await addParentCategoriesProcess.execute(
        addParentCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.OverlapWithParentId(),
      ]);
    });

    it('should successfully add parent categories if the categoryId and parentIds exist', async () => {
      // Arrange
      const addParentCategoriesOptions: AddParentCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        parentIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(true);
      categoryManagementService.addParentCategories.mockResolvedValue(
        new ParentCategoryAddedDomainEvent({
          id: existingCategoryId,
          details: {
            parentIds,
          },
        }),
      );

      // Act
      const result = await addParentCategoriesProcess.execute(
        addParentCategoriesOptions,
      );

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(ParentCategoryAddedDomainEvent);
    });
  });
});
