import { IsString } from 'class-validator';

export class CreateShippingStatusDto {
  @IsString()
  status: string;
  @IsString()
  shippingId: string;
}

export class UpdateShippingStatusDto {
  @IsString()
  status: string;
}
