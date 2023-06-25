import { CompositeRequestValidator } from '@base/use-cases';
import { Injectable } from '@nestjs/common';
import {
  ProductRequestValidator,
  ReviewerRequestValidator,
} from '@use-cases/application-services/validators';
import { ApproveProductRequestDto } from '../dtos';

@Injectable()
export class ApproveProductRequestValidator extends CompositeRequestValidator {
  constructor(
    private productValidator: ProductRequestValidator,
    private reviewerValidator: ReviewerRequestValidator,
  ) {
    super();
    this.addValidator(productValidator);
    this.addValidator(reviewerValidator);
  }

  _validate(requestDto: ApproveProductRequestDto): void {
    const { productId, reviewerId } = requestDto;
    this.productValidator.validateProductId(productId);
    this.reviewerValidator.validateReviewerId(reviewerId);
  }

  // protected translateExceptionToUserFriendlyMessage(
  //   options: TranslateOptions,
  // ): ValidationExceptionBase {
  //   const { context, exception } = options;
  //   switch (context) {
  //     case ProductIdValueObject.name:
  //       return new ProductDomainExceptions.IdDoesNotValid();
  //     case ReviewerIdValueObject.name:
  //       return new ReviewerDomainExceptions.IdDoesNotValid();
  //     default:
  //       return exception;
  //   }
  // }
}
