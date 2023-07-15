import { ApiProperty } from '@nestjs/swagger';

export class V1DetachParentCategoriesHttpRequest {
  @ApiProperty()
  parentIds: string[];
}

export class V1DetachParentCategoriesHttpResponse {
  categoryId: string;
  parentIds: string[];
  message?: string;
  constructor(options: Omit<V1DetachParentCategoriesHttpResponse, 'message'>) {
    this.categoryId = options.categoryId;
    this.parentIds = options.parentIds;
    this.message = 'Parents detached successfully';
  }
}
