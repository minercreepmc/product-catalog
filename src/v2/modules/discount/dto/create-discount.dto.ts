import { DATABASE_TABLE, DISCOUNT_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiscountDto {
  @isUniqueDb({
    table: DATABASE_TABLE.DISCOUNT,
    column: DISCOUNT_SCHEMA.NAME,
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên giảm giá không được để trống',
  })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({
    message: 'Phầm trăm không được để trống',
  })
  percentage: number;
}
