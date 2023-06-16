import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export class SubmitForApprovalCommand {
  readonly productId: ProductIdValueObject;
  readonly reviewerId: ReviewerIdValueObject;
  constructor(options: SubmitForApprovalCommand) {
    const { productId, reviewerId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}
