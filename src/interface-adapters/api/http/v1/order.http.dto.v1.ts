import { AddressExists } from '@use-cases/command/address/rules/address-exists.rule';
import { ProductsExists } from '@use-cases/command/products/rules';
import { ShippingFeeExists } from '@use-cases/command/shipping/rules';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @AddressExists()
  addressId: string;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsString()
  @ShippingFeeExists()
  shippingFeeId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ProductsExists()
  productIds: string[];
}
