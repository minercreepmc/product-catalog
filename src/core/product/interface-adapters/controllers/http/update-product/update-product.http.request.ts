import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductHttpRequest {
  @ApiProperty({
    description: 'The id of the product',
    example: '123',
  })
  id: string;
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
  price: {
    amount: number;
    currency: string;
  };
}
