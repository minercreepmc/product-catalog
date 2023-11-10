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
    message: 'Tên hàng đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({
    message: 'Giá không được để trống',
  })
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
    message: 'Tên hàng hóa đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  @IsOptional()
  name: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Giá không được để trống',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  discountId?: string | null;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @IsNumber()
  @IsOptional()
  sold?: number;
}
