import { DATABASE_TABLE, PRODUCT_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.ID,
  })
  productId: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class UpsertCartItemDto {
  @IsString()
  @isExistDb({
    table: DATABASE_TABLE.PRODUCT,
    column: PRODUCT_SCHEMA.ID,
  })
  productId: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}
