import { DATABASE_TABLE, PRODUCT_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddImageUrlsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  urls: string[];

  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.ID,
  })
  productId: string;
}
