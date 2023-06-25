import { ReviewerAggregate } from '@aggregates/reviewer';
import { BusinessRulesEnforcer } from '@base/use-cases';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import {
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

export interface ReviewerProcessServices {
  reviewerManagementService?: ReviewerManagementDomainService;
}

export interface ReviewerCommand {
  id?: ReviewerIdValueObject;
  name?: ReviewerNameValueObject;
}

export type ReviewerProcessFailures = Array<
  | ReviewerDomainExceptions.DoesNotExist
  | ReviewerDomainExceptions.DoesExist
  | ReviewerDomainExceptions.NotAuthorizedToApprove
  | ReviewerDomainExceptions.NotAuthorizedToReject
>;

export class ReviewerBusinessEnforcer<
  Failures extends ReviewerProcessFailures,
> extends BusinessRulesEnforcer<Failures> {
  exceptions: Failures;
  private reviewer: ReviewerAggregate;
  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }

  async reviewerNameMustNotExist(name: ReviewerNameValueObject) {
    const reviewer = await this.reviewerManagementService.getReviewerByName(
      name,
    );
    if (reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesExist());
    }
  }

  async reviewerIdMustExist(id: ReviewerIdValueObject) {
    const reviewer = await this.reviewerManagementService.getReviewerById(id);
    if (!reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    } else {
      this.reviewer = reviewer;
    }
  }

  async reviewerMustBeAdmin() {
    if (!this.reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesNotExist());
    } else if (!this.reviewer.role.isAdmin()) {
      this.exceptions.push(
        new ReviewerDomainExceptions.NotAuthorizedToApprove(),
      );
    }
  }
}
