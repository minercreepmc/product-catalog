import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class RejectProductRequestDto extends RequestDtoBase<RejectProductResponseDto> {
  reviewerId: string;
  productId: string;
  reason: string;
  constructor(options: Omit<RejectProductRequestDto, 'returnType'>) {
    super();
    const { reviewerId, productId, reason } = options;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.reason = reason;
  }
}

export class RejectProductResponseDto extends ResponseDtoBase {
  rejectedBy: string;
  productId: string;
  reason: string;
  constructor(options: Omit<RejectProductResponseDto, 'message'>) {
    super('Rejected product successfully');
    const { reason, productId, rejectedBy } = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
  }
}
