import { ProductAggregate } from '@aggregates/product';
import { ReviewerAggregate } from '@aggregates/reviewer';
import { ProductApprovedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ValidationResponse } from 'common-base-classes';
import { ApproveProductDomainOptions } from '../dtos';

export type ApproveProductProcessSucess = ProductApprovedDomainEvent;
export type ApproveProductProcessFailure = Array<any>;

@Injectable()
export class ApproveProductProcessValidator extends ProcessBase<
  ApproveProductProcessSucess,
  ApproveProductProcessFailure
> {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }

  private product: ProductAggregate;
  private reviewer: ReviewerAggregate;

  async execute(domainOptions: ApproveProductDomainOptions) {
    const { productId, reviewerId } = domainOptions;

    this.init();

    await this.validateProductMustExistById(productId);
    await this.validateReviewerMustExistById(reviewerId);
    if (this.product && this.reviewer) {
      this.validateReviewerMustBeAdmin(this.reviewer);
      this.productMustBeSubmittedForApproval(this.product);
    }
    return this.getValidationResult();
  }

  protected init() {
    this.clearExceptions();
    this.product = null;
    this.reviewer = null;
  }

  protected async validateProductMustExistById(
    productId: ProductIdValueObject,
  ) {
    const product = await this.productManagementService.getProductById(
      productId,
    );
    this.product = product;
    if (!product) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  protected async validateReviewerMustExistById(
    reviewerId: ReviewerIdValueObject,
  ) {
    const reviewer = await this.reviewerManagementService.getReviewerById(
      reviewerId,
    );
    this.reviewer = reviewer;
    if (!reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    }
  }

  protected validateReviewerMustBeAdmin(reviewer: ReviewerAggregate) {
    if (!reviewer.role.isAdmin()) {
      this.exceptions.push(
        new ReviewerDomainExceptions.NotAuthorizedToApprove(),
      );
    }
  }

  protected productMustBeSubmittedForApproval(product: ProductAggregate) {
    if (!product.status.isPendingApproval()) {
      this.exceptions.push(
        new ProductDomainExceptions.NotSubmittedForApproval(),
      );
    }
  }
}
