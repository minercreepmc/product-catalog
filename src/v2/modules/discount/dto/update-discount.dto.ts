import { DATABASE_TABLE, DISCOUNT_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountDto {
  @isUniqueDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.NAME,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  percentage?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
