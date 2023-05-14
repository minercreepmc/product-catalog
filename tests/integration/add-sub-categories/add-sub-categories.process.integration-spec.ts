import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AddSubCategoriesProcess } from '@use-cases/add-sub-categories/application-services';
import { AddSubCategoriesDomainOptions } from '@use-cases/add-sub-categories/dtos';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

describe('AddSubCategoriesProcess Integration Test', () => {
  let addSubCategoriesProcess: AddSubCategoriesProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let categoryVerificationService: CategoryVerificationDomainService;

  let validCategoryId: CategoryIdValueObject;
  const validSubCategoryIds: SubCategoryIdValueObject[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );
    categoryVerificationService = moduleFixture.get(
      CategoryVerificationDomainService,
    );

    addSubCategoriesProcess = new AddSubCategoriesProcess(
      categoryManagementService,
      categoryVerificationService,
    );

    // Here, you need to create a valid category and subcategories
    // similar to how it was done in the provided example.
    // After that, you should assign their IDs to the validCategoryId and validSubCategoryIds variables
    const { entityId: categoryId } =
      await categoryManagementService.createCategory({
        name: new CategoryNameValueObject(faker.commerce.productName()),
      });

    const { entityId: subCategoryIds } =
      await categoryManagementService.createCategory({
        name: new CategoryNameValueObject(faker.commerce.productName()),
      });

    validCategoryId = categoryId;
    validSubCategoryIds.push(subCategoryIds);
  });

  describe('execute', () => {
    it('should add subcategories successfully when the category and subcategories exist', async () => {
      // Arrange
      const domainOptions: AddSubCategoriesDomainOptions = {
        categoryId: validCategoryId,
        subCategoryIds: validSubCategoryIds,
      };

      // Act
      const result = await addSubCategoriesProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(SubCategoryAddedDomainEvent);
      // Add more assertions for the added subcategories' properties or domain events.
    });

    it('should not add subcategories when the category or subcategories do not exist', async () => {
      // Arrange
      const domainOptions: AddSubCategoriesDomainOptions = {
        categoryId: validCategoryId,
        subCategoryIds: [new SubCategoryIdValueObject(faker.datatype.uuid())],
      };

      // Act
      const result = await addSubCategoriesProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      ]);
      // Add more assertions for the expected exceptions.
    });

    it('should not add subcategories when subCategoryIds overlap with categoryId', async () => {
      // Arrange
      const domainOptions: AddSubCategoriesDomainOptions = {
        categoryId: validCategoryId,
        subCategoryIds: [validCategoryId],
      };

      // Act
      const result = await addSubCategoriesProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.OverlapWithSubCategoryId(),
      ]);
    });
  });
});
