import { DATABASE_TABLE, DISCOUNT_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.NAME,
  })
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  percentage: number;
}
