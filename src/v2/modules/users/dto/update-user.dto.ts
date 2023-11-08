import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.USERNAME,
    message: 'Tên người dùng đã tồn tại',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty({
    message: 'Tên không được trống',
  })
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsNotEmpty({
    message: 'Số điện thoại không được trống',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.EMAIL,
    message: 'Email đã tồn tại',
  })
  @IsOptional()
  email?: string;
}
