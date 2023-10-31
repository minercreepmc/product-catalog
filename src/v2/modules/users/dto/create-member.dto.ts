import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateMemberDto {
  @Length(3, 50)
  @IsString()
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
  @IsNotEmpty({
    message: 'Tên người dùng không được trống',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Số điện thoại không được trống',
  })
  phone: string;
}
