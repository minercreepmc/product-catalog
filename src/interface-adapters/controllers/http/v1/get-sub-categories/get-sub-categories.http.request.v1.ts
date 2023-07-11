import { ApiProperty } from '@nestjs/swagger';

export class V1GetSubCategoriesHttpRequest {
  @ApiProperty()
  where?: any;
  @ApiProperty({
    example: ['name', 'description'],
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
