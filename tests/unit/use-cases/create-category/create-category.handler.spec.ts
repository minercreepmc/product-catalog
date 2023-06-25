import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryRequestValidator,
} from '@use-cases/create-category/application-services';
import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
} from '@use-cases/create-category/dtos';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { ValidationResponse } from 'common-base-classes';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

describe('CreateCategoryHandler', () => {
  let handler: CreateCategoryHandler;
  let validator: MockProxy<CreateCategoryRequestValidator>;
  let createCategoryProcess: MockProxy<CreateCategoryProcess>;
  let mapper: MockProxy<CreateCategoryMapper>;

  beforeEach(() => {
    validator = mock<CreateCategoryRequestValidator>();
    createCategoryProcess = mock<CreateCategoryProcess>();
    mapper = mock<CreateCategoryMapper>();

    handler = new CreateCategoryHandler(
      validator,
      mapper,
      createCategoryProcess,
    );
  });

  describe('execute', () => {
    const command = new CreateCategoryRequestDto({
      name: faker.random.word(),
      // Other properties...
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
      // Add more assertions for the validation exceptions
    });

    it('should return UseCaseBusinessValidationExceptions when process fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());
      createCategoryProcess.execute.mockResolvedValue(
        Err([new CategoryDomainExceptions.AlreadyExist()]),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
      // Add more assertions for the process exceptions
    });

    it('should return a successful result when command and business validations pass', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());

      const categoryCreatedEvent = new CategoryCreatedDomainEvent({
        id: new CategoryIdValueObject(faker.datatype.uuid()),
        details: {
          name: new CategoryNameValueObject(faker.random.word()),
        },
        // Other properties...
      });

      const okResult = Ok(categoryCreatedEvent);
      createCategoryProcess.execute.mockResolvedValue(okResult);
      mapper.toResponseDto.mockReturnValue(
        new CreateCategoryResponseDto({
          id: categoryCreatedEvent.entityId.unpack(),
          name: categoryCreatedEvent.name.unpack(),
          // Other properties...
        }),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(CreateCategoryResponseDto);
      // Add more assertions for the successful result
    });
  });
});
