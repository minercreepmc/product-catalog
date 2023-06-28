import { ApiProperty } from '@nestjs/swagger';
import { ReviewerRoleEnum, reviewerRoles } from '@value-objects/reviewer';

export class V1CreateReviewerHttpRequest {
  @ApiProperty({
    description: 'The name of the reviewer',
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description: 'The role of the reviewer',
    example: 'regular',
    enum: reviewerRoles,
  })
  readonly role: ReviewerRoleEnum;
}
