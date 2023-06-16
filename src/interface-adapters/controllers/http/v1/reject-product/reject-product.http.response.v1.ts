import { ApiProperty } from '@nestjs/swagger';
import { RejectProductResponseDto } from '@use-cases/reject-product/dtos';

export class V1RejectProductHttpResponse {
  @ApiProperty()
  rejectedBy: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reason: string;
  @ApiProperty()
  message: string;

  constructor(options: V1RejectProductHttpResponse) {
    const { productId, reason, rejectedBy, message } = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
    this.message = message;
  }
}
