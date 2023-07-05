import { ApiProperty } from '@nestjs/swagger';

export class V1AddParentCategoriesHttpRequest {
  @ApiProperty()
  parentIds: string[];
}
