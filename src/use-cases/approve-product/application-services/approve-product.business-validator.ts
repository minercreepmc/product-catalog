import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { BusinessValidatorBase } from '@use-cases/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ValidationResponse } from 'common-base-classes';
import { ApproveProductDomainOptions } from '../dtos';

@Injectable()
export class ApproveProductBusinessValidator extends BusinessValidatorBase {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }

  private productExist: boolean;
  private reviewerExist: boolean;

  async validate(
    domainOptions: ApproveProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { productId, reviewerId } = domainOptions;

    this.clearExceptions();
    this.productExist = true;
    this.reviewerExist = true;

    await this.validateProductMustExistById(productId);
    await this.validateReviewerMustExistById(reviewerId);
    if (this.productExist && this.reviewerExist) {
      await this.validateReviewerMustBeAdmin(reviewerId);
    }
    return this.getValidationResponse();
  }

  protected async validateProductMustExistById(
    productId: ProductIdValueObject,
  ) {
    const exist = await this.productManagementService.isProductExistById(
      productId,
    );
    if (!exist) {
      this.productExist = false;
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  protected async validateReviewerMustExistById(
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

  protected async validateReviewerMustBeAdmin(
    reviewerId: ReviewerIdValueObject,
  ) {
    const reviewer = await this.reviewerManagementService.getReviewerById(
      reviewerId,
    );
    if (!reviewer.role.isAdmin()) {
      this.exceptions.push(
        new ReviewerDomainExceptions.NotAuthorizedToApprove(),
      );
    }
  }
}
