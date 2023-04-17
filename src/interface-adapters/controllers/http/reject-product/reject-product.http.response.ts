import { RejectProductResponseDto } from '@use-cases/reject-product/dtos';

export class RejectProductHttpResponse implements RejectProductResponseDto {
  rejectedBy: string;
  productId: string;
  reason: string;

  constructor(options: RejectProductHttpResponse) {
    const { productId, reason, rejectedBy } = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
  }
}
