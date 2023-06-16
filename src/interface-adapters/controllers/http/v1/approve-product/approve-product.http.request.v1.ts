import { ApiProperty } from '@nestjs/swagger';

export class V1ApproveProductHttpRequest {
  @ApiProperty({
    description: 'Reviewer Id',
    example: '1',
  })
  reviewerId: string;
}
