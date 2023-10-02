import {
  ADDRESS_SCHEMA,
  CART_SCHEMA,
  DATABASE_TABLE,
  SHIPPING_FEE_SCHEMA,
} from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.ADDRESS,
    column: ADDRESS_SCHEMA.ID,
  })
  addressId: string;

  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.ID,
  })
  shippingFeeId: string;

  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.CART,
    column: CART_SCHEMA.ID,
  })
  cartId: string;
}
