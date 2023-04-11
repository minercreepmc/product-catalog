import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { SubmitForApprovalProcess } from '@use-cases/submit-for-approval/application-services';
import { SubmitForApprovalDomainOptions } from '@use-cases/submit-for-approval/dtos';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SubmitForApprovalProcess', () => {
  let submitForApprovalProcess: SubmitForApprovalProcess;
  let productManagementService: MockProxy<ProductManagementDomainService>;
  let reviewerManagementService: MockProxy<ReviewerManagementDomainService>;
  let productApprovalService: MockProxy<ProductApprovalDomainService>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();
    reviewerManagementService = mock<ReviewerManagementDomainService>();
    productApprovalService = mock<ProductApprovalDomainService>();
    submitForApprovalProcess = new SubmitForApprovalProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );
  });

  it('should submit a product for approval if the product and reviewer exist', async () => {
    const domainOptions: SubmitForApprovalDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    productManagementService.isProductExistById.mockResolvedValue(true);
    reviewerManagementService.isReviewerExistById.mockResolvedValue(true);
    productApprovalService.submitForApproval.mockResolvedValue(
      new ProductSubmittedDomainEvent({
        productId: domainOptions.productId,
        details: {
          productStatus: ProductStatusValueObject.createPending(),
          reviewerId: domainOptions.reviewerId,
        },
      }),
    );

    const result = await submitForApprovalProcess.execute(domainOptions);

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(ProductSubmittedDomainEvent);
  });

  it('should not submit a product for approval if the product does not exist', async () => {
    const domainOptions: SubmitForApprovalDomainOptions = {
      productId: new ProductIdValueObject('nonexistent_product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    productManagementService.isProductExistById.mockResolvedValue(false);
    reviewerManagementService.isReviewerExistById.mockResolvedValue(true);

    const result = await submitForApprovalProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ProductDomainExceptions.DoesNotExist(),
    ]);
  });

  it('should not submit a product for approval if the reviewer does not exist', async () => {
    const domainOptions: SubmitForApprovalDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('nonexistent_reviewer_id'),
    };

    productManagementService.isProductExistById.mockResolvedValue(true);
    reviewerManagementService.isReviewerExistById.mockResolvedValue(false);

    const result = await submitForApprovalProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ReviewerDomainExceptions.DoesNotExist(),
    ]);
  });
});
