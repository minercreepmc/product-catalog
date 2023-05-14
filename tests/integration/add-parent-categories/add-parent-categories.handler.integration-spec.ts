import { CategoryManagementDomainService } from '@domain-services';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AddParentCategoriesHandler } from '@use-cases/add-parent-categories';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesValidator,
} from '@use-cases/add-parent-categories/application-services';
import {
  AddParentCategoriesCommand,
  AddParentCategoriesResponseDto,
} from '@use-cases/add-parent-categories/dtos';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

describe('AddParentCategoriesHandler Integration Test', () => {
  let handler: AddParentCategoriesHandler;
  let validator: AddParentCategoriesValidator;
  let mapper: AddParentCategoriesMapper;
  let addParentCategoriesProcess: AddParentCategoriesProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let existingCategoryId: CategoryIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    validator = moduleFixture.get(AddParentCategoriesValidator);
    mapper = moduleFixture.get(AddParentCategoriesMapper);
    addParentCategoriesProcess = moduleFixture.get(AddParentCategoriesProcess);
    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );

    handler = new AddParentCategoriesHandler(
      validator,
      addParentCategoriesProcess,
      mapper,
    );

    const { entityId } = await categoryManagementService.createCategory({
      name: new CategoryNameValueObject(faker.lorem.word()),
    });

    existingCategoryId = entityId;
  });

  describe('execute', () => {
    it('should not add parent categories if command is not valid', async () => {
      // Arrange
      const command = new AddParentCategoriesCommand({
        categoryId: '',
        parentIds: [],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    it('should not add parent categories if category or parent categories do not exist', async () => {
      // Arrange
      const command = new AddParentCategoriesCommand({
        categoryId: 'non_existing_category_id',
        parentIds: ['non_existing_parent_category_id'],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should not add parent categories when the category and parent category ids overlap', async () => {
      // Arrange
      const command = new AddParentCategoriesCommand({
        categoryId: existingCategoryId.unpack(),
        parentIds: [existingCategoryId.unpack()],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should add parent categories when everything is ok', async () => {
      // Arrange
      const { entityId: parentCategoryId } =
        await categoryManagementService.createCategory({
          name: new CategoryNameValueObject(faker.lorem.word()),
        });
      const command = new AddParentCategoriesCommand({
        categoryId: existingCategoryId.unpack(),
        parentIds: [parentCategoryId.unpack()],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(AddParentCategoriesResponseDto);
    });
  });
});
