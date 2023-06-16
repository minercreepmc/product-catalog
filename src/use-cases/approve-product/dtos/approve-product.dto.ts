import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class ApproveProductRequestDto extends RequestDtoBase<ApproveProductResponseDto> {
  readonly productId: string;
  readonly reviewerId: string;

  constructor(options: Omit<ApproveProductRequestDto, 'returnType'>) {
    super();
    const { reviewerId, productId } = options;
    this.productId = productId;
    this.reviewerId = reviewerId;
  }
}

export class ApproveProductResponseDto extends ResponseDtoBase {
  readonly productId: string;
  readonly reviewerId: string;
  readonly productStatus: string;
  readonly message: string;

  constructor(options: Omit<ApproveProductResponseDto, 'message'>) {
    super('Product approved successfully');
    const { productId, reviewerId, productStatus } = options;
    this.reviewerId = productId;
    this.productId = reviewerId;
    this.productStatus = productStatus;
  }
}
