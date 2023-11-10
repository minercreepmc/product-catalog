import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;

export class OrderItemGetByOrderIdDto {
  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  @IsString()
  orderId: string;
}
