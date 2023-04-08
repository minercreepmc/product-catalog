export class ApproveProductResponseDto {
  readonly productId: string;
  readonly reviewerId: string;
  readonly productStatus: string;
  readonly message: string;

  constructor(options: Omit<ApproveProductResponseDto, 'message'>) {
    const { productId, reviewerId, productStatus } = options;
    this.reviewerId = productId;
    this.productId = reviewerId;
    this.productStatus = productStatus;
  }
}
