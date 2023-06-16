import { ApiProperty } from '@nestjs/swagger';
import { SubmitForApprovalResponseDto } from '@use-cases/submit-for-approval/dtos';

export class V1SubmitForApprovalHttpResponse {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reviewerId: string;
  @ApiProperty()
  productStatus: string;
  @ApiProperty()
  message: string;

  constructor(dto: SubmitForApprovalResponseDto) {
    this.productId = dto.productId;
    this.reviewerId = dto.reviewerId;
    this.productStatus = dto.productStatus;
    this.message = dto.message;
  }
}
