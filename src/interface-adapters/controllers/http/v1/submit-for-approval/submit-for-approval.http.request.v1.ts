import { ApiProperty } from '@nestjs/swagger';

export class V1SubmitForApprovalHttpRequest {
  @ApiProperty({
    description: 'ID of the reviewer',
    example: '1',
  })
  reviewerId: string;
}
