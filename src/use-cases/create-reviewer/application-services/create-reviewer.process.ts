import { ProcessBase } from '@base/use-cases';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CreateReviewerCommand } from '@src/domain/commands';
import { ReviewerNameValueObject } from '@value-objects/reviewer';

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

  async execute(command: CreateReviewerCommand) {
    const { name } = command;

    this.init();
    await this.reviewerNameMustNotExist(name);
    if (this.exceptions.length === 0) {
      await this.createReviewer(command);
    }
    return this.getValidationResult();
  }

  protected init() {
    this.clearExceptions();
    this.clearValue();
  }

  async reviewerNameMustNotExist(name: ReviewerNameValueObject) {
    const reviewer = await this.reviewerManagementService.getReviewerByName(
      name,
    );
    if (reviewer) {
      this.exceptions.push(new ReviewerDomainExceptions.DoesExist());
    }
  }

  async createReviewer(command: CreateReviewerCommand): Promise<void> {
    const reviewerCreated = await this.reviewerManagementService.createReviewer(
      command,
    );
    this.value = reviewerCreated;
  }
}
