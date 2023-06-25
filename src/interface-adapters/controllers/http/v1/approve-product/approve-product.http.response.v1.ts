import { ApiProperty } from '@nestjs/swagger';
import { ApproveProductResponseDto } from '@use-cases/approve-product/dtos';

export class V1ApproveProductHttpResponse {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reviewerId: string;
  @ApiProperty()
  productStatus: string;
  @ApiProperty()
  message: string;

  constructor(dto: Omit<ApproveProductResponseDto, 'message'>) {
    const { reviewerId, productId, productStatus } = dto;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.productStatus = productStatus;
    this.message = 'Product approved';
  }
}
