import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { DATABASE_TABLE } from '@constants';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

const { NAME, SCHEMA } = DATABASE_TABLE.CATEGORY;

export class CreateCategoryDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên danh mục không được để trống',
  })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Tên danh mục không được để trống',
  })
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
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
