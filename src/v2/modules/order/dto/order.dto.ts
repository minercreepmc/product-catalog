import {
  ADDRESS_SCHEMA,
  CART_SCHEMA,
  DATABASE_TABLE,
  USER_SCHEMA,
} from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../constants';

export class CreateOrderDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.ADDRESS,
    column: ADDRESS_SCHEMA.ID,
  })
  addressId: string;

  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.CART,
    column: CART_SCHEMA.ID,
  })
  cartId: string;
}

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}

export class GetByMemberDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.ID,
  })
  memberId: string;
}
