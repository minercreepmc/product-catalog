import { ApiProperty } from '@nestjs/swagger';
import { reviewerRoles } from '@value-objects/reviewer';

export class V1CreateReviewerHttpRequest {
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

  @ApiProperty({
    description: 'The role of the reviewer',
    example: 'regular',
    enum: reviewerRoles,
  })
  readonly role: string;

  @ApiProperty({
    description: 'The username of the reviewer',
    example: 'john.doe',
  })
  readonly username: string;

  @ApiProperty({
    description: 'The password of the reviewer',
    example: 'password',
  })
  readonly password: string;
}
