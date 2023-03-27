export class UpdateProductResponseDto {
  name: string;
  price: {
    amount: number;
    currency: string;
  };

  constructor(dto: UpdateProductResponseDto) {
    this.name = dto.name;
    this.price = dto.price;
  }
}
