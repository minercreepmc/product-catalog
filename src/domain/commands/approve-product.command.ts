import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export class ApproveProductCommand {
  readonly productId: ProductIdValueObject;
  readonly reviewerId: ReviewerIdValueObject;

  constructor(options: ApproveProductCommand) {
    const { reviewerId, productId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}
