import { ShippingFeeConflict } from '@use-cases/command/shipping/rules';
import { IsNumber, IsString } from 'class-validator';

export class CreateShippingFeeDto {
  @IsString()
  @ShippingFeeConflict()
  name: string;
  @IsNumber()
  fee: number;
}

export class UpdateShippingFeeDto {
  @IsString()
  @ShippingFeeConflict()
  name: string;
  @IsNumber()
  fee: number;
}
