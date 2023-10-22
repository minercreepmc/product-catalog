import { CART_SCHEMA, DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsOptional, IsString } from 'class-validator';

export class CreateCartDto {}
export class UpdateCartDto {
  @IsString()
  @IsOptional()
  shippingFeeId?: string;

  @IsString()
  @IsOptional()
  addressId: string;
}

export class GetCartItemsDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.CART,
    column: CART_SCHEMA.ID,
  })
  cartId: string;
}
