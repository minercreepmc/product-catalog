export class CreateProductResponseDto {
  readonly productId: string;
  readonly name: string;
  readonly price: {
    amount: number;
    currency: string;
  };
  readonly image: string;
  readonly description: string;
  constructor(options: CreateProductResponseDto) {
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
    this.image = options.image;
    this.description = options.description;
  }
}
