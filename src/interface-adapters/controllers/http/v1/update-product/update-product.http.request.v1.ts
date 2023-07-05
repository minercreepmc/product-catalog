import { ApiProperty } from '@nestjs/swagger';

export class V1UpdateProductHttpRequest {
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

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Express.Multer.File;
}
