import { ApiProperty } from '@nestjs/swagger';

export class V1CreateReviewerSagaHttpResponse {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly role: string;
  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly username: string;

  constructor(options: Partial<V1CreateReviewerSagaHttpResponse>) {
    const { id, name, role, email, username } = options;
    this.id = id;
    this.name = name;
    this.role = role;
    this.email = email;
    this.username = username;
    this.message = 'Reviewer created successfully';
  }
}
