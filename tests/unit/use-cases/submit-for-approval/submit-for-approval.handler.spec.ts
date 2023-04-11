import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalValidator,
} from '@use-cases/submit-for-approval/application-services';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import { ValidationResponse } from 'common-base-classes';
import { faker } from '@faker-js/faker';
import { mock, MockProxy } from 'jest-mock-extended';
import { Err, Ok } from 'oxide.ts';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('SubmitForApprovalHandler', () => {
  let handler: SubmitForApprovalHandler;
  let validator: MockProxy<SubmitForApprovalValidator>;
  let mapper: MockProxy<SubmitForApprovalMapper>;
  let submitForApprovalProcess: MockProxy<SubmitForApprovalProcess>;

  beforeEach(() => {
    validator = mock<SubmitForApprovalValidator>();
    mapper = mock<SubmitForApprovalMapper>();
    submitForApprovalProcess = mock<SubmitForApprovalProcess>();

    handler = new SubmitForApprovalHandler(
      validator,
      mapper,
      submitForApprovalProcess,
    );
  });

  describe('execute', () => {
    const command = new SubmitForApprovalCommand({
      productId: faker.datatype.uuid(),
      reviewerId: faker.datatype.uuid(),
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
      submitForApprovalProcess.execute.mockResolvedValue(
        Err([new ReviewerDomainExceptions.DoesNotExist()]),
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

      const okResult = Ok(
        new ProductSubmittedDomainEvent({
          productId: new ProductIdValueObject(command.productId),
          details: {
            reviewerId: new ReviewerIdValueObject(command.reviewerId),
            productStatus: ProductStatusValueObject.createPending(),
          },
        }),
      );
      submitForApprovalProcess.execute.mockResolvedValue(okResult);
      mapper.toResponseDto.mockReturnValue(
        new SubmitForApprovalResponseDto({
          productId: command.productId,
          reviewerId: command.reviewerId,
          productStatus: ProductStatusValueObject.createPending().unpack(),
        }),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(SubmitForApprovalResponseDto);
      // Add more assertions for the successful result
    });
  });
});
