import { CategoryAggregate } from '@aggregates/category';
import { ProductAggregate } from '@aggregates/product';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryRepositoryPort,
  ProductRepositoryPort,
} from '@domain-interfaces';
import {
  CategoryVerificationDomainService,
  CreateCategoryOptions,
} from '@domain-services';
import {
  CategoryDescriptionValueObject,
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

  // Add test cases for other methods
});
