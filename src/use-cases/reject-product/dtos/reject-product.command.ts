import { ICommand } from '@nestjs/cqrs';

export class RejectProductCommand implements ICommand {
  reviewerId: string;
  productId: string;
  reason: string;
  constructor(options: RejectProductCommand) {
    const { reviewerId, productId, reason } = options;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.reason = reason;
  }
}
