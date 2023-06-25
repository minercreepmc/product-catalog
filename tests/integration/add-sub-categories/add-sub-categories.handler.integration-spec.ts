import { CategoryManagementDomainService } from '@domain-services';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AddSubCategoriesHandler } from '@use-cases/add-sub-categories';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesRequestValidator,
} from '@use-cases/add-sub-categories/application-services';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from '@use-cases/add-sub-categories/dtos';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

describe('AddSubCategoriesHandler Integration Test', () => {
  let handler: AddSubCategoriesHandler;
  let validator: AddSubCategoriesRequestValidator;
  let mapper: AddSubCategoriesMapper;
  let addSubCategoriesProcess: AddSubCategoriesProcess;
  let categoryManagementService: CategoryManagementDomainService;
  let existingCategoryId: CategoryIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    validator = moduleFixture.get(AddSubCategoriesRequestValidator);
    mapper = moduleFixture.get(AddSubCategoriesMapper);
    addSubCategoriesProcess = moduleFixture.get(AddSubCategoriesProcess);
    categoryManagementService = moduleFixture.get(
      CategoryManagementDomainService,
    );

    handler = new AddSubCategoriesHandler(
      validator,
      addSubCategoriesProcess,
      mapper,
    );

    const { entityId } = await categoryManagementService.createCategory({
      name: new CategoryNameValueObject(faker.lorem.word()),
    });

    existingCategoryId = entityId;
  });

  describe('execute', () => {
    it('should not add subcategories if command is not valid', async () => {
      // Arrange
      const command = new AddSubCategoriesRequestDto({
        categoryId: '',
        subCategoryIds: [],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    it('should not add subcategories if category or subcategories does not exist', async () => {
      // Arrange
      const command = new AddSubCategoriesRequestDto({
        categoryId: 'non_existing_category_id',
        subCategoryIds: ['non_existing_sub_category_id'],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should not add subcategories when the category and subcategory ids overlap', async () => {
      // Arrange
      const command = new AddSubCategoriesRequestDto({
        categoryId: existingCategoryId.unpack(),
        subCategoryIds: [existingCategoryId.unpack()],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should add subcategories when everything is ok', async () => {
      // Arrange
      const { entityId: subCategoryId } =
        await categoryManagementService.createCategory({
          name: new CategoryNameValueObject(faker.lorem.word()),
        });
      const command = new AddSubCategoriesRequestDto({
        categoryId: existingCategoryId.unpack(),
        subCategoryIds: [subCategoryId.unpack()],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(AddSubCategoriesResponseDto);
    });
  });
});
