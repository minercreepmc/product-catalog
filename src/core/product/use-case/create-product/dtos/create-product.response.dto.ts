export class CreateProductResponseDto {
  readonly productId: string;
  readonly name: string;
  readonly price: {
    amount: number;
    currency: string;
  };
  constructor(options: CreateProductResponseDto) {
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
  }
}
