import { ApiProperty } from '@nestjs/swagger';

export class V1CreateReviewerHttpResponse {
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

  constructor(options: V1CreateReviewerHttpResponse) {
    const { reviewerId, name, email, role, message } = options;
    this.reviewerId = reviewerId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.message = message;
  }
}
