import { ShipperExists } from '@v2/users/rules';
import { IsDateString, IsString } from 'class-validator';

export class UpdateShippingDto {
  @IsString()
  @ShipperExists()
  shipperId: string;

  @IsDateString()
  deletedAt?: Date;
}
