import { ApiProperty } from '@nestjs/swagger';
import { ApproveProductResponseDto } from '@use-cases/approve-product/dtos';

export class V1ApproveProductHttpResponse implements ApproveProductResponseDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reviewerId: string;
  @ApiProperty()
  productStatus: string;
  @ApiProperty()
  message: string;

  constructor(dto: ApproveProductResponseDto) {
    const { reviewerId, productId, message, productStatus } = dto;
    this.reviewerId = reviewerId;
    this.productId = productId;
    this.message = message;
    this.productStatus = productStatus;
  }
}
