import { CATEGORY_SCHEMA, DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductGetAllByCategoryDto {
  @isExistDb({
    table: DATABASE_TABLE.CATEGORY,
    column: CATEGORY_SCHEMA.ID,
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
