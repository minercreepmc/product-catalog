import { ApiProperty } from '@nestjs/swagger';

export class ApproveProductHttpRequest {
  @ApiProperty({
    description: 'Product Id',
    example: '1',
  })
  productId: string;

  @ApiProperty({
    description: 'Reviewer Id',
    example: '1',
  })
  reviewerId: string;
}
