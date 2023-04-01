export class UpdateProductPriceCommand {
  amount: number;
  currency: string;
}

export class UpdateProductCommand {
  id: string;
  name: string;
  price: UpdateProductPriceCommand;

  constructor(options: UpdateProductCommand) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
  }
}
