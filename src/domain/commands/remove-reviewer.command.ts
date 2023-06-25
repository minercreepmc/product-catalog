import { ReviewerIdValueObject } from '@value-objects/reviewer';

export class RemoveReviewerCommand {
  readonly id: ReviewerIdValueObject;

  constructor(options: RemoveReviewerCommand) {
    this.id = options.id;
  }
}
