import { isExistDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.PRODUCT;

export class CreateCartItemDto {
  @IsString()
  @isExistDb({
    table: NAME,
    column: SCHEMA.ID,
  })
  productId: string;

  @IsPositive()
  @Transform(({ value }) => Number(value))
  amount: number;
}

export class UpdateCartItemDto {
  @IsPositive()
  @Transform(({ value }) => Number(value))
  amount: number;
}

export class UpsertCartItemDto {
  @IsString()
  @isExistDb({
    table: NAME,
    column: SCHEMA.ID,
  })
  productId: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}
