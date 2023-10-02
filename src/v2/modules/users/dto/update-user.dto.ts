import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
  })
  @IsString()
  password?: string;
  @IsOptional()
  @IsString()
  fullName?: string;
}
