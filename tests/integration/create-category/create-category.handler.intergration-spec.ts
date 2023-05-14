import { CategoryManagementDomainService } from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from '@use-cases/create-category/application-services';
import {
  CreateCategoryCommand,
  CreateCategoryDomainOptions,
  CreateCategoryResponseDto,
} from '@use-cases/create-category/dtos';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { MultipleExceptions } from 'common-base-classes';
import { faker } from '@faker-js/faker';

describe('CreateCategoryHandler Integration Test', () => {
  let handler: CreateCategoryHandler;
  let validator: CreateCategoryValidator;
  let mapper: CreateCategoryMapper;
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let existingCategoryId: CategoryIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    validator = moduleFixture.get(CreateCategoryValidator);
    mapper = moduleFixture.get(CreateCategoryMapper);
    createCategoryProcess = moduleFixture.get(CreateCategoryProcess);
    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );

    handler = new CreateCategoryHandler(
      validator,
      mapper,
      createCategoryProcess,
    );

    const { entityId } = await categoryManagementService.createCategory({
      name: new CategoryNameValueObject(faker.lorem.word()),
    });

    existingCategoryId = entityId;
  });

  describe('execute', () => {
    it('should not create a category if command is not valid', async () => {
      // Arrange
      const command = new CreateCategoryCommand({
        name: '',
        // other properties...
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    it('should not create a new category if parentsIds, subCategoryIds and productIds was provided but not exist', async () => {
      // Arrange
      const command = new CreateCategoryCommand({
        name: 'New Category',
        parentIds: ['not_existing_parent_category_id'],
        subCategoryIds: ['not_existing_sub_category_id'],
        productIds: ['not_existing_product'],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
      expect(result.unwrapErr()).toBeInstanceOf(MultipleExceptions);
    });

    it('should not create a new category when the category name already exists', async () => {
      // Arrange
      const categoryName = 'Existing Category';
      const existingCategoryOptions: CreateCategoryDomainOptions = {
        name: new CategoryNameValueObject(categoryName),
        // other properties...
      };
      await categoryManagementService.createCategory(existingCategoryOptions);

      const command = new CreateCategoryCommand({
        name: categoryName, // Use the same name as the existing category
        // other properties...
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
      // Add more assertions for the expected exception or error
    });

    it('should not create a new category when the parentIds and subCategoryIds overlap', async () => {
      // Arrange
      const command = new CreateCategoryCommand({
        name: 'New Category',
        parentIds: [existingCategoryId.unpack()],
        subCategoryIds: [existingCategoryId.unpack()],
        // other properties...
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should create a new category when everything is ok', async () => {
      // Arrange
      const { entityId: anotherCategoryId } =
        await categoryManagementService.createCategory({
          name: new CategoryNameValueObject(faker.lorem.word()),
        });
      const command = new CreateCategoryCommand({
        name: 'New Category',
        parentIds: [existingCategoryId.unpack()],
        subCategoryIds: [anotherCategoryId.unpack()],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(CreateCategoryResponseDto);
      // Add more assertions for the created category's properties
    });
  });
});
