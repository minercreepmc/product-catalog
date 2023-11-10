import { isExistDb, isUniqueDb } from '@youba/nestjs-dbvalidator';
import {  Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.PRODUCT;
const { NAME: DISCOUNT_NAME, SCHEMA: DISCOUNT_SCHEMA } =
  DATABASE_TABLE.DISCOUNT;

export class CreateProductDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
    message: 'Tên hàng đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  name: string;

  @IsNumber()
  @Type(() => Number)
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
    table: DISCOUNT_NAME,
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
    table: NAME,
    column: SCHEMA.NAME,
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
  @Type(() => Number)
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
