import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsOptional, IsString } from 'class-validator';

export class CreateShipperDto {
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
}
