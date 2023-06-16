import { ApiProperty } from '@nestjs/swagger';

export class V1AddSubCategoriesHttpResponse {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  subCategoryIds: string[];
  @ApiProperty()
  message: string;

  constructor(options: V1AddSubCategoriesHttpResponse) {
    this.categoryId = options.categoryId;
    this.subCategoryIds = options.subCategoryIds;
    this.message = options.message;
  }
}
