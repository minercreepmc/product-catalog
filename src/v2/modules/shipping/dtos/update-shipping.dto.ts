import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsDateString, IsString } from 'class-validator';

export class UpdateShippingDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;

  @IsDateString()
  deletedAt?: Date;
}
