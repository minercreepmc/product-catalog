export class CreateProductResponseDto {
  readonly name: string;
  readonly price: {
    amount: number;
    currency: string;
  };
  constructor(options: CreateProductResponseDto) {
    this.name = options.name;
    this.price = options.price;
  }
}
