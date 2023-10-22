import { DATABASE_TABLE, USER_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../constants';

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
