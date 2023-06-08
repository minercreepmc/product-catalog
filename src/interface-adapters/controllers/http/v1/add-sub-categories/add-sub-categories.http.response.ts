import { ApiProperty } from '@nestjs/swagger';
import { AddSubCategoriesResponseDto } from '@use-cases/add-sub-categories/dtos';

export class V1AddSubCategoriesHttpResponse
  implements AddSubCategoriesResponseDto
{
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  subCategoryIds: string[];

  constructor(options: V1AddSubCategoriesHttpResponse) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
  }
}
