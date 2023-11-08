import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../constants';

export class CreateUserDto {
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsOptional()
  fullName?: string | undefined;

  @IsEnum(UserRole)
  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  email?: string | undefined;

  @IsString()
  @IsOptional()
  phone?: string | undefined;
}
