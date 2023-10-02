import { DATABASE_TABLE, DISCOUNT_SCHEMA, PRODUCT_SCHEMA } from '@constants';
import { isExistDb, isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.NAME,
  })
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.ID,
  })
  discountId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categoryIds?: string[];
}
