import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewerCommand } from '@use-cases/create-reviewer/dtos';
import { reviewerRoles } from '@value-objects/reviewer';

export class V1CreateReviewerHttpRequest implements CreateReviewerCommand {
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
}
