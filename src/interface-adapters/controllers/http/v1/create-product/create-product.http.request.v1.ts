import { ApiProperty } from '@nestjs/swagger';

export class V1CreateProductHttpRequest {
  @ApiProperty()
  name: string;
  @ApiProperty({
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

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Express.Multer.File;
}
