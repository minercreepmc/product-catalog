import { DATABASE_TABLE, ORDER_DETAILS_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

export class OrderItemGetByOrderIdDto {
  @isExistDb({
    table: DATABASE_TABLE.ORDER_DETAILS,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  @IsString()
  orderId: string;
}
