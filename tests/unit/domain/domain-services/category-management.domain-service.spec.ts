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
  DoesParentIdsAndCategoryIdsOverlap,
} from '@domain-services/category-management.domain-service';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
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

  describe('doesCategoryIdExist', () => {
    it('should return true if category ID exists', async () => {
      const existingCategory = new CategoryAggregate();
      const id = new CategoryIdValueObject('existing-id');

      mockCategoryRepository.findOneById.mockResolvedValue(existingCategory);

      const doesExist = await service.doesCategoryIdExist(id);

      expect(doesExist).toBe(true);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledWith(id);
    });

    it('should return false if category ID does not exist', async () => {
      const id = new CategoryIdValueObject('nonexistent-id');

      mockCategoryRepository.findOneById.mockResolvedValue(null);

      const doesExist = await service.doesCategoryIdExist(id);

      expect(doesExist).toBe(false);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('doesCategoryIdsExist', () => {
    it('should return true if all category IDs exist', async () => {
      const existingCategory = new CategoryAggregate();
      const ids = [
        new CategoryIdValueObject('existing-id-1'),
        new CategoryIdValueObject('existing-id-2'),
      ];

      mockCategoryRepository.findOneById.mockResolvedValue(existingCategory);

      const doesExist = await service.doesCategoryIdsExist(ids);

      expect(doesExist).toBe(true);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledTimes(
        ids.length,
      );
    });

    it('should return false if any category ID does not exist', async () => {
      const existingCategory = new CategoryAggregate();
      const ids = [
        new CategoryIdValueObject('existing-id-1'),
        new CategoryIdValueObject('nonexistent-id'),
      ];

      mockCategoryRepository.findOneById
        .mockResolvedValueOnce(existingCategory)
        .mockResolvedValueOnce(null);

      const doesExist = await service.doesCategoryIdsExist(ids);

      expect(doesExist).toBe(false);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledTimes(
        ids.length,
      );
    });
  });

  describe('doesParentIdsAndCategoryIdsOverlap', () => {
    it('should return true if parent and sub-category IDs overlap', async () => {
      const options: DoesParentIdsAndCategoryIdsOverlap = {
        parentIds: [new CategoryIdValueObject('overlap-id')],
        subCategoryIds: [new CategoryIdValueObject('overlap-id')],
      };

      const doesOverlap = await service.doesParentIdsAndCategoryIdsOverlap(
        options,
      );

      expect(doesOverlap).toBe(true);
    });

    it('should return false if parent and sub-category IDs do not overlap', async () => {
      const options: DoesParentIdsAndCategoryIdsOverlap = {
        parentIds: [new CategoryIdValueObject('parent-id')],
        subCategoryIds: [new CategoryIdValueObject('sub-category-id')],
      };

      const doesOverlap = await service.doesParentIdsAndCategoryIdsOverlap(
        options,
      );

      expect(doesOverlap).toBe(false);
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
    });
    it('should throw an exception when parent and sub-category IDs overlap', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Test Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('overlap-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('overlap-id')],
      };

      mockCategoryRepository.findOneByName.mockResolvedValue(null);
      mockCategoryRepository.findOneById
        .mockResolvedValueOnce(null) // For checkCategoryMustNotExist
        .mockResolvedValueOnce(new CategoryAggregate()) // For checkParentIdsMustExist
        .mockResolvedValueOnce(new CategoryAggregate()); // For checkSubCategoryIdsMustExist

      mockProductRepository.findOneById.mockResolvedValue(
        new ProductAggregate(),
      );

      await expect(service.createCategory(options)).rejects.toThrowError(
        new CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap(),
      );
    });
  });
});
