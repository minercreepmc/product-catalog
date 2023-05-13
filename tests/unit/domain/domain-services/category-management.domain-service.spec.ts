import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryRepositoryPort } from '@domain-interfaces';
import {
  CategoryManagementDomainService,
  CreateCategoryOptions,
} from '@domain-services/category-management.domain-service';
import { CategoryVerificationDomainService } from '@domain-services/category-verification.domain-service';
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
  let mockCategoryVerification: MockProxy<CategoryVerificationDomainService>;

  beforeEach(() => {
    mockCategoryRepository = mock<CategoryRepositoryPort>();
    mockCategoryVerification = mock<CategoryVerificationDomainService>();
    service = new CategoryManagementDomainService(
      mockCategoryRepository,
      mockCategoryVerification,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      mockCategoryVerification.verifyCategoryCreationOptions.mockResolvedValue();

      const categoryCreated = await service.createCategory(options);

      expect(categoryCreated).toBeInstanceOf(CategoryCreatedDomainEvent);
    });

    it('should throw an exception when category creation verification fails', async () => {
      const options: CreateCategoryOptions = {
        name: new CategoryNameValueObject('Existing Category'),
        productIds: [new ProductIdValueObject('some-product-id')],
        subCategoryIds: [new SubCategoryIdValueObject('some-sub-category-id')],
        description: new CategoryDescriptionValueObject('some-description'),
        parentIds: [new ParentCategoryIdValueObject('some-parent-id')],
      };

      mockCategoryVerification.verifyCategoryCreationOptions.mockRejectedValue(
        new Error('Verification failed'),
      );

      await expect(service.createCategory(options)).rejects.toThrowError(
        new Error('Verification failed'),
      );
    });
  });
});
