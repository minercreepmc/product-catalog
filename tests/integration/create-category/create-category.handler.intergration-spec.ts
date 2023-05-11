import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { ProductDomainExceptions } from '@domain-exceptions/product';
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
import { CategoryNameValueObject } from '@value-objects/category';
import { MultipleExceptions } from 'common-base-classes';

describe('CreateCategoryHandler Integration Test', () => {
  let handler: CreateCategoryHandler;
  let validator: CreateCategoryValidator;
  let mapper: CreateCategoryMapper;
  let createCategoryProcess: CreateCategoryProcess;
  let categoryManagementService: CategoryManagementDomainService;

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
  });

  describe('execute', () => {
    it('should create a new category when the category name does not exist', async () => {
      // Arrange
      const command = new CreateCategoryCommand({
        name: 'New Category',
        // other properties...
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(CreateCategoryResponseDto);
      // Add more assertions for the created category's properties
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
  });
});
