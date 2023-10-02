import { DATABASE_TABLE, DISCOUNT_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountDto {
  @IsOptional()
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.NAME,
  })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
