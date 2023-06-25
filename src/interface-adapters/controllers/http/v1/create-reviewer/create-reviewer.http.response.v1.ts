import { ApiProperty } from '@nestjs/swagger';

export class V1CreateReviewerHttpResponse {
  @ApiProperty()
  readonly reviewerId: string;
  @ApiProperty()
  readonly name: string;
  //@ApiProperty()
  //readonly email: string;
  @ApiProperty()
  readonly role: string;
  @ApiProperty()
  readonly message: string;

  constructor(options: Omit<V1CreateReviewerHttpResponse, 'message'>) {
    const { reviewerId, name, role } = options;
    this.reviewerId = reviewerId;
    this.name = name;
    //this.email = email;
    this.role = role;
    this.message = 'Reviewer created successfully';
  }
}
