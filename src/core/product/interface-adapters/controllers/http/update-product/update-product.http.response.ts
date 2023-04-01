import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductResponseDto } from '@product-use-case/update-product/dtos';

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
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: {
      amount: 100,
      currency: 'USD',
    },
  })
  price: { amount: number; currency: string };
  constructor(options: UpdateProductResponseDto) {
    const { productId: id, name, price } = options;
    this.productId = id;
    if (name) {
      this.name = name;
    }

    if (price) {
      this.price = price;
    }
  }
}
