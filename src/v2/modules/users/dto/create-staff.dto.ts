import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
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
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
