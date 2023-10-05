import { CATEGORY_SCHEMA, DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.CATEGORY,
    column: CATEGORY_SCHEMA.NAME,
  })
  name?: string;
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productIds?: string[];
}