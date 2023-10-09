import { DATABASE_TABLE, DISCOUNT_SCHEMA, PRODUCT_SCHEMA } from '@constants';
import { isExistDb, isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @isUniqueDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @isExistDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.ID,
  })
  @IsString()
  @IsOptional()
  discountId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categoryIds?: string[];
}

export class DeleteProductsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];
}
export class UpdateProductDto {
  @isUniqueDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.NAME,
  })
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  discountId?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @IsNumber()
  @IsOptional()
  sold?: number;
}
