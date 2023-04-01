import { ApiProperty } from '@nestjs/swagger';

export class CreateProductHttpResponse {
  @ApiProperty({
    description: 'The id of the product',
    example: '123',
  })
  readonly productId: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  readonly name: string;
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
  readonly price: {
    readonly amount: number;
    readonly currency: string;
  };

  readonly message: string;

  constructor(options: Omit<CreateProductHttpResponse, 'message'>) {
    this.productId = options.productId;
    this.name = options.name;
    this.price = options.price;
    this.message = 'Product created successfully';
  }
}
