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

  @ApiProperty({
    example: 'fullName',
    description: 'Full name',
  })
  fullName?: string;
}

export class V1RegisterMemberHttpResponse {
  id: string;
  username: string;
  fullName?: string;
  message?: string;

  constructor(dto: Omit<V1RegisterMemberHttpResponse, 'message'>) {
    this.id = dto.id;
    this.username = dto.username;
    this.fullName = dto.fullName;
    this.message = 'Member registered successfully.';
  }
}
