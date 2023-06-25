import { ApiProperty } from '@nestjs/swagger';

export class V1RejectProductHttpResponse {
  @ApiProperty()
  rejectedBy: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  reason: string;
  @ApiProperty()
  message: string;

  constructor(options: Omit<V1RejectProductHttpResponse, 'message'>) {
    const { productId, reason, rejectedBy } = options;
    this.rejectedBy = rejectedBy;
    this.productId = productId;
    this.reason = reason;
    this.message = 'Rejected product';
  }
}
