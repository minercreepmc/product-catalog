import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductHttpRequest {
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
  price?: {
    amount: number;
    currency: string;
  };

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
}
