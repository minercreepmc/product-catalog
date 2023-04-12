import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from '@use-cases/approve-product/application-services';
import {
  ApproveProductCommand,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { ValidationResponse } from 'common-base-classes';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ProductApprovedDomainEvent } from '@domain-events/product';

describe('ApproveProductHandler', () => {
  let handler: ApproveProductHandler;
  let validator: MockProxy<ApproveProductValidator>;
  let approveProductProcess: MockProxy<ApproveProductProcess>;
  let mapper: MockProxy<ApproveProductMapper>;

  beforeEach(() => {
    validator = mock<ApproveProductValidator>();
    approveProductProcess = mock<ApproveProductProcess>();
    mapper = mock<ApproveProductMapper>();

    handler = new ApproveProductHandler(
      validator,
      mapper,
      approveProductProcess,
    );
  });

  describe('execute', () => {
    const command = new ApproveProductCommand({
      productId: faker.datatype.uuid(),
      reviewerId: faker.datatype.uuid(),
    });

    it('should return UseCaseCommandValidationExceptions when command validation fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(
        ValidationResponse.fail([new ProductDomainExceptions.DoesNotExist()]),
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
      approveProductProcess.execute.mockResolvedValue(
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

      const productApprovedEvent = new ProductApprovedDomainEvent({
        productId: new ProductIdValueObject(faker.datatype.uuid()),
        details: {
          reviewerId: new ReviewerIdValueObject(faker.datatype.uuid()),
          productStatus: ProductStatusValueObject.createApproved(),
        },
      });

      const okResult = Ok(productApprovedEvent);
      approveProductProcess.execute.mockResolvedValue(okResult);
      mapper.toResponseDto.mockReturnValue(
        new ApproveProductResponseDto({
          productId: productApprovedEvent.productId.unpack(),
          reviewerId: productApprovedEvent.details.reviewerId.unpack(),
          productStatus: productApprovedEvent.details.productStatus.unpack(),
        }),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ApproveProductResponseDto);
      // Add more assertions for the successful result
    });
  });
});
