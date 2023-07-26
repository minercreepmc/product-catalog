import { ApiProperty } from '@nestjs/swagger';

export class V1RegisterMemberHttpRequest {
  @ApiProperty({
    example: 'username',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password',
  })
  password: string;
}

export class V1RegisterMemberHttpResponse {
  @ApiProperty()
  username: string;
  @ApiProperty()
  message?: string;

  constructor(dto: Omit<V1RegisterMemberHttpResponse, 'message'>) {
    this.username = dto.username;
    this.message = 'Member registered successfully.';
  }
}
