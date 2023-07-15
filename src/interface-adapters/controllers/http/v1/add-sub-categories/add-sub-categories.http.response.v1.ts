import { ApiProperty } from '@nestjs/swagger';

export class V1AddSubCategoriesHttpResponse {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  subIds: string[];
  @ApiProperty()
  message: string;

  constructor(options: Omit<V1AddSubCategoriesHttpResponse, 'message'>) {
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
    this.message = 'Subcategories added successfully';
  }
}
