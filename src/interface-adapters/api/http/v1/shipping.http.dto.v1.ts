import { AddressExists } from '@use-cases/command/address/rules/address-exists.rule';
import { ShippingFeeExists } from '@use-cases/command/shipping/rules';
import { ShipperExists } from '@use-cases/command/users/rules';
import { IsDateString, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsString()
  @AddressExists()
  addressId: string;
  @IsString()
  @ShippingFeeExists()
  feeId: string;
  @IsString()
  @ShipperExists()
  shipperId: string;
}

export class UpdateShippingDto {
  @IsString()
  @ShipperExists()
  shipperId: string;

  @IsDateString()
  deletedAt?: Date;
}
