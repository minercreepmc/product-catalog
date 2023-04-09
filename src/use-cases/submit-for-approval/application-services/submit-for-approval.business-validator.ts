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
import { SubmitForApprovalDomainOptions } from '../dtos';

@Injectable()
export class SubmitForApprovalBusinessValidator extends ProcessBase {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }
  async execute(
    domainOptions: SubmitForApprovalDomainOptions,
  ): Promise<ValidationResponse> {
    const { productId, reviewerId } = domainOptions;
    this.clearExceptions();
    await this.validateProductMustExistById(productId);
    await this.validateReviewerMustExistById(reviewerId);
    return this.getValidationResult();
  }

  private async validateProductMustExistById(productId: ProductIdValueObject) {
    const exist = await this.productManagementService.isProductExistById(
      productId,
    );
    if (!exist) {
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
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    }
  }
}
