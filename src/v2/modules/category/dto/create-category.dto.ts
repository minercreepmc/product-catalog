import { CATEGORY_SCHEMA, DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @isUniqueDb({
    table: DATABASE_TABLE.CATEGORY,
    column: CATEGORY_SCHEMA.NAME,
  })
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
}
