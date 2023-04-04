import { BusinessValidatorBase } from '@common-use-case/business-validator.base';
import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import { ReviewerManagementDomainService } from '@reviewer-domain/domain-services';
import { ReviewerEmailValueObject } from '@reviewer-domain/value-objects';

export abstract class ReviewerBusinessValidator extends BusinessValidatorBase {
  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }
  async validateReviewerEmailMustNotExist(
    email: ReviewerEmailValueObject,
  ): Promise<void> {
    const reviewer = await this.reviewerManagementService.getReviewerByEmail(
      email,
    );
    if (reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.IsExist());
    }
  }
}
