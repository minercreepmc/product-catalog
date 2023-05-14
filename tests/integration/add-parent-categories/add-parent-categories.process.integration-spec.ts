import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AddParentCategoriesProcess } from '@use-cases/add-parent-categories/application-services';
import { AddParentCategoriesDomainOptions } from '@use-cases/add-parent-categories/dtos';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

describe('AddParentCategoriesProcess Integration Test', () => {
  let addParentCategoriesProcess: AddParentCategoriesProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let categoryVerificationService: CategoryVerificationDomainService;

  let validCategoryId: CategoryIdValueObject;
  const validParentCategoryIds: CategoryIdValueObject[] = [];

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

    addParentCategoriesProcess = new AddParentCategoriesProcess(
      categoryManagementService,
      categoryVerificationService,
    );

    const { entityId: categoryId } =
      await categoryManagementService.createCategory({
        name: new CategoryNameValueObject(faker.commerce.productName()),
      });

    const { entityId: parentCategoryId } =
      await categoryManagementService.createCategory({
        name: new CategoryNameValueObject(faker.commerce.productName()),
      });

    validCategoryId = categoryId;
    validParentCategoryIds.push(parentCategoryId);
  });

  describe('execute', () => {
    it('should add parent categories successfully when the category and parent categories exist', async () => {
      const domainOptions: AddParentCategoriesDomainOptions = {
        categoryId: validCategoryId,
        parentIds: validParentCategoryIds,
      };

      const result = await addParentCategoriesProcess.execute(domainOptions);

      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ParentCategoryAddedDomainEvent);
    });

    it('should not add parent categories when the category or parent categories do not exist', async () => {
      const domainOptions: AddParentCategoriesDomainOptions = {
        categoryId: validCategoryId,
        parentIds: [new CategoryIdValueObject(faker.datatype.uuid())],
      };

      const result = await addParentCategoriesProcess.execute(domainOptions);

      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.ParentIdDoesNotExist(),
      ]);
    });

    it('should not add parent categories when parentIds overlap with categoryId', async () => {
      const domainOptions: AddParentCategoriesDomainOptions = {
        categoryId: validCategoryId,
        parentIds: [validCategoryId],
      };

      const result = await addParentCategoriesProcess.execute(domainOptions);

      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toIncludeAllMembers([
        new CategoryDomainExceptions.OverlapWithParentId(),
      ]);
    });
  });
});
