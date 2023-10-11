import { ADDRESS_SCHEMA, DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../constants';

export class CreateOrderDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.ADDRESS,
    column: ADDRESS_SCHEMA.ID,
  })
  addressId: string;
}

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}

export class GetByMemberDto {
  @IsOptional()
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.USERS,
    column: USER_SCHEMA.ID,
  })
  memberId: string;
}
