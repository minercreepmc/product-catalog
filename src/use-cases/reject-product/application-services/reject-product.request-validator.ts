import { CompositeRequestValidator } from '@base/use-cases';
import { Injectable } from '@nestjs/common';
import {
  ProductRequestValidator,
  ReviewerRequestValidator,
} from '@use-cases/application-services/validators';
import { RejectProductRequestDto } from '../dtos';

@Injectable()
export class RejectProductRequestValidator extends CompositeRequestValidator {
  constructor(
    private productValidator: ProductRequestValidator,
    private reviewerValidator: ReviewerRequestValidator,
  ) {
    super();
    this.addValidator(productValidator);
    this.addValidator(reviewerValidator);
  }

  _validate(dto: RejectProductRequestDto): void {
    const { reviewerId, productId, reason } = dto;
    this.reviewerValidator.validateReviewerId(reviewerId);
    this.productValidator.validateProductId(productId);
    this.productValidator.validateReason(reason);
  }
}
