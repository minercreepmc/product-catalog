import { ApiProperty } from '@nestjs/swagger';

export class V1GetProductsHttpRequest {
  @ApiProperty({
    example: ['name', 'price', 'description'],
  })
  fields?: string[];

  @ApiProperty({
    example: 0,
  })
  offset?: number;

  @ApiProperty({
    example: 0,
  })
  limit?: number;
}
