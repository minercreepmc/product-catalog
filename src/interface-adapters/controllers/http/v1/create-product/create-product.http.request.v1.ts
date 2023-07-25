import { ApiProperty } from '@nestjs/swagger';

export class V1CreateProductHttpRequest {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  image?: Express.Multer.File;

  @ApiProperty()
  categoryIds?: string[];

  @ApiProperty()
  discountId?: string;
}
