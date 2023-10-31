import { CATEGORY_SCHEMA, DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Tên danh mục không được để trống',
  })
  @isUniqueDb({
    table: DATABASE_TABLE.CATEGORY,
    column: CATEGORY_SCHEMA.NAME,
    message: 'Tên danh mục đã tồn tại',
  })
  name?: string;
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productIds?: string[];
}
