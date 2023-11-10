import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsNotEmpty, IsString } from 'class-validator';

const { NAME: CATEGORY_NAME, SCHEMA: CATEGORY_SCHEMA } =
  DATABASE_TABLE.CATEGORY;

export class ProductGetAllByCategoryDto {
  @isExistDb({
    table: CATEGORY_NAME,
    column: CATEGORY_SCHEMA.ID,
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
