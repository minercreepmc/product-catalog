import { TranslateOptions, ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  ValidationResponse,
  ValidationExceptionBase,
} from 'common-base-classes';
import { RejectProductRequestDto } from '../dtos';

@Injectable()
export class RejectProductValidator extends ValidatorBase {
  validate(dto: RejectProductRequestDto): ValidationResponse {
    const { reviewerId, productId, reason } = dto;
    this.clearExceptions();
    this.validateReviewerId(reviewerId);
    this.validateProductId(productId);
    this.validateReason(reason);
    return this.getValidationResponse();
  }

  private validateReviewerId(reviewerId: string): void {
    const response = ReviewerIdValueObject.validate(reviewerId);

    return this.handlerValidationResponse({
      response,
      context: ReviewerIdValueObject.name,
    });
  }

  private validateProductId(productId: string): void {
    const response = ProductIdValueObject.validate(productId);

    return this.handlerValidationResponse({
      response,
      context: ProductIdValueObject.name,
    });
  }

  private validateReason(reason: string): void {
    const response = RejectionReasonValueObject.validate(reason);

    return this.handlerValidationResponse({
      response,
      context: RejectionReasonValueObject.name,
    });
  }

  protected translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;

    switch (context) {
      case ReviewerIdValueObject.name:
        return new ReviewerDomainExceptions.IdDoesNotValid();
      case ProductIdValueObject.name:
        return new ProductDomainExceptions.IdDoesNotValid();
      case RejectionReasonValueObject.name:
        return new ProductDomainExceptions.RejectionReasonDoesNotValid();
      default:
        return exception;
    }
  }
}
