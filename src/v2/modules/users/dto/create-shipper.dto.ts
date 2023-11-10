import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateShipperDto {
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
    message: 'Tên người dùng đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên người dùng không được trống',
  })
  username: string;

  @IsString()
  @IsNotEmpty({
    message: 'Mật khẩu không được trống',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Tên không được trống',
  })
  fullName: string;

  @IsNumberString()
  @IsNotEmpty({
    message: 'Số điện thoại không được trống',
  })
  phone: string;
}
