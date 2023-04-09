import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ReviewerBusinessValidator } from '@use-cases/application-services/business-validators';
import { ValidationResponse } from 'common-base-classes';
import { CreateReviewerDomainOptions } from '../dtos';

@Injectable()
export class CreateReviewerBusinessValidator extends ReviewerBusinessValidator {
  constructor(reviewerManagementService: ReviewerManagementDomainService) {
    super(reviewerManagementService);
  }
  async execute(
    domainOptions: CreateReviewerDomainOptions,
  ): Promise<ValidationResponse> {
    const { email } = domainOptions;

    this.clearExceptions();
    await this.validateReviewerEmailMustNotExist(email);
    return this.getValidationResult();
  }
}
