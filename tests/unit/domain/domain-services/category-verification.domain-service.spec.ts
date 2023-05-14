import { CategoryAggregate } from '@aggregates/category';
import { ProductAggregate } from '@aggregates/product';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryRepositoryPort,
  ProductRepositoryPort,
} from '@domain-interfaces';
import {
  AddParentCategoriesServiceOptions,
  AddSubCategoriesServiceOptions,
  CategoryVerificationDomainService,
  CreateCategoryOptions,
} from '@domain-services';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CategoryVerificationDomainService', () => {
  let service: CategoryVerificationDomainService;
  let mockCategoryRepository: MockProxy<CategoryRepositoryPort>;
  let mockProductRepository: MockProxy<ProductRepositoryPort>;

  beforeEach(() => {
    mockCategoryRepository = mock<CategoryRepositoryPort>();
    mockProductRepository = mock<ProductRepositoryPort>();
    service = new CategoryVerificationDomainService(
      mockCategoryRepository,
      mockProductRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyCategoryCreationOptions', () => {
    it('should pass verification with correct options', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Test Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(null);
      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );
      mockProductRepository.findOneById.mockResolvedValue(
        new ProductAggregate(),
      );

      await expect(
        service.verifyCategoryCreationOptions(options),
      ).resolves.not.toThrow();
    });

    it('should throw an exception when category name already exists', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Existing Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(
        new CategoryAggregate(),
      );

      await expect(
        service.verifyCategoryCreationOptions(options),
      ).rejects.toThrow(CategoryDomainExceptions.AlreadyExist);
    });

    it('should throw an exception when parent ID or sub category ID does not exist', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Test Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('nonexistent-parent-id')],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(null);
      mockCategoryRepository.findOneById.mockResolvedValueOnce(null); // Parent ID does not exist
      mockProductRepository.findOneById.mockResolvedValue(
        new ProductAggregate(),
      );

      await expect(
        service.verifyCategoryCreationOptions(options),
      ).rejects.toThrow();
    });
    // Add other cases for each exception that can be thrown
  });

  // Add test cases for verifyAddSubCategoriesOptions
  describe('verifyAddSubCategoriesOptions', () => {
    it('should pass verification with correct options', async () => {
      const options: AddSubCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('some-category-id'),
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );

      await expect(
        service.verifyAddSubCategoriesOptions(options),
      ).resolves.not.toThrow();
    });

    it('should throw an exception when category or sub category does not exist', async () => {
      const options: AddSubCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('nonexistent-category-id'),
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.verifyAddSubCategoriesOptions(options),
      ).rejects.toThrow();
    });

    it('should throw an exception when overlap with sub category ids', async () => {
      const options: AddSubCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('same-category-id'),
        subCategoryIds: [new SubCategoryIdValueObject('same-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );

      await expect(
        service.verifyAddSubCategoriesOptions(options),
      ).rejects.toThrow();
    });
  });

  describe('verifyAddParentCategoriesOptions', () => {
    it('should pass verification with correct options', async () => {
      const options: AddParentCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('some-category-id'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );

      await expect(
        service.verifyAddParentCategoriesOptions(options),
      ).resolves.not.toThrow();
    });

    it('should throw an exception when category or parent category does not exist', async () => {
      const options: AddParentCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('nonexistent-category-id'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.verifyAddParentCategoriesOptions(options),
      ).rejects.toThrow();
    });

    it('should throw an exception when overlap with sub category ids', async () => {
      const options: AddParentCategoriesServiceOptions = {
        categoryId: new CategoryIdValueObject('same-category-id'),
        parentIds: [new ParentCategoryIdValueObject('same-category-id')],
      };

      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );

      await expect(
        service.verifyAddParentCategoriesOptions(options),
      ).rejects.toThrow();
    });
  });

  // Add test cases for other methods
});
