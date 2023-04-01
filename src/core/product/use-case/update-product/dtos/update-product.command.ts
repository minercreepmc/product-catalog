export class UpdateProductPriceCommand {
  amount: number;
  currency: string;
}

export class UpdateProductCommand {
  productId: string;
  name: string;
  price: UpdateProductPriceCommand;

  constructor(options: UpdateProductCommand) {
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
  }
}
