import { DATABASE_TABLE, PRODUCT_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.NAME,
  })
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  discountId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categoryIds?: string[];

  @IsOptional()
  @IsNumber()
  sold?: number;
}
