import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../constants';

const { NAME, SCHEMA } = DATABASE_TABLE.ORDER_DETAILS;

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}

export class GetByMemberDto {
  @IsOptional()
  @IsString()
  @isExistDb({
    table: NAME,
    column: SCHEMA.MEMBER_ID,
  })
  memberId: string;
}

export class OrderGetByMemberStatusQueryDto {
  @IsString()
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
