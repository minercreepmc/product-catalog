import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../constants';

export class CreateUserDto {
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
  })
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsString()
  @IsEnum(UserRole)
  role: string;
}
