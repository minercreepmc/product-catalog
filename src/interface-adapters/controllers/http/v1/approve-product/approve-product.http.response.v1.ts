import { ApiProperty } from '@nestjs/swagger';

export class V1ApproveProductHttpResponse {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reviewerId: string;
  @ApiProperty()
  productStatus: string;
  @ApiProperty()
  message: string;

  constructor(dto: Omit<V1ApproveProductHttpResponse, 'message'>) {
    const { reviewerId, productId, productStatus } = dto;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.productStatus = productStatus;
    this.message = 'Product approved';
  }
}
