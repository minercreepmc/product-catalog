import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class V1RegisterMemberHttpRequest {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
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
