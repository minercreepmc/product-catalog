import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { Injectable } from '@nestjs/common';
import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@use-cases/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  ValidationResponse,
  ValidationExceptionBase,
} from 'common-base-classes';
import { ApproveProductCommand } from '../dtos';

@Injectable()
export class ApproveProductCommandValidator extends CommandValidatorBase {
  validate(command: ApproveProductCommand): ValidationResponse {
    const { productId, reviewerId } = command;
    this.clearExceptions();
    this.validateProductId(productId);
    this.validateReviewerId(reviewerId);
    return this.getValidationResponse();
  }

  protected validateProductId(productId: string): void {
    const response = ProductIdValueObject.validate(productId);
    this.handlerValidationResponse({
      response,
      context: ProductIdValueObject.name,
    });
  }

  protected validateReviewerId(reviewerId: string): void {
    const response = ReviewerIdValueObject.validate(reviewerId);
    this.handlerValidationResponse({
      response,
      context: ReviewerIdValueObject.name,
    });
  }

  protected translateExceptionToUserFriendlyMessage(
    options: TranslateExceptionToUserFriendlyMessageOptions,
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
}
