import { ApiProperty } from '@nestjs/swagger';

export class V1CreateReviewerHttpResponse {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly role: string;
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly message: string;

  constructor(options: Partial<V1CreateReviewerHttpResponse>) {
    const { id, name, role } = options;
    this.id = id;
    this.name = name;
    this.role = role;
    this.message = 'Reviewer created successfully';
  }
}
