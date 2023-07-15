import { ApiProperty } from '@nestjs/swagger';

export class V1AddSubCategoriesHttpRequest {
  @ApiProperty()
  subIds: string[];
}
