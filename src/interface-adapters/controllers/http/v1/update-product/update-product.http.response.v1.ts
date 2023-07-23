import { ApiProperty } from '@nestjs/swagger';

export class V1UpdateProductHttpResponse {
  @ApiProperty({
    description: 'The id of the product',
    example: '123',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  name?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100,
  })
  price?: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Sample description',
  })
  description?: string;

  @ApiProperty({
    description: 'The image of the product',
    example: 'https://example.com/image.png',
  })
  imageUrl?: string;

  @ApiProperty()
  discountId?: string;

  @ApiProperty()
  message: string;

  constructor(options: Omit<V1UpdateProductHttpResponse, 'message'>) {
    const { id, name, price, description, imageUrl, discountId } = options;
    this.id = id;
    if (name) {
      this.name = name;
    }

    if (price) {
      this.price = price;
    }

    if (description) {
      this.description = description;
    }

    if (imageUrl) {
      this.imageUrl = imageUrl;
    }

    if (discountId) {
      this.discountId = discountId;
    }

    this.message = 'Product updated successfully';
  }
}
