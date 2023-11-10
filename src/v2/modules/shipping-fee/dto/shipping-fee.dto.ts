import { DATABASE_TABLE, SHIPPING_FEE_SCHEMA } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingFeeDto {
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
    message: 'Tên phí đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên phí không được để trống',
  })
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({
    message: 'Phí không được để trống',
  })
  fee: number;
}

export class UpdateShippingFeeDto {
  @isUniqueDb({
    table: DATABASE_TABLE.SHIPPING_FEE,
    column: SHIPPING_FEE_SCHEMA.NAME,
    message: 'Tên phí đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên phí không được để trống',
  })
  @IsOptional()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({
    message: 'Phí không được để trống',
  })
  @IsOptional()
  fee: number;
}
