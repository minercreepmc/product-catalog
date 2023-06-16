import { ProcessBase } from '@base/use-cases';
import { SubmitForApprovalCommand } from '@commands';
import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export type SubmitForApprovalProcessSuccess = ProductSubmittedDomainEvent;
export type SubmitForApprovalProcessFailure = Array<
  ProductDomainExceptions.DoesNotExist | ReviewerDomainExceptions.DoesNotExist
>;

@Injectable()
export class SubmitForApprovalProcess extends ProcessBase<
  SubmitForApprovalProcessSuccess,
  SubmitForApprovalProcessFailure
> {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly reviewerManagementService: ReviewerManagementDomainService,
    private readonly productApprovalService: ProductApprovalDomainService,
  ) {
    super();
  }

  reviewerExist: boolean;
  productExist: boolean;

  async execute(command: SubmitForApprovalCommand) {
    const { productId, reviewerId } = command;
    this.init();
    await this.validateProductMustExistById(productId);
    await this.validateReviewerMustExistById(reviewerId);
    await this.submitIfProductAndReviewerExist(command);
    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();
    this.reviewerExist = true;
    this.productExist = true;
  }

  private async validateProductMustExistById(productId: ProductIdValueObject) {
    const exist = await this.productManagementService.isProductExistById(
      productId,
    );
    if (!exist) {
      this.productExist = false;
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  private async validateReviewerMustExistById(
    reviewerId: ReviewerIdValueObject,
  ) {
    const exist = await this.reviewerManagementService.isReviewerExistById(
      reviewerId,
    );
    if (!exist) {
      this.reviewerExist = false;
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    }
  }

  private async submitIfProductAndReviewerExist(
    command: SubmitForApprovalCommand,
  ) {
    if (this.productExist && this.reviewerExist) {
      const productSubmitted =
        await this.productApprovalService.submitForApproval(command);

      this.value = productSubmitted;
    }
  }
}
