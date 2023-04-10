import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { ReviewerEmailValueObject } from '@value-objects/reviewer';
import { CreateReviewerDomainOptions } from '../dtos';

export type CreateReviewerProcessSuccess = ReviewerCreatedDomainEvent;
export type CreateReviewerProcessFailure =
  Array<ReviewerDomainExceptions.DoesExist>;

@Injectable()
export class CreateReviewerProcess extends ProcessBase<
  CreateReviewerProcessSuccess,
  CreateReviewerProcessFailure
> {
  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
  ) {
    super();
  }

  emailExist: boolean;

  async execute(domainOptions: CreateReviewerDomainOptions) {
    const { email } = domainOptions;

    this.init();
    await this.reviewerEmailMustNotExist(email);
    await this.createReviewerIfEmailNotExist(domainOptions);
    return this.getValidationResult();
  }

  protected init() {
    this.clearExceptions();
    this.emailExist = false;
  }

  async reviewerEmailMustNotExist(
    email: ReviewerEmailValueObject,
  ): Promise<void> {
    const reviewer = await this.reviewerManagementService.getReviewerByEmail(
      email,
    );
    if (reviewer) {
      this.emailExist = true;
      this.exceptions.push(new ReviewerDomainExceptions.DoesExist());
    }
  }

  async createReviewerIfEmailNotExist(
    domainOptions: CreateReviewerDomainOptions,
  ): Promise<void> {
    if (this.emailExist) {
      return;
    }
    const reviewerCreated = await this.reviewerManagementService.createReviewer(
      domainOptions,
    );
    this.value = reviewerCreated;
  }
}
