import { ICommand } from '@nestjs/cqrs';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateProductWeightCommand {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

class CreateProductAttributeCommand {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateProductWeightCommand)
  weight: CreateProductWeightCommand;
}

class CreateProductPriceCommand {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class CreateProductCommand implements ICommand {
  constructor(dto: CreateProductCommand) {
    this.name = dto?.name;
    this.description = dto?.description;
    this.price = dto?.price;
    this.image = dto?.image;
    this.attributes = dto?.attributes;
  }

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateProductPriceCommand)
  price: CreateProductPriceCommand;

  @IsOptional()
  @IsString()
  @IsDefined()
  description?: string;

  @IsOptional()
  @IsString()
  @IsDefined()
  image?: string;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateProductAttributeCommand)
  attributes?: CreateProductAttributeCommand;
}
