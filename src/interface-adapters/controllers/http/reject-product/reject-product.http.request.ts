import { ApiProperty } from '@nestjs/swagger';

export class RejectProductHttpRequest {
  @ApiProperty({
    description: 'ID of the reviewer',
    example: '1',
  })
  reviewerId: string;

  @ApiProperty({
    description: 'Reason for rejection',
    example: 'Bad stuff',
    minLength: 5,
  })
  reason: string;
}
