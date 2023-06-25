import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerMapper,
  CreateReviewerProcess,
  CreateReviewerRequestValidator,
} from '@use-cases/create-reviewer/application-services';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  reviewerRoles,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { ValidationResponse } from 'common-base-classes';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import {
  CreateReviewerRequestDto,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';

describe('CreateReviewerHandler', () => {
  let handler: CreateReviewerHandler;
  let validator: MockProxy<CreateReviewerRequestValidator>;
  let createReviewerProcess: MockProxy<CreateReviewerProcess>;
  let mapper: MockProxy<CreateReviewerMapper>;

  beforeEach(() => {
    validator = mock<CreateReviewerRequestValidator>();
    createReviewerProcess = mock<CreateReviewerProcess>();
    mapper = mock<CreateReviewerMapper>();

    handler = new CreateReviewerHandler(
      validator,
      createReviewerProcess,
      mapper,
    );
  });

  describe('execute', () => {
    const command = new CreateReviewerRequestDto({
      email: faker.internet.email(),
      name: faker.name.firstName(),
      role: faker.helpers.arrayElement(reviewerRoles),
    });

    it('should return UseCaseCommandValidationExceptions when command validation fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(
        ValidationResponse.fail([new ProductDomainExceptions.IdDoesNotValid()]),
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

    it('should return UseCaseProcessExceptions when process fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());
      createReviewerProcess.execute.mockResolvedValue(
        Err([new ReviewerDomainExceptions.DoesExist()]),
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

      const reviewerId = faker.datatype.uuid();
      const email = faker.internet.email().toLowerCase();
      const name = faker.name.firstName();
      const role = faker.helpers.arrayElement(reviewerRoles);

      const okResult = Ok(
        new ReviewerCreatedDomainEvent({
          reviewerId: new ReviewerIdValueObject(reviewerId),
          details: {
            email: new ReviewerEmailValueObject(email),
            name: new ReviewerNameValueObject(name),
            role: new ReviewerRoleValueObject(role),
          },
        }),
      );
      createReviewerProcess.execute.mockResolvedValue(okResult);
      mapper.toResponseDto.mockReturnValue(
        new CreateReviewerResponseDto({
          reviewerId,
          email,
          name,
          role,
        }),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(CreateReviewerResponseDto);
      // Add more assertions for the successful result
    });
  });
});
