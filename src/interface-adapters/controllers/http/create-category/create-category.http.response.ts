import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryResponseDto } from '@use-cases/create-category/dtos';

export class CreateCategoryHttpResponse implements CreateCategoryResponseDto {
  @ApiProperty()
  id: string;
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

  constructor(response: CreateCategoryHttpResponse) {
    this.id = response.id;
    this.name = response.name;
    this.description = response.description;
    this.parentIds = response.parentIds;
    this.subCategoryIds = response.subCategoryIds;
    this.productIds = response.productIds;
  }
}
