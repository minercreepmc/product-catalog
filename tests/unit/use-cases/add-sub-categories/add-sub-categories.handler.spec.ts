import { AddSubCategoriesHandler } from '@use-cases/add-sub-categories';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesValidator,
} from '@use-cases/add-sub-categories/application-services';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from '@use-cases/add-sub-categories/dtos';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { ValidationResponse } from 'common-base-classes';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

describe('AddSubCategoriesHandler', () => {
  let handler: AddSubCategoriesHandler;
  let validator: MockProxy<AddSubCategoriesValidator>;
  let addSubCategoryProcess: MockProxy<AddSubCategoriesProcess>;
  let mapper: MockProxy<AddSubCategoriesMapper>;

  beforeEach(() => {
    validator = mock<AddSubCategoriesValidator>();
    addSubCategoryProcess = mock<AddSubCategoriesProcess>();
    mapper = mock<AddSubCategoriesMapper>();

    handler = new AddSubCategoriesHandler(
      validator,
      addSubCategoryProcess,
      mapper,
    );
  });

  describe('execute', () => {
    const command = new AddSubCategoriesRequestDto({
      categoryId: faker.datatype.uuid(),
      subCategoryIds: [faker.datatype.uuid(), faker.datatype.uuid()],
    });

    it('should return UseCaseCommandValidationExceptions when command validation fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(
        ValidationResponse.fail([new CategoryDomainExceptions.DoesNotExist()]),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    it('should return UseCaseProcessExceptions when process fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());
      addSubCategoryProcess.execute.mockResolvedValue(
        Err([new CategoryDomainExceptions.DoesNotExist()]),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should return a successful result when command and business validations pass', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());

      const subCategoryAddedEvent = new SubCategoryAddedDomainEvent({
        id: new CategoryIdValueObject(faker.datatype.uuid()),
        details: {
          subCategoryIds: [
            new SubCategoryIdValueObject(faker.datatype.uuid()),
            new SubCategoryIdValueObject(faker.datatype.uuid()),
          ],
        },
      });

      const okResult = Ok(subCategoryAddedEvent);
      addSubCategoryProcess.execute.mockResolvedValue(okResult);
      mapper.toResponseDto.mockReturnValue(
        new AddSubCategoriesResponseDto({
          categoryId: subCategoryAddedEvent.categoryId.unpack(),
          subCategoryIds: subCategoryAddedEvent.subCategoryIds.map((id) =>
            id.unpack(),
          ),
        }),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(AddSubCategoriesResponseDto);
    });
  });
});
