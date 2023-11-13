import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingFeeDto {
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
