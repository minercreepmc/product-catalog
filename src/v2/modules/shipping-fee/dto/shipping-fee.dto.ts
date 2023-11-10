import { DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

const { NAME, SCHEMA } = DATABASE_TABLE.SHIPPING_FEE;

export class CreateShippingFeeDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
    message: 'Tên phí đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên phí không được để trống',
  })
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'Phí không được để trống',
  })
  fee: number;
}

export class UpdateShippingFeeDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
    message: 'Tên phí đã tồn tại',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên phí không được để trống',
  })
  @IsOptional()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'Phí không được để trống',
  })
  @IsOptional()
  fee: number;
}
