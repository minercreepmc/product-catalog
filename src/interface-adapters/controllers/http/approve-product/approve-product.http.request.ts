import { ApiProperty } from '@nestjs/swagger';

export class ApproveProductHttpRequest {
  @ApiProperty({
    description: 'Reviewer Id',
    example: '1',
  })
  reviewerId: string;
}
