import { DATABASE_TABLE, ORDER_DETAILS_SCHEMA, USER_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

export class CreateShippingDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.ORDER_DETAILS,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  orderId: string;
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;
}
