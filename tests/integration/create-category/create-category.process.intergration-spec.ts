import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CreateCategoryProcess } from '@use-cases/create-category/application-services';
import { CreateCategoryDomainOptions } from '@use-cases/create-category/dtos';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { faker } from '@faker-js/faker';
import { ProductIdValueObject } from '@value-objects/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';

describe('CreateCategoryProcess Integration Test', () => {
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let productManagementService: ProductManagementDomainService;
  let existingCategoryName: CategoryNameValueObject;
  let existingCategoryId: CategoryIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );
    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    createCategoryProcess = new CreateCategoryProcess(
      categoryManagementService,
      productManagementService,
    );

    const { name, entityId } = await categoryManagementService.createCategory({
      name: new CategoryNameValueObject(faker.lorem.word()),
    });
    existingCategoryName = name;
    existingCategoryId = entityId;
  });

  it('should fail to create a new category when the category name already exists', async () => {
    // Arrange
    const newCategoryOptions: CreateCategoryDomainOptions = {
      name: existingCategoryName,
      // other properties...
    };

    // Act
    const result = await createCategoryProcess.execute(newCategoryOptions);

    // Assert
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toIncludeAllMembers([
      new CategoryDomainExceptions.AlreadyExist(),
    ]);
  });

  it('should fail to create a new category if parentsIds, subCategories and productIds was provided but does not exist', async () => {
    // Arrange

    const existingCategoryOptions: CreateCategoryDomainOptions = {
      name: new CategoryNameValueObject('New Category'),
      parentIds: [
        new ParentCategoryIdValueObject('not_existing_parent_category_id'),
      ],
      subCategoryIds: [
        new SubCategoryIdValueObject('not_existing_sub_category_id'),
      ],
      productIds: [new ProductIdValueObject('not_existing_product_id')],
      // other properties...
    };

    // Act
    const result = await createCategoryProcess.execute(existingCategoryOptions);

    // Assert
    console.log(result);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toIncludeAllMembers([
      new CategoryDomainExceptions.ParentIdDoesNotExist(),
      new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      new ProductDomainExceptions.DoesNotExist(),
    ]);
  });

  it('should create a new category when everything is ok', async () => {
    // Arrange
    const domainOptions: CreateCategoryDomainOptions = {
      name: new CategoryNameValueObject('New Category 2'),
      // other properties...
    };

    // Act
    const result = await createCategoryProcess.execute(domainOptions);

    // Assert
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBeInstanceOf(CategoryCreatedDomainEvent);
  });
});
