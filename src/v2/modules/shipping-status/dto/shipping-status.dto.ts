import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;
const { NAME: SHIPPING_NAME, SCHEMA: SHIPPING_SCHEMA } =
  DATABASE_TABLE.SHIPPING;

export class CreateShippingStatusDto {
  @IsString()
  @IsNotEmpty({
    message: 'Tình trạng đơn không được để trống'
  })
  status: string;

  @isExistDb({
    table: SHIPPING_NAME,
    column: SHIPPING_SCHEMA.ID,
  })
  @IsString()
  shippingId: string;
}

export class UpdateShippingStatusDto {
  @IsString()
  @IsOptional()
  status: string;
}

export class GetByShippingIdDto {
  @isExistDb({
    table: SHIPPING_NAME,
    column: SHIPPING_SCHEMA.ID,
  })
  @IsString()
  shippingId: string;
}

export class GetByOrderIdDto {
  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  @IsNotEmpty()
  orderId: string;
}
