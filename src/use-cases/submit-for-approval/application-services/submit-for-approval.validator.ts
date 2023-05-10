import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { Injectable } from '@nestjs/common';
import {
  ValidatorBase,
  TranslateOptions,
} from '@use-cases/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  ValidationResponse,
  ValidationExceptionBase,
} from 'common-base-classes';
import { SubmitForApprovalCommand } from '../dtos';

@Injectable()
export class SubmitForApprovalValidator extends ValidatorBase {
  validate(command: SubmitForApprovalCommand): ValidationResponse {
    const { reviewerId, productId } = command;
    this.clearExceptions();
    if (reviewerId !== undefined) {
      this.validateReviewerId(reviewerId);
    }
    if (productId !== undefined) {
      this.validateProductId(productId);
    }
    return this.getValidationResponse();
  }
  protected translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;
    switch (context) {
      case ProductIdValueObject.name:
        return new ProductDomainExceptions.IdDoesNotValid();
      case ReviewerIdValueObject.name:
        return new ReviewerDomainExceptions.IdDoesNotValid();
      default:
        return exception;
    }
  }

  protected validateReviewerId(reviewerId: string) {
    const response = ReviewerIdValueObject.validate(reviewerId);
    this.handlerValidationResponse({
      response: response,
      context: ReviewerIdValueObject.name,
    });
  }

  protected validateProductId(productId: string) {
    const response = ProductIdValueObject.validate(productId);
    this.handlerValidationResponse({
      response: response,
      context: ProductIdValueObject.name,
    });
  }
}
