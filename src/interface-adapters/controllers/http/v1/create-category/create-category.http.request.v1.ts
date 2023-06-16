import { ApiProperty } from '@nestjs/swagger';

export class V1CreateCategoryHttpRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  parentIds?: string[];
  @ApiProperty()
  subCategoryIds?: string[];
  @ApiProperty()
  productIds?: string[];
}
