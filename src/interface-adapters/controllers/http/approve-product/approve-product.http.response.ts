import { ApproveProductResponseDto } from '@use-cases/approve-product/dtos';

export class ApproveProductHttpResponse implements ApproveProductResponseDto {
  productId: string;
  reviewerId: string;
  productStatus: string;
  message: string;

  constructor(dto: ApproveProductResponseDto) {
    const { reviewerId, productId, message, productStatus } = dto;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.message = message;
    this.productStatus = productStatus;
  }
}
