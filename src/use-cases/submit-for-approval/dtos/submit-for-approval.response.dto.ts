export class SubmitForApprovalResponseDto {
  readonly productId: string;
  readonly reviewerId: string;
  readonly productStatus: string;
  readonly message: string;

  constructor(options: Omit<SubmitForApprovalResponseDto, 'message'>) {
    const { productId, reviewerId, productStatus } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
    this.productStatus = productStatus;
    this.message = 'Product submitted for approval';
  }
}
