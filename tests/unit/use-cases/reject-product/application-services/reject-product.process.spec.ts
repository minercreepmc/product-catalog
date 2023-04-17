import { ProductAggregate } from '@aggregates/product';
import { ReviewerAggregate } from '@aggregates/reviewer';
import { ProductRejectedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { RejectProductProcess } from '@use-cases/reject-product/application-services';
import { RejectProductDomainOptions } from '@use-cases/reject-product/dtos';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';

describe('RejectProductProcess', () => {
  let rejectProductProcess: RejectProductProcess;
  let productManagementService: MockProxy<ProductManagementDomainService>;
  let reviewerManagementService: MockProxy<ReviewerManagementDomainService>;
  let productApprovalService: DeepMockProxy<ProductApprovalDomainService>;
  let product: MockProxy<ProductAggregate>;
  let regularReviewer: MockProxy<ReviewerAggregate>;
  let adminReviewer: MockProxy<ReviewerAggregate>;
  let productRejectedDomainEvent: MockProxy<ProductRejectedDomainEvent>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();
    reviewerManagementService = mock<ReviewerManagementDomainService>();
    productApprovalService = mockDeep<ProductApprovalDomainService>();
    rejectProductProcess = new RejectProductProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );
    product = mock<ProductAggregate>();
    regularReviewer = mock<ReviewerAggregate>();
    regularReviewer.isAdmin.mockReturnValue(false);
    adminReviewer = mock<ReviewerAggregate>();
    adminReviewer.isAdmin.mockReturnValue(true);

    productRejectedDomainEvent = mock<ProductRejectedDomainEvent>();
  });

  it('should reject a product if the product exists, submitted and the reviewer is an admin', async () => {
    // Arrange
    const domainOptions: RejectProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
      reason: new RejectionReasonValueObject('Super bad product'),
    };
    product.isSubmitted.mockReturnValue(true);
    productManagementService.getProductById.mockResolvedValue(product);
    reviewerManagementService.getReviewerById.mockResolvedValue(adminReviewer);
    productApprovalService.rejectProduct.mockResolvedValue(
      productRejectedDomainEvent,
    );

    // Act
    const result = await rejectProductProcess.execute(domainOptions);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toEqual(productRejectedDomainEvent);
  });

  it('should not reject a product if the product exists, submitted and the reviewer is not an admin', async () => {
    // Arrange
    const domainOptions: RejectProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
      reason: new RejectionReasonValueObject('Super bad product'),
    };
    product.isSubmitted.mockReturnValue(true);
    productManagementService.getProductById.mockResolvedValue(product);
    reviewerManagementService.getReviewerById.mockResolvedValue(
      regularReviewer,
    );
    productApprovalService.rejectProduct.mockResolvedValue(
      productRejectedDomainEvent,
    );

    // Act
    const result = await rejectProductProcess.execute(domainOptions);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toIncludeAllMembers([
      new ReviewerDomainExceptions.NotAuthorizedToReject(),
    ]);
  });

  it('should not reject a product if the product does not exist', async () => {
    // Arrange
    const domainOptions: RejectProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
      reason: new RejectionReasonValueObject('Super bad product'),
    };
    productManagementService.getProductById.mockResolvedValue(null);

    // Act
    const result = await rejectProductProcess.execute(domainOptions);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toIncludeAllMembers([
      new ProductDomainExceptions.DoesNotExist(),
    ]);
  });

  it('should not reject a product if the reviewer does not exist', async () => {
    // Arrange
    const domainOptions: RejectProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
      reason: new RejectionReasonValueObject('Super bad product'),
    };
    productManagementService.getProductById.mockResolvedValue(product);
    reviewerManagementService.getReviewerById.mockResolvedValue(null);

    // Act
    const result = await rejectProductProcess.execute(domainOptions);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toIncludeAllMembers([
      new ReviewerDomainExceptions.DoesNotExist(),
    ]);
  });
});
