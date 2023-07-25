import { ApiProperty } from '@nestjs/swagger';

export class V1CreateProductHttpResponse {
  @ApiProperty({
    description: 'The id of the product',
    example: '123',
  })
  readonly id: string;
  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  readonly name: string;
  @ApiProperty()
  readonly price: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Sample description',
  })
  readonly description?: string;

  @ApiProperty({
    description: 'The image of the product',
    example: 'https://example.com/image.png',
  })
  readonly imageUrl?: string;

  @ApiProperty()
  readonly categoryIds?: string[];

  @ApiProperty()
  readonly discountId?: string;

  readonly message: string;

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
