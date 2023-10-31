import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  IsNotEmpty,
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
    message: 'Tên người dùng đã tồn tại',
  })
  @IsNotEmpty({
    message: 'Tên người dùng không được trống',
  })
  username: string;

  @IsStrongPassword()
  @IsString()
  @IsNotEmpty({
    message: 'Mật khẩu không được trống',
  })
  password: string;

  @IsString()
  @IsOptional()
  fullName? = 'Default User';

  @IsString()
  @IsOptional()
  phone?: string;
}
