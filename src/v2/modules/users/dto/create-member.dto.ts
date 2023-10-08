import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @Length(3, 50)
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
  })
  username: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  fullName? = 'Default User';

  @IsString()
  @IsOptional()
  phone?: string;
}
