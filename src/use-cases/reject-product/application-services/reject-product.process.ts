import { ProductAggregate } from '@aggregates/product';
import { ReviewerAggregate } from '@aggregates/reviewer';
import { ProcessBase } from '@base/use-cases';
import { RejectProductCommand } from '@commands';
import { ProductRejectedDomainEvent } from '@domain-events/product';
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

export type RejectProductProcessSuccess = ProductRejectedDomainEvent;
export type RejectProductProcessFailure = Array<
  | ProductDomainExceptions.NotSubmittedForApproval
  | ReviewerDomainExceptions.NotAuthorizedToReject
  | ProductDomainExceptions.DoesNotExist
  | ReviewerDomainExceptions.DoesNotExist
>;

@Injectable()
export class RejectProductProcess extends ProcessBase<
  RejectProductProcessSuccess,
  RejectProductProcessFailure
> {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly reviewerManagmentService: ReviewerManagementDomainService,
    private readonly productApprovalService: ProductApprovalDomainService,
  ) {
    super();
  }

  product: ProductAggregate;
  reviewer: ReviewerAggregate;
  reviewerIsAdmin: boolean;
  productIsSubmitted: boolean;

  async execute(command: RejectProductCommand) {
    const { productId, reviewerId } = command;
    this.init();
    await this.validateProductMustExist(productId);
    await this.validateReviewerMustExist(reviewerId);

    if (this.product && this.reviewer) {
      this.validateReviewerMustBeAdmin(this.reviewer);
      this.productMustBeSubmittedForApproval(this.product);
    }

    if (this.productIsSubmitted && this.reviewerIsAdmin) {
      await this.rejectProduct(command);
    }

    return this.getValidationResult();
  }

  protected init(): void {
    this.clearValue();
    this.clearExceptions();
    this.product = null;
    this.reviewer = null;
    this.reviewerIsAdmin = false;
    this.productIsSubmitted = false;
  }

  private async validateProductMustExist(
    productId: ProductIdValueObject,
  ): Promise<void> {
    const product = await this.productManagementService.getProductById(
      productId,
    );

    this.product = product;
    if (!product) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  private async validateReviewerMustExist(reviewerId: ReviewerIdValueObject) {
    const reviewer = await this.reviewerManagmentService.getReviewerById(
      reviewerId,
    );

    this.reviewer = reviewer;

    if (!reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    }
  }

  private validateReviewerMustBeAdmin(reviewer: ReviewerAggregate) {
    const isAdmin = reviewer.isAdmin();
    if (!isAdmin) {
      this.exceptions.push(
        new ReviewerDomainExceptions.NotAuthorizedToReject(),
      );
    } else {
      this.reviewerIsAdmin = true;
    }
  }

  private productMustBeSubmittedForApproval(product: ProductAggregate) {
    const isSubmittedForApproval = product.isSubmitted();
    if (!isSubmittedForApproval) {
      this.exceptions.push(
        new ProductDomainExceptions.NotSubmittedForApproval(),
      );
    } else {
      this.productIsSubmitted = true;
    }
  }

  private async rejectProduct(command: RejectProductCommand) {
    const productRejected = await this.productApprovalService.rejectProduct(
      command,
    );

    this.value = productRejected;
  }
}
