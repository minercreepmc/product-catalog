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

export class V1CreateProductHttpResponse {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryIds?: string[];
  discountId?: string;
  message?: string;

  constructor(options: Omit<V1CreateProductHttpResponse, 'message'>) {
    this.id = options.id;
    this.name = options.name;
    this.price = options.price;
    this.description = options.description;
    this.imageUrl = options.imageUrl;
    this.categoryIds = options.categoryIds;
    this.discountId = options.discountId;
    this.message = 'Product created successfully';
  }
}
