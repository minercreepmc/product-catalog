import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryCommand } from '@use-cases/create-category/dtos';

export class V1CreateCategoryHttpRequest implements CreateCategoryCommand {
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
