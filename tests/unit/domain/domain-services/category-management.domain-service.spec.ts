import { CategoryAggregate } from '@aggregates/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { CategoryRepositoryPort } from '@domain-interfaces';
import {
  CategoryManagementDomainService,
  CreateCategoryOptions,
} from '@domain-services/category-management.domain-service';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CategoryManagementDomainService', () => {
  let service: CategoryManagementDomainService;
  let mockCategoryRepository: MockProxy<CategoryRepositoryPort>;

  beforeEach(() => {
    mockCategoryRepository = mock<CategoryRepositoryPort>();
    service = new CategoryManagementDomainService(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('doesCategoryNameExist', () => {
    it('should return true if category name exists', async () => {
      const existingCategory = new CategoryAggregate();
      const name = new CategoryNameValueObject('Existing Category');
      const options: CreateCategoryOptions = {
        name,
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };
      existingCategory.createCategory(options);

      mockCategoryRepository.findOneByName.mockResolvedValue(existingCategory);

      const doesExist = await service.doesCategoryNameExist(name);

      expect(doesExist).toBe(true);
      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledWith(name);
    });

    it('should return false if category name does not exist', async () => {
      const name = new CategoryNameValueObject('Nonexistent Category');

      mockCategoryRepository.findOneByName.mockResolvedValue(null);

      const doesExist = await service.doesCategoryNameExist(name);

      expect(doesExist).toBe(false);
      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledWith(name);
    });
  });

  describe('createCategory', () => {
    it('should create a category and save it', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Test Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(null);

      await service.createCategory(options);

      expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(
        expect.any(CategoryAggregate),
      );
    });

    it('should throw an exception when creating an existing category', async () => {
      const existingCategory = new CategoryAggregate();
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Existing Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };
      existingCategory.createCategory(options);

      mockCategoryRepository.findOneByName.mockResolvedValue(existingCategory);

      await expect(service.createCategory(options)).rejects.toThrowError(
        new CategoryDomainExceptions.DoesNotExist(),
      );

      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });
  });
});
