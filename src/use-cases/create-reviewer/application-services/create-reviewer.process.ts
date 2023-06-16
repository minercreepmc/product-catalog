import { ProcessBase } from '@base/use-cases';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CreateReviewerCommand } from '@src/domain/commands';
import { ReviewerEmailValueObject } from '@value-objects/reviewer';

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

  async execute(command: CreateReviewerCommand) {
    const { email } = command;

    this.init();
    await this.reviewerEmailMustNotExist(email);
    await this.createReviewerIfEmailNotExist(command);
    return this.getValidationResult();
  }

  protected init() {
    this.clearExceptions();
    this.clearValue();
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
    command: CreateReviewerCommand,
  ): Promise<void> {
    if (this.emailExist) {
      return;
    }
    const reviewerCreated = await this.reviewerManagementService.createReviewer(
      command,
    );
    this.value = reviewerCreated;
  }
}
