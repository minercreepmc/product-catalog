import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @Length(3, 50)
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
  })
  username: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  fullName? = 'Default User';
}
