import { ApiProperty } from '@nestjs/swagger';
import { RejectProductResponseDto } from '@use-cases/reject-product/dtos';

export class RejectProductHttpResponse implements RejectProductResponseDto {
  @ApiProperty()
  rejectedBy: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reason: string;

  constructor(options: RejectProductHttpResponse) {
    const { productId, reason, rejectedBy } = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
  }
}
