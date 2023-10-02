import { CART_SCHEMA, DATABASE_TABLE, SHIPPING_FEE_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

export class CreateCartDto {}
export class UpdateCartDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.ID,
  })
  shippingFeeId: string;
}

export class GetCartItemsDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.CART,
    column: CART_SCHEMA.ID,
  })
  cartId: string;
}
