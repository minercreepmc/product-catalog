import { PaginationParams } from '@common/dto';
import { DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { USERS_ROLE } from '../constants';

const { NAME, SCHEMA } = DATABASE_TABLE.USERS;

export class CreateUserDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
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

  @IsEnum(USERS_ROLE)
  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  email?: string | undefined;

  @IsString()
  @IsOptional()
  phone?: string | undefined;
}

export class UpdateUserDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
    message: 'Tên người dùng đã tồn tại',
  })
  @IsString()
  @IsOptional()
  password?: string | undefined;

  @IsString()
  @IsNotEmpty({
    message: 'Tên không được trống',
  })
  @IsOptional()
  fullName?: string | undefined;

  @IsString()
  @IsNotEmpty({
    message: 'Số điện thoại không được trống',
  })
  @IsOptional()
  phone?: string | undefined;

  @IsString()
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.EMAIL,
    message: 'Email đã tồn tại',
  })
  @IsOptional()
  email?: string | undefined;
}

export class CreateStaffDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
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
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.EMAIL,
    message: 'Email đã tồn tại',
  })
  @IsOptional()
  email?: string;
}

export class CreateShipperDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
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

export class CreateMemberDto {
  @Length(3, 50)
  @IsString()
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
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

export class CreateAdminDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.USERNAME,
  })
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  fullName? = 'Default User';

  @IsString()
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.EMAIL,
    message: 'Email đã tồn tại',
  })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class ShipperGetAllDto extends PaginationParams {}
