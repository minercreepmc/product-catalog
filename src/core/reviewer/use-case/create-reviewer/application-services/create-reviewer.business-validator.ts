import { Injectable } from '@nestjs/common';
import { ReviewerManagementDomainService } from '@reviewer-domain/domain-services';
import { ReviewerBusinessValidator } from '@reviewer-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { CreateReviewerDomainOptions } from '../dtos';

@Injectable()
export class CreateReviewerBusinessValidator extends ReviewerBusinessValidator {
  constructor(reviewerManagementService: ReviewerManagementDomainService) {
    super(reviewerManagementService);
  }
  async validate(
    domainOptions: CreateReviewerDomainOptions,
  ): Promise<ValidationResponse> {
    const { email } = domainOptions;

    this.clearExceptions();
    await this.validateReviewerEmailMustNotExist(email);
    return this.getValidationResponse();
  }
}
