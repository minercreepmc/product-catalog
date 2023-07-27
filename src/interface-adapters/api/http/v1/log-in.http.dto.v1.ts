import { ApiProperty } from '@nestjs/swagger';

export class V1LogInHttpRequest {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class V1LogInHttpResponse {
  cookie: string;

  constructor(options: V1LogInHttpResponse) {
    this.cookie = options.cookie;
  }
}
