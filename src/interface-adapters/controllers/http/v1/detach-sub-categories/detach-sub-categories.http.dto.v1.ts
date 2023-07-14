import { ApiProperty } from '@nestjs/swagger';

export class V1DetachSubCategoriesHttpRequest {
  @ApiProperty()
  subIds: string[];
}

export class V1DetachSubCategoriesHttpResponse {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  subIds: string[];

  @ApiProperty()
  message: string;

  constructor(options: Omit<V1DetachSubCategoriesHttpResponse, 'message'>) {
    this.categoryId = options.categoryId;
    this.subIds = options.subIds;
    this.message = 'Subcategories detached successfully';
  }
}
