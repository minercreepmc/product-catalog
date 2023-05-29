import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewerResponseDto } from '@use-cases/create-reviewer/dtos';

export class CreateReviewerHttpResponse implements CreateReviewerResponseDto {
  @ApiProperty()
  readonly reviewerId: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly role: string;
  @ApiProperty()
  readonly message: string;

  constructor(options: CreateReviewerHttpResponse) {
    const { reviewerId, name, email, role, message } = options;
    this.reviewerId = reviewerId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.message = message;
  }
}
