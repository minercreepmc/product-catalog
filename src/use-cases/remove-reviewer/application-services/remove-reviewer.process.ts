import { ProcessBase } from '@base/use-cases';
import { CreateReviewerCommand, RemoveReviewerCommand } from '@commands';
import { ReviewerRemovedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { ReviewerBusinessEnforcer } from '@use-cases/application-services/process';

export type RemoveReviewerProcessSuccess = ReviewerRemovedDomainEvent;
export type RemoveReviewerProcessFailure =
  Array<ReviewerDomainExceptions.DoesNotExist>;

export class RemoveReviewerProcess extends ProcessBase<
  RemoveReviewerProcessSuccess,
  RemoveReviewerProcessFailure
> {
  execute(command: CreateReviewerCommand) {
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
    return this.removeReviewer(command);
  }

  private removeReviewer(command: RemoveReviewerCommand) {
    const { id } = command;
    return this.reviewerManagementService.removeReviewer({
      id,
    });
  }

  constructor(
    private readonly reviewerManagementService: ReviewerManagementDomainService,
    protected readonly reviewerEnforcer: ReviewerBusinessEnforcer<RemoveReviewerProcessFailure>,
  ) {
    super({
      businessEnforcer: reviewerEnforcer,
    });
  }
}
