import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CreateCategoryProcess } from '@use-cases/create-category/application-services';
import { CreateCategoryDomainOptions } from '@use-cases/create-category/dtos';
import { CategoryNameValueObject } from '@value-objects/category';

describe('CreateCategoryProcess Integration Test', () => {
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: CategoryManagementDomainService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );
    createCategoryProcess = new CreateCategoryProcess(
      categoryManagementService,
    );
  });

  it('should create a new category when the category name does not exist', async () => {
    // Arrange
    const domainOptions: CreateCategoryDomainOptions = {
      name: new CategoryNameValueObject('New Category'),
      // other properties...
    };

    // Act
    const result = await createCategoryProcess.execute(domainOptions);

    // Assert
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBeInstanceOf(CategoryCreatedDomainEvent);
  });

  it('should fail to create a new category when the category name already exists', async () => {
    // Arrange
    const categoryName = new CategoryNameValueObject('Existing Category');
    const existingCategoryOptions: CreateCategoryDomainOptions = {
      name: categoryName,
      // other properties...
    };
    await categoryManagementService.createCategory(existingCategoryOptions);

    const newCategoryOptions: CreateCategoryDomainOptions = {
      name: categoryName, // Use the same name as the existing category
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
});
