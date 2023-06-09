import { ProcessBase } from '@base/use-cases';
import { CreateReviewerCommand } from '@commands';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ReviewerBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type CreateReviewerProcessSuccess = ReviewerCreatedDomainEvent;
export type CreateReviewerProcessFailure =
  Array<ReviewerDomainExceptions.DoesExist>;

@Injectable()
export class CreateReviewerProcess extends ProcessBase<
  CreateReviewerProcessSuccess,
  CreateReviewerProcessFailure
> {
  execute(command: CreateReviewerCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: CreateReviewerCommand,
  ): Promise<void> {
    const { name } = command;

    await this.reviewerEnforcer.reviewerNameMustNotExist(name);
  }

  protected async executeMainTask(
    command: CreateReviewerCommand,
  ): Promise<CreateReviewerProcessSuccess> {
    return this.reviewerManagementService.createReviewer(command);
  }

  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
    private readonly reviewerEnforcer: ReviewerBusinessEnforcer<CreateReviewerProcessFailure>,
  ) {
    super({
      businessEnforcer: reviewerEnforcer,
    });
  }
}
