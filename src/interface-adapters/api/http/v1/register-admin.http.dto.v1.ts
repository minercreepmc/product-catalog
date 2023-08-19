import { ApiProperty } from '@nestjs/swagger';

export class V1RegisterAdminHttpRequest {
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

export class V1RegisterAdminHttpResponse {
  id: string;
  username: string;
  fullName?: string;
  message?: string;

  constructor(dto: Omit<V1RegisterAdminHttpResponse, 'message'>) {
    this.id = dto.id;
    this.username = dto.username;
    this.fullName = dto.fullName;
    this.message = 'Member registered successfully.';
  }
}
