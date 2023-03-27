import { ApiProperty } from '@nestjs/swagger';

export class CreateProductHttpRequestDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  name: string;
  @ApiProperty({
    description: 'The price of the product',
    type: 'object',
    properties: {
      amount: {
        type: 'number',
        description: 'The amount of the price',
        example: 99.99,
      },
      currency: {
        type: 'string',
        description: 'The currency of the price',
        example: 'USD',
      },
    },
  })
  price: {
    amount: number;
    currency: string;
  };
}
