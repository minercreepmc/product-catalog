import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  location: string;
}

export class UpdateAddressDto {
  @IsString()
  location: string;
}
