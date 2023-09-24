import { IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  fullName?: string;
}

export class CreateShipperDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  fullName?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;
  @IsOptional()
  @IsString()
  fullName?: string;
}
