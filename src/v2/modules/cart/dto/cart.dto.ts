import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsOptional, IsString } from 'class-validator';

const { NAME, SCHEMA } = DATABASE_TABLE.CART;

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
    table: NAME,
    column: SCHEMA.ID,
  })
  cartId: string;
}
