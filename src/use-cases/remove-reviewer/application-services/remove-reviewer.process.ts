import { ProcessBase } from '@base/use-cases';
import { RemoveReviewerCommand } from '@commands';
import { ReviewerRemovedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ReviewerBusinessEnforcer } from '@use-cases/application-services/process';

export type RemoveReviewerProcessSuccess = ReviewerRemovedDomainEvent;
export type RemoveReviewerProcessFailure =
  Array<ReviewerDomainExceptions.DoesNotExist>;

@Injectable()
export class RemoveReviewerProcess extends ProcessBase<
  RemoveReviewerProcessSuccess,
  RemoveReviewerProcessFailure
> {
  execute(command: RemoveReviewerCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: RemoveReviewerCommand,
  ): Promise<void> {
    const { id } = command;
    await this.reviewerEnforcer.reviewerIdMustExist(id);
  }

  protected async executeMainTask(
    command: RemoveReviewerCommand,
  ): Promise<RemoveReviewerProcessSuccess> {
    return this.reviewerManagementService.removeReviewer(command);
  }

  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
    private readonly reviewerEnforcer: ReviewerBusinessEnforcer<RemoveReviewerProcessFailure>,
  ) {
    super({
      businessEnforcer: reviewerEnforcer,
    });
  }
}
