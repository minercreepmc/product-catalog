import { DATABASE_TABLE, SHIPPING_FEE_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingFeeDto {
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
  })
  name: string;
  @IsNumber()
  fee: number;
}

export class UpdateShippingFeeDto {
  @IsOptional()
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
  })
  name: string;
  @IsNumber()
  @IsOptional()
  fee: number;
}
