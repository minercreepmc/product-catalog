export class UpdateProductResponseDto {
  id: string;
  name?: string;
  price?: {
    amount: number;
    currency: string;
  };

  constructor(dto: UpdateProductResponseDto) {
    this.id = dto.id;
    if (dto.name) {
      this.name = dto.name;
    }
    if (dto.price) {
      this.price = dto.price;
    }
  }
}
