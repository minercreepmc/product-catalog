import { ICommand } from '@nestjs/cqrs';

class CreateProductPriceCommand {
  amount: number;
  currency: string;
}

export class CreateProductCommand implements ICommand {
  constructor(dto: CreateProductCommand) {
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    this.image = dto.image;
  }

  name: string;
  price: CreateProductPriceCommand;
  description?: string;
  image?: string;
}
