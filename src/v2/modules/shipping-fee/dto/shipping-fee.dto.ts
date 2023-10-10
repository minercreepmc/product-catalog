import { DATABASE_TABLE, SHIPPING_FEE_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingFeeDto {
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
  })
  @IsString()
  name: string;
  @IsNumber()
  @Transform(({ value }) => Number(value))
  fee: number;
}

export class UpdateShippingFeeDto {
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
  })
  @IsString()
  @IsOptional()
  name: string;
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  fee: number;
}
