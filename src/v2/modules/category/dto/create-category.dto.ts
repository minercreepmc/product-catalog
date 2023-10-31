import { CATEGORY_SCHEMA, DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @isUniqueDb({
    table: DATABASE_TABLE.CATEGORY,
    column: CATEGORY_SCHEMA.NAME,
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
