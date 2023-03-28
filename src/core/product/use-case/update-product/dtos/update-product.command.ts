import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProductPriceCommand {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class UpdateProductCommand {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateProductPriceCommand)
  price: UpdateProductPriceCommand;

  constructor(options: UpdateProductCommand) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
  }
}
