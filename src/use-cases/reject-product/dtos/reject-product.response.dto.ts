export class RejectProductResponseDto {
  rejectedBy: string;
  productId: string;
  reason: string;
  constructor(options: RejectProductResponseDto) {
    const { reason, productId, rejectedBy} = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
  }
}
