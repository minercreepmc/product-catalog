import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { AddSubCategoriesProcess } from '@use-cases/add-sub-categories/application-services';
import { AddSubCategoriesDomainOptions } from '@use-cases/add-sub-categories/dtos';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AddSubCategoriesProcess', () => {
  let addSubCategoriesProcess: AddSubCategoriesProcess;
  let categoryManagementService: MockProxy<CategoryManagementDomainService>;
  let categoryVerificationService: MockProxy<CategoryVerificationDomainService>;
  const existingCategoryId = new CategoryIdValueObject('existing_category');
  const subCategoryIds = [
    new SubCategoryIdValueObject('sub_category_1'),
    new SubCategoryIdValueObject('sub_category_2'),
  ];

  beforeEach(() => {
    categoryManagementService = mock<CategoryManagementDomainService>();
    categoryVerificationService = mock<CategoryVerificationDomainService>();
    addSubCategoriesProcess = new AddSubCategoriesProcess(
      categoryManagementService,
      categoryVerificationService,
    );
  });

  describe('execute', () => {
    it('should not add subcategories if the categoryId does not exist', async () => {
      // Arrange
      const addSubCategoriesOptions: AddSubCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        subCategoryIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(false);

      // Act
      const result = await addSubCategoriesProcess.execute(
        addSubCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.DoesNotExist(),
      ]);
    });

    it('should not add subcategories if any of the subCategoryIds does not exist', async () => {
      // Arrange
      const addSubCategoriesOptions: AddSubCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        subCategoryIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(false);

      // Act
      const result = await addSubCategoriesProcess.execute(
        addSubCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      ]);
    });

    it('should not add subcategories if the categoryId and subCategoryIds do overlap', async () => {
      // Arrange
      const addSubCategoriesOptions: AddSubCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        subCategoryIds: [existingCategoryId],
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(true);

      categoryManagementService.addSubCategories.mockResolvedValue(
        new SubCategoryAddedDomainEvent({
          id: existingCategoryId,
          details: {
            subCategoryIds,
          },
        }),
      );

      categoryVerificationService.doesSubCategoryIdsOverlap.mockReturnValue(
        true,
      );

      // Act
      const result = await addSubCategoriesProcess.execute(
        addSubCategoriesOptions,
      );

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.OverlapWithSubCategoryId(),
      ]);
    });

    it('should successfully add subcategories if the categoryId and subCategoryIds exist', async () => {
      // Arrange
      const addSubCategoriesOptions: AddSubCategoriesDomainOptions = {
        categoryId: existingCategoryId,
        subCategoryIds,
      };
      categoryVerificationService.doesCategoryIdExist.mockResolvedValue(true);
      categoryVerificationService.doesCategoryIdsExist.mockResolvedValue(true);
      categoryManagementService.addSubCategories.mockResolvedValue(
        new SubCategoryAddedDomainEvent({
          id: existingCategoryId,
          details: {
            subCategoryIds,
          },
        }),
      );

      // Act
      const result = await addSubCategoriesProcess.execute(
        addSubCategoriesOptions,
      );

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(SubCategoryAddedDomainEvent);
    });
  });
});
