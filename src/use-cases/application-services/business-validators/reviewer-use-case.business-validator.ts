import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { ProcessBase } from '@use-cases/common';
import { ReviewerEmailValueObject } from '@value-objects/reviewer';

export abstract class ReviewerBusinessValidator extends ProcessBase {
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
      this.exceptions.push(new ReviewerDomainExceptions.DoesExist());
    }
  }
}
