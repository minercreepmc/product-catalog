import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

const { NAME: PRODUCT_NAME, SCHEMA: PRODUCT_SCHEMA } = DATABASE_TABLE.PRODUCT;

export class AddImageUrlsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  urls: string[];

  @IsString()
  @isExistDb({
    table: PRODUCT_NAME,
    column: PRODUCT_SCHEMA.ID,
  })
  productId: string;
}

export class RemoveImageUrlDto {
  @IsString()
  url: string;

  @IsString()
  @isExistDb({
    table: PRODUCT_NAME,
    column: PRODUCT_SCHEMA.ID,
  })
  productId: string;
}
