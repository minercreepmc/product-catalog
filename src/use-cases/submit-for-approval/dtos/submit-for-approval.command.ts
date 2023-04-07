import { ICommand } from '@nestjs/cqrs';

export class SubmitForApprovalCommand implements ICommand {
  readonly productId: string;
  readonly reviewerId: string;
  constructor(options: SubmitForApprovalCommand) {
    const { productId, reviewerId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}
