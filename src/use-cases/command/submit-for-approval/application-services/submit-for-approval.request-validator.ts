import { CompositeRequestValidator } from '@base/use-cases';
import { Injectable } from '@nestjs/common';
import {
  ProductRequestValidator,
  ReviewerRequestValidator,
} from '@use-cases/shared/application-services/validators';
import { SubmitForApprovalRequestDto } from '../dtos';

@Injectable()
export class SubmitForApprovalRequestValidator extends CompositeRequestValidator {
  constructor(
    private productValidator: ProductRequestValidator,
    private reviewerValidator: ReviewerRequestValidator,
  ) {
    super();
    this.addValidator(productValidator);
    this.addValidator(reviewerValidator);
  }

  _validate(dto: SubmitForApprovalRequestDto): void {
    const { reviewerId, productId } = dto;
    if (reviewerId !== undefined) {
      this.reviewerValidator.validateReviewerId(reviewerId);
    }
    if (productId !== undefined) {
      this.productValidator.validateProductId(productId);
    }
  }
}
