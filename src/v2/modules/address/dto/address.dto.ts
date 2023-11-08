import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({
    message: 'Địa chỉ không được trống',
  })
  location: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty({
    message: 'Địa chỉ không được trống',
  })
  location: string;
}
