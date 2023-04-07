import { ProductApprovalDomainService } from '@domain-services';
import {
  SubmitForApprovalBusinessValidator,
  SubmitForApprovalCommandValidator,
  SubmitForApprovalMapper,
} from '@use-cases/submit-for-approval/application-services';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval/submit-for-approval.handler';
import { ProductIdValueObject, ProductStatus } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SubmitForApprovalHandler', () => {
  let commandValidator: MockProxy<SubmitForApprovalCommandValidator>;
  let mapper: MockProxy<SubmitForApprovalMapper>;
  let businessValidator: MockProxy<SubmitForApprovalBusinessValidator>;
  let productApprovalService: MockProxy<ProductApprovalDomainService>;
  let handler: SubmitForApprovalHandler;

  beforeEach(() => {
    commandValidator = mock<SubmitForApprovalCommandValidator>();
    mapper = mock<SubmitForApprovalMapper>();
    businessValidator = mock<SubmitForApprovalBusinessValidator>();
    productApprovalService = mock<ProductApprovalDomainService>();
    handler = new SubmitForApprovalHandler(
      commandValidator,
      mapper,
      businessValidator,
      productApprovalService,
    );
  });

  describe('execute', () => {
    it('should submit a product for approval', async () => {
      // Arrange
      const productId = '123',
        reviewerId = '456';
      const command = new SubmitForApprovalCommand({
        productId,
        reviewerId,
      });

      commandValidator.validate.mockReturnValue({
        isValid: true,
        exceptions: [],
      });
      mapper.toDomain.mockReturnValue({
        productId: new ProductIdValueObject(),
        reviewerId: new ReviewerIdValueObject(),
      });
      mapper.toResponseDto.mockReturnValue(
        new SubmitForApprovalResponseDto({
          productId,
          reviewerId,
          productStatus: ProductStatus.PENDING_APPROVAL,
        }),
      );
      businessValidator.validate.mockResolvedValue({
        isValid: true,
        exceptions: [],
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toEqual(
        new SubmitForApprovalResponseDto({
          reviewerId,
          productId,
          productStatus: ProductStatus.PENDING_APPROVAL,
        }),
      );
    });
  });
});
