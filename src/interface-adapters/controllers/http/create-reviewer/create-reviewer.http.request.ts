import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewerHttpRequest {
  @ApiProperty({
    description: 'The name of the reviewer',
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description: 'The email of the reviewer',
    example: '6ycjc@example.com',
  })
  readonly email: string;
}
