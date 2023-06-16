import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class SubmitForApprovalRequestDto extends RequestDtoBase<SubmitForApprovalResponseDto> {
  readonly productId: string;
  readonly reviewerId: string;
  constructor(options: Omit<SubmitForApprovalRequestDto, 'returnType'>) {
    super();
    const { productId, reviewerId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}

export class SubmitForApprovalResponseDto extends ResponseDtoBase {
  readonly productId: string;
  readonly reviewerId: string;
  readonly productStatus: string;
  readonly message: string;

  constructor(options: Omit<SubmitForApprovalResponseDto, 'message'>) {
    super('Review submitted for approval');
    const { productId, reviewerId, productStatus } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
    this.productStatus = productStatus;
  }
}
