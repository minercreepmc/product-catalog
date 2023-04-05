import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductResponseDto } from '@use-cases/update-product/dtos';

export class UpdateProductHttpResponse implements UpdateProductResponseDto {
  @ApiProperty({
    description: 'The id of the product',
    example: '123',
  })
  productId: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  name?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: {
      amount: 100,
      currency: 'USD',
    },
  })
  price?: { amount: number; currency: string };

  @ApiProperty({
    description: 'The description of the product',
    example: 'Sample description',
  })
  description?: string;

  @ApiProperty({
    description: 'The image of the product',
    example: 'https://example.com/image.png',
  })
  image?: string;

  constructor(options: UpdateProductResponseDto) {
    const { productId: id, name, price, description, image } = options;
    this.productId = id;
    if (name) {
      this.name = name;
    }

    if (price) {
      this.price = price;
    }

    if (description) {
      this.description = description;
    }

    if (image) {
      this.image = image;
    }
  }
}
