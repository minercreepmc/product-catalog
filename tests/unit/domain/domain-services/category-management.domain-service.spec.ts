import { CategoryAggregate } from '@aggregates/category';
import { ProductAggregate } from '@aggregates/product';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import {
  CategoryRepositoryPort,
  ProductRepositoryPort,
} from '@domain-interfaces';
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
  let mockProductRepository: MockProxy<ProductRepositoryPort>;

  beforeEach(() => {
    mockCategoryRepository = mock<CategoryRepositoryPort>();
    mockProductRepository = mock<ProductRepositoryPort>();
    service = new CategoryManagementDomainService(
      mockCategoryRepository,
      mockProductRepository,
    );
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
      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );
      mockProductRepository.findOneById.mockResolvedValue(
        new ProductAggregate(),
      );

      await service.createCategory(options);

      expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(
        expect.any(CategoryAggregate),
      );
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledTimes(2); // For parent and sub-category
      expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1); // For product
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
      mockCategoryRepository.findOneById.mockResolvedValue(
        new CategoryAggregate(),
      );
      mockProductRepository.findOneById.mockResolvedValue(
        new ProductAggregate(),
      );

      await expect(service.createCategory(options)).rejects.toThrowError(
        new CategoryDomainExceptions.AlreadyExist(),
      );

      // expect(mockCategoryRepository.findOneByName).toHaveBeenCalledTimes(1);
      // expect(mockCategoryRepository.findOneByName).toHaveBeenCalledWith(
      //   options.name,
      // );
      // expect(mockCategoryRepository.findOneById).toHaveBeenCalled();
      // expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1); // For product
    });
  });
});
