import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export class RejectProductCommand {
  reviewerId: ReviewerIdValueObject;
  productId: ProductIdValueObject;
  reason: RejectionReasonValueObject;
  constructor(options: RejectProductCommand) {
    const { reviewerId, productId, reason } = options;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.reason = reason;
  }
}
