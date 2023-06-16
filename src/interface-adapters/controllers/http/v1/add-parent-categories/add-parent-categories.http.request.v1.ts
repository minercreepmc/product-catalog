import { ApiProperty } from '@nestjs/swagger';

export class V1AddParentCategoriesHttpRequest {
  @ApiProperty()
  categoryId: string;
  @ApiProperty()
  parentIds: string[];
}
