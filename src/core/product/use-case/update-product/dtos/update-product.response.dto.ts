export class UpdateProductResponseDto {
  productId: string;
  name?: string;
  price?: {
    amount: number;
    currency: string;
  };
  description?: string;
  image?: string;

  constructor(dto: UpdateProductResponseDto) {
    this.productId = dto.productId;
    if (dto.name) {
      this.name = dto.name;
    }
    if (dto.price) {
      this.price = dto.price;
    }
    if (dto.description) {
      this.description = dto.description;
    }
    if (dto.image) {
      this.image = dto.image;
    }
  }
}
