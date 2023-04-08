import { ICommand } from '@nestjs/cqrs';

export class ApproveProductCommand implements ICommand {
  readonly productId: string
  readonly reviewerId: string;

  constructor(options: ApproveProductCommand) {
    const { reviewerId, productId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}
