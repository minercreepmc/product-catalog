import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsDateString, IsOptional, IsString } from 'class-validator';

const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export class CreateShippingDto {
  @IsString()
  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  orderId: string;
  @IsString()
  @isExistDb({
    table: USER_NAME,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;

  @IsDateString()
  dueDate: Date;
}
export class UpdateShippingDto {
  @IsString()
  @isExistDb({
    table: USER_NAME,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;

  @IsDateString()
  deletedAt?: Date;

  @IsDateString()
  dueDate: Date;
}

export class GetShippingByShipperDto {
  @IsOptional()
  @IsString()
  @isExistDb({
    table: USER_NAME,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;
}

export class GetShippingByOrderDto {
  @IsOptional()
  @IsString()
  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  orderId: string;
}
